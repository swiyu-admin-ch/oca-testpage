import { CaptureBase, AnyOverlay } from './oca-capture';

export type OCABundle = {
  capture_bases: CaptureBase[];
  overlays: AnyOverlay[];
};

export type JsonObject = Record<string, unknown>;
