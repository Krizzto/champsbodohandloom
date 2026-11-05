import { Artifact, PhysicalDimensions } from '../../../types';

export type ARSessionState =
  | 'checking-compatibility'
  | 'ready'
  | 'waiting-permission'
  | 'scanning-surface'
  | 'surface-detected'
  | 'artifact-placed'
  | 'permission-denied'
  | 'ar-unavailable'
  | 'session-ended'
  | 'error';

export type GarmentOrientation = 'draped-vertical' | 'flat-horizontal';

export interface ARCapabilityResult {
  isSupported: boolean;
  isChecking: boolean;
  isSecureContext: boolean;
  hasWebXR: boolean;
  hasImmersiveAR: boolean;
  isInIframe: boolean;
  hasSpatialTrackingPermission: boolean;
  unsupportedReason?:
    | 'INSECURE_CONTEXT'
    | 'NO_WEBXR'
    | 'NO_IMMERSIVE_AR'
    | 'IFRAME_RESTRICTED'
    | 'PERMISSION_DENIED'
    | 'UNKNOWN';
  userMessage?: string;
  recommendedAction?: string;
}

export interface ModelPlacementInfo {
  isPlaced: boolean;
  surfaceDetected: boolean;
  position: [number, number, number];
  rotationY: number;
  scaleFactor: number;
  orientation: GarmentOrientation;
  isRealGLB: boolean;
  physicalDimensions: PhysicalDimensions;
}
