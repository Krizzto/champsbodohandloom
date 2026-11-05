export interface NavItem {
  id: string;
  label: string;
  path: string;
  description?: string;
  badge?: string;
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'museum', label: 'Museum', path: '/museum' },
  { id: 'explore', label: 'Explore', path: '/explore' },
  { id: 'three', label: '3D Experience', path: '/3d' },
  { id: 'ai', label: 'AI Knowledge', path: '/ai', badge: 'UI Only' },
  { id: 'arvr', label: 'AR / VR', path: '/arvr', badge: 'Preview' }
];

export const footerLinks = {
  exhibitions: [
    { label: 'All Artifacts', path: '/museum' },
    { label: 'Zenther Ginning Tool', path: '/museum?artifact=zenther' },
    { label: 'Dokhona Thaosi Dress', path: '/museum?artifact=dokhona' },
    { label: 'Ceremonial Aronai Scarf', path: '/museum?artifact=aronai' },
    { label: 'Traditional Sal Loom', path: '/museum?artifact=sal-loom' }
  ],
  explore: [
    { label: 'The 9 Weaving Stages', path: '/explore' },
    { label: 'Cultural Map of Bodoland', path: '/explore#map' },
    { label: 'Traditional Agor Motifs', path: '/explore#motifs' },
    { label: 'Interactive 3D Inspection', path: '/3d' }
  ],
  futureIntegrations: [
    { label: 'AI Knowledge Assistant (UI)', path: '/ai' },
    { label: 'WebXR Virtual Museum (UI)', path: '/arvr' },
    { label: 'Augmented Reality Projection (UI)', path: '/arvr' },
    { label: 'API Integration Boundary', path: '/ai' }
  ]
};
