import { Schema } from 'jsonschema';
import { CaptureBaseSpecType, OverlaySpecType } from '../model';

export const CAPTURE_BASE_SCHEMA: Schema = {
  id: CaptureBaseSpecType.BASE_1_0,
  type: 'object',
  properties: {
    type: { const: CaptureBaseSpecType.BASE_1_0 },
    digest: { type: 'string' },
    classification: { type: 'string' },
    attributes: {
      type: 'object',
      additionalProperties: { type: 'string' }
    },
    flagged_attributes: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['digest', 'type', 'attributes']
};

export const META_OVERLAY_SCHEMA: Schema = {
  id: OverlaySpecType.META_1_0,
  type: 'object',
  properties: {
    type: { const: OverlaySpecType.META_1_0 },
    capture_base: { type: 'string' },
    language: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' }
  },
  additionalProperties: false,
  required: ['type', 'capture_base', 'language', 'name']
};

export const KNOWN_OVERLAY_SCHEMAS = [META_OVERLAY_SCHEMA];

export const UNKNOWN_OVERLAY_SCHEMA: Schema = {
  id: 'UnknownOverlay',
  type: 'object',
  properties: {
    type: {
      type: 'string',
      not: {
        oneOf: KNOWN_OVERLAY_SCHEMAS.map((schema) => ({
          const: schema.id
        }))
      }
    },
    capture_base: { type: 'string' },
    language: { type: 'string' }
  },
  additionalProperties: true,
  required: ['type', 'capture_base']
};
