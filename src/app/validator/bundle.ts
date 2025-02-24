import { Validator, Schema } from 'jsonschema';
import { CAPTURE_BASE_SCHEMA, OVERLAY_SCHEMA } from './item-schema';

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

export function validateOCABundle(data: unknown) {
  jsonSchemaValidator.validate(data, bundleSchema, {
    throwError: true,
    required: true
  });
}
