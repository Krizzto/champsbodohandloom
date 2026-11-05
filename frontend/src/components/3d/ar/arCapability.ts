import { ARCapabilityResult } from './arTypes';

/**
 * Performs comprehensive WebXR capability and browser environment checks.
 * Explains clearly what is missing without falsely claiming AR has started.
 */
export async function checkARCapability(): Promise<ARCapabilityResult> {
  if (typeof window === 'undefined') {
    return {
      isSupported: false,
      isChecking: false,
      isSecureContext: false,
      hasWebXR: false,
      hasImmersiveAR: false,
      isInIframe: false,
      hasSpatialTrackingPermission: false,
      unsupportedReason: 'UNKNOWN',
      userMessage: 'Window environment not available.',
    };
  }

  const isSecureContext = window.isSecureContext === true;
  const isInIframe = window.self !== window.top;
  const hasWebXR = typeof navigator !== 'undefined' && 'xr' in navigator && !!(navigator as any).xr;

  // Check iframe permission policy if available
  let hasSpatialTrackingPermission = true;
  try {
    const docAny = document as any;
    if (docAny.permissionsPolicy && typeof docAny.permissionsPolicy.allowsFeature === 'function') {
      hasSpatialTrackingPermission = docAny.permissionsPolicy.allowsFeature('xr-spatial-tracking');
    } else if (docAny.featurePolicy && typeof docAny.featurePolicy.allowsFeature === 'function') {
      hasSpatialTrackingPermission = docAny.featurePolicy.allowsFeature('xr-spatial-tracking');
    }
  } catch {
    hasSpatialTrackingPermission = true;
  }

  // 1. Secure context check
  if (!isSecureContext) {
    return {
      isSupported: false,
      isChecking: false,
      isSecureContext,
      hasWebXR,
      hasImmersiveAR: false,
      isInIframe,
      hasSpatialTrackingPermission,
      unsupportedReason: 'INSECURE_CONTEXT',
      userMessage: 'WebXR Augmented Reality requires a secure context (HTTPS or localhost).',
      recommendedAction: 'Serve the application over HTTPS or access via localhost.',
    };
  }

  // 2. WebXR Device API presence check
  if (!hasWebXR) {
    return {
      isSupported: false,
      isChecking: false,
      isSecureContext,
      hasWebXR: false,
      hasImmersiveAR: false,
      isInIframe,
      hasSpatialTrackingPermission,
      unsupportedReason: 'NO_WEBXR',
      userMessage: 'The WebXR Device API is not available in this browser.',
      recommendedAction:
        'Open this link in Google Chrome on an ARCore-compatible Android phone, or WebXR Viewer on iOS.',
    };
  }

  // 3. Iframe spatial tracking permission check
  if (isInIframe && !hasSpatialTrackingPermission) {
    return {
      isSupported: false,
      isChecking: false,
      isSecureContext,
      hasWebXR,
      hasImmersiveAR: false,
      isInIframe,
      hasSpatialTrackingPermission: false,
      unsupportedReason: 'IFRAME_RESTRICTED',
      userMessage:
        'Embedded iframe permissions policy does not permit "xr-spatial-tracking" and camera access.',
      recommendedAction: 'Open the URL directly in a full browser tab or enable allow="xr-spatial-tracking".',
    };
  }

  // 4. Test navigator.xr.isSessionSupported('immersive-ar')
  try {
    const xr = (navigator as any).xr;
    const isImmersiveARSupported = await xr.isSessionSupported('immersive-ar');

    if (!isImmersiveARSupported) {
      return {
        isSupported: false,
        isChecking: false,
        isSecureContext,
        hasWebXR: true,
        hasImmersiveAR: false,
        isInIframe,
        hasSpatialTrackingPermission,
        unsupportedReason: 'NO_IMMERSIVE_AR',
        userMessage:
          'This device or browser does not support camera-passthrough "immersive-ar" sessions with surface hit-testing.',
        recommendedAction:
          'On mobile Android devices, ensure Google Play Services for AR (ARCore) is installed and use Google Chrome.',
      };
    }

    // Supported!
    return {
      isSupported: true,
      isChecking: false,
      isSecureContext: true,
      hasWebXR: true,
      hasImmersiveAR: true,
      isInIframe,
      hasSpatialTrackingPermission,
      userMessage: 'WebXR Immersive-AR is fully supported on this device!',
      recommendedAction: 'Tap Launch AR to grant camera permission and project the artifact into your room.',
    };
  } catch (err: any) {
    return {
      isSupported: false,
      isChecking: false,
      isSecureContext,
      hasWebXR: true,
      hasImmersiveAR: false,
      isInIframe,
      hasSpatialTrackingPermission,
      unsupportedReason: 'UNKNOWN',
      userMessage: `Error probing WebXR capabilities: ${err?.message || 'Unknown error'}`,
      recommendedAction: 'Try refreshing or opening the page in standard Google Chrome on Android.',
    };
  }
}
