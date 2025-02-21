import { CaptureBase, Overlay, OverlayType } from './oca-capture';

export interface OCABundle {
  capture_bases: CaptureBase[];
  overlays: Overlay<OverlayType>[];
}
