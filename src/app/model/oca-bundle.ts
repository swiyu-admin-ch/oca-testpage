import { CaptureBase, AnyOverlay } from './oca-capture';

export interface OCABundle {
  capture_bases: CaptureBase[];
  overlays: AnyOverlay[];
}
