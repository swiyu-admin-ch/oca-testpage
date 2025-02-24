import { Validator, Schema } from 'jsonschema';
import { CAPTURE_BASE_SCHEMA, OVERLAY_SCHEMA } from './item-schema';
import { OCABundle } from '../model';
import { calculateCaptureBaseDigest, getRootCaptureBase } from '../utils/OCA';

const jsonSchemaValidator = new Validator();
jsonSchemaValidator.addSchema(CAPTURE_BASE_SCHEMA);
jsonSchemaValidator.addSchema(OVERLAY_SCHEMA);

const bundleSchema: Schema = {
  id: 'OCABundle',
  type: 'object',
  properties: {
    capture_bases: {
      type: 'array',
      items: {
        $ref: CAPTURE_BASE_SCHEMA.id
      },
      minItems: 1,
      uniqueItems: true
    },
    overlays: {
      type: 'array',
      items: {
        $ref: OVERLAY_SCHEMA.id
      },
      uniqueItems: true
    }
  },
  required: ['capture_bases', 'overlays']
};

export async function validateOCABundle(data: unknown) {
  // validate against JSON schema
  jsonSchemaValidator.validate(data, bundleSchema, {
    throwError: true,
    required: true
  });

  const bundle = data as OCABundle;

  // validate root capture exists
  getRootCaptureBase(bundle);

  // validate digests
  for (const base of bundle.capture_bases) {
    if (base.digest !== (await calculateCaptureBaseDigest(base))) {
      throw new Error(`Invalid capture_base digest: ${base.digest}`);
    }
  }
  for (const overlay of bundle.overlays) {
    if (!bundle.capture_bases.some((base) => base.digest === overlay.capture_base)) {
      throw new Error(`Missing overlay capture_base reference: ${overlay.capture_base}`);
    }
  }
}
