import * as THREE from 'three';
import { Artifact, Model3D } from '../../../types';
import { ARSessionState, GarmentOrientation } from './arTypes';
import { BuiltArtifactModel, loadOrBuildArtifact3DModel } from './artifact3DBuilder';

export interface WebXRARManagerCallbacks {
  onStateChange: (state: ARSessionState) => void;
  onSurfaceDetected: (detected: boolean) => void;
  onModelLoaded: (builtModel: BuiltArtifactModel) => void;
  onError: (errorMsg: string) => void;
}

export class WebXRARManager {
  private session: any = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private reticle: THREE.Mesh | null = null;
  private modelContainer: THREE.Group | null = null;
  private builtModel: BuiltArtifactModel | null = null;
  private hitTestSource: any = null;
  private referenceSpace: any = null;

  private isPlaced = false;
  private surfaceDetected = false;
  private currentScaleMultiplier = 1.0;
  private currentRotationY = 0;
  private callbacks: WebXRARManagerCallbacks;

  constructor(callbacks: WebXRARManagerCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Starts a real WebXR Immersive-AR camera session with surface hit-testing.
   */
  public async startSession(
    canvas: HTMLCanvasElement,
    overlayElement: HTMLElement,
    artifact: Artifact,
    linkedModel?: Model3D,
    initialOrientation: GarmentOrientation = 'draped-vertical'
  ): Promise<void> {
    if (typeof navigator === 'undefined' || !('xr' in navigator)) {
      throw new Error('WebXR is not available in this browser environment.');
    }

    this.callbacks.onStateChange('waiting-permission');

    try {
      // 1. Request Immersive-AR session directly following user click
      const sessionInit: any = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'local-floor', 'light-estimation'],
      };

      if (overlayElement) {
        sessionInit.domOverlay = { root: overlayElement };
      }

      const session = await (navigator as any).xr.requestSession('immersive-ar', sessionInit);
      this.session = session;

      // 2. Set up Three.js Scene & Lights
      const scene = new THREE.Scene();
      this.scene = scene;

      const camera = new THREE.PerspectiveCamera();
      camera.matrixAutoUpdate = false;
      this.camera = camera;

      // Real-world AR Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xfff7e6, 2.2);
      sunLight.position.set(0.5, 3.5, 1.0);
      sunLight.castShadow = true;
      scene.add(sunLight);

      // 3. WebGLRenderer with WebXR
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      renderer.xr.enabled = true;
      await renderer.xr.setSession(session);
      this.renderer = renderer;

      // 4. Create Placement Reticle with dual ring and directional indicators
      const reticle = this.createReticle();
      scene.add(reticle);
      this.reticle = reticle;

      // 5. Container for placing the 3D Artifact
      const modelContainer = new THREE.Group();
      modelContainer.visible = false;
      scene.add(modelContainer);
      this.modelContainer = modelContainer;

      // 6. Asynchronously build/load the actual 3D model
      loadOrBuildArtifact3DModel(artifact, linkedModel, initialOrientation)
        .then((built) => {
          this.builtModel = built;
          modelContainer.add(built.group);
          this.callbacks.onModelLoaded(built);
        })
        .catch((err) => {
          console.warn('[WebXRARManager] Error loading artifact model:', err);
          this.callbacks.onError('Could not load 3D artifact geometry.');
        });

      // 7. Request Reference Spaces
      const viewerSpace = await session.requestReferenceSpace('viewer');
      const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
      this.hitTestSource = hitTestSource;

      let refSpace = await session.requestReferenceSpace('local-floor').catch(() => null);
      if (!refSpace) {
        refSpace = await session.requestReferenceSpace('local').catch(() => null);
      }
      if (!refSpace) {
        refSpace = viewerSpace;
      }
      this.referenceSpace = refSpace;

      // 8. Session Events
      session.addEventListener('select', () => {
        this.handleScreenTap();
      });

      session.addEventListener('end', () => {
        this.teardown();
        this.callbacks.onStateChange('session-ended');
      });

      // 9. Start Render and Hit-Test Loop
      this.callbacks.onStateChange('scanning-surface');

      renderer.setAnimationLoop((timestamp: number, frame: any) => {
        if (frame && this.hitTestSource && this.referenceSpace && this.reticle) {
          const hitTestResults = frame.getHitTestResults(this.hitTestSource);

          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(this.referenceSpace);

            if (pose) {
              if (!this.surfaceDetected) {
                this.surfaceDetected = true;
                this.callbacks.onSurfaceDetected(true);
                if (!this.isPlaced) {
                  this.callbacks.onStateChange('surface-detected');
                }
              }

              if (!this.isPlaced) {
                this.reticle.visible = true;
                this.reticle.matrix.fromArray(pose.transform.matrix);
              }
            }
          } else {
            if (this.surfaceDetected) {
              this.surfaceDetected = false;
              this.callbacks.onSurfaceDetected(false);
              if (!this.isPlaced) {
                this.callbacks.onStateChange('scanning-surface');
              }
            }

            if (!this.isPlaced) {
              this.reticle.visible = false;
            }
          }
        }

        renderer.render(scene, camera);
      });
    } catch (err: any) {
      this.teardown();

      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        this.callbacks.onStateChange('permission-denied');
        this.callbacks.onError('Camera / AR permission was denied or blocked by browser security policy.');
      } else if (err.name === 'NotSupportedError') {
        this.callbacks.onStateChange('ar-unavailable');
        this.callbacks.onError('Immersive-AR or surface hit-testing is not supported on this device.');
      } else {
        this.callbacks.onStateChange('error');
        this.callbacks.onError(err.message || 'Failed to start WebXR session.');
      }
      throw err;
    }
  }

  /**
   * Constructs high-visibility placement reticle
   */
  private createReticle(): THREE.Mesh {
    const groupGeo = new THREE.RingGeometry(0.12, 0.15, 32).rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffe600,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const reticleMesh = new THREE.Mesh(groupGeo, ringMat);
    reticleMesh.matrixAutoUpdate = false;
    reticleMesh.visible = false;

    // Center dot
    const dotGeo = new THREE.CircleGeometry(0.02, 16).rotateX(-Math.PI / 2);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    reticleMesh.add(dot);

    // 4 Directional alignment tick marks
    const tickMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
    for (let i = 0; i < 4; i++) {
      const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 0.05).rotateX(-Math.PI / 2), tickMat);
      const angle = (i * Math.PI) / 2;
      tick.position.set(Math.cos(angle) * 0.17, 0, Math.sin(angle) * 0.17);
      reticleMesh.add(tick);
    }

    return reticleMesh;
  }

  /**
   * Places the artifact on the detected surface pose
   */
  public handleScreenTap(): boolean {
    if (this.isPlaced) return false;
    if (!this.reticle || !this.reticle.visible || !this.modelContainer) return false;

    // Anchor model directly at reticle's world position and orientation
    this.modelContainer.position.setFromMatrixPosition(this.reticle.matrix);
    this.modelContainer.quaternion.setFromRotationMatrix(this.reticle.matrix);
    this.modelContainer.visible = true;

    this.reticle.visible = false;
    this.isPlaced = true;
    this.callbacks.onStateChange('artifact-placed');
    return true;
  }

  /**
   * Unanchors the placed object so the user can re-scan and place elsewhere
   */
  public reposition(): void {
    if (!this.modelContainer || !this.reticle) return;
    this.modelContainer.visible = false;
    this.isPlaced = false;
    this.reticle.visible = false;
    this.callbacks.onStateChange('scanning-surface');
  }

  /**
   * Adjusts object scale factor in AR
   */
  public adjustScale(multiplier: number): void {
    if (!this.modelContainer) return;
    this.currentScaleMultiplier = Math.max(0.2, Math.min(3.0, this.currentScaleMultiplier * multiplier));
    this.modelContainer.scale.setScalar(this.currentScaleMultiplier);
  }

  /**
   * Resets object scale back to exact 1:1 real-world physical dimensions
   */
  public resetToRealScale(): void {
    if (!this.modelContainer) return;
    this.currentScaleMultiplier = 1.0;
    this.modelContainer.scale.setScalar(1.0);
  }

  /**
   * Rotates placed artifact around vertical Y axis
   */
  public rotateY(degrees: number): void {
    if (!this.modelContainer) return;
    this.currentRotationY += degrees;
    this.modelContainer.rotation.y += (degrees * Math.PI) / 180;
  }

  /**
   * Toggles garment display mode (Draped on bamboo hanger vs. Flat on floor)
   */
  public setGarmentOrientation(orientation: GarmentOrientation): void {
    if (this.builtModel) {
      this.builtModel.setOrientation(orientation);
    }
  }

  /**
   * Cleanly ends the active WebXR session and frees all GPU/device resources
   */
  public async exitAR(): Promise<void> {
    if (this.session) {
      try {
        await this.session.end();
      } catch {}
    }
    this.teardown();
  }

  /**
   * Teardown all Three.js and WebXR objects
   */
  private teardown(): void {
    if (this.hitTestSource) {
      try {
        this.hitTestSource.cancel();
      } catch {}
      this.hitTestSource = null;
    }

    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.renderer.dispose();
      this.renderer = null;
    }

    if (this.builtModel) {
      this.builtModel.dispose();
      this.builtModel = null;
    }

    this.scene = null;
    this.camera = null;
    this.reticle = null;
    this.modelContainer = null;
    this.session = null;
    this.isPlaced = false;
    this.surfaceDetected = false;
    this.currentScaleMultiplier = 1.0;
    this.currentRotationY = 0;
  }
}
