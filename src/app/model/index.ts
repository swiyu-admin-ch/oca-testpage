import { CaptureBase } from './capture-base';
import { AnyOverlay } from './overlay';

export * from './capture-base';
export * from './overlay';

export type OCABundle = {
  capture_bases: CaptureBase[];
  overlays: AnyOverlay[];
};

export type JsonObject = Record<string, unknown>;
