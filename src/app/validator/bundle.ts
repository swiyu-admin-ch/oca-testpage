import Ajv, { SchemaObject } from 'ajv';
import { CAPTURE_BASE_SCHEMA, OVERLAY_SCHEMA } from './item-schema';
import { OCABundle } from '../model';
import { calculateCaptureBaseDigest, getRootCaptureBase } from '../utils/OCA';

const jsonSchemaValidator = new Ajv();
jsonSchemaValidator.addSchema([CAPTURE_BASE_SCHEMA, OVERLAY_SCHEMA]);

const bundleSchema: SchemaObject = {
  $id: 'OCABundle',
  type: 'object',
  properties: {
    capture_bases: {
      type: 'array',
      items: {
        $ref: CAPTURE_BASE_SCHEMA.$id
      },
      minItems: 1,
      uniqueItems: true
    },
    overlays: {
      type: 'array',
      items: {
        $ref: OVERLAY_SCHEMA.$id
      },
      uniqueItems: true
    }
  },
  required: ['capture_bases', 'overlays']
};

export class OCAValidationError extends Error {
  path: string;
  constructor(path: string, message: string) {
    super(message);
    this.path = path;
    Object.setPrototypeOf(this, OCAValidationError.prototype);
  }
}

export async function validateOCABundle(data: unknown) {
  // validate against JSON schema
  const validate = jsonSchemaValidator.compile(bundleSchema);
  if (!validate(data)) {
    const error = validate.errors?.[0];
    if (error) {
      throw new OCAValidationError(
        error.instancePath,
        `JSON-schema validation failed(${error.instancePath}): ${error.message}`
      );
    }
  }

  const bundle = data as OCABundle;

  // validate root capture exists
  try {
    getRootCaptureBase(bundle);
  } catch (e) {
    throw new OCAValidationError('/capture_bases', e instanceof Error ? e.message : String(e));
  }

  // validate digests
  for (const [index, base] of bundle.capture_bases.entries()) {
    const correctDigest = await calculateCaptureBaseDigest(base);
    if (base.digest !== correctDigest) {
      throw new OCAValidationError(
        `/capture_bases/${index}/digest`,
        `Invalid capture_base digest, it should be: "${correctDigest}"`
      );
    }
  }
  for (const [index, overlay] of bundle.overlays.entries()) {
    if (!bundle.capture_bases.some((base) => base.digest === overlay.capture_base)) {
      throw new OCAValidationError(
        `/overlays/${index}/capture_base`,
        `Missing overlay capture_base reference: "${overlay.capture_base}"`
      );
    }
  }
}
