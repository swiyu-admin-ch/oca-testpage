import { Validator, Schema } from 'jsonschema';
import { CAPTURE_BASE_SCHEMA, UNKNOWN_OVERLAY_SCHEMA, KNOWN_OVERLAY_SCHEMAS } from './item-schema';

const jsonSchemaValidator = new Validator();

jsonSchemaValidator.addSchema(CAPTURE_BASE_SCHEMA);
jsonSchemaValidator.addSchema(UNKNOWN_OVERLAY_SCHEMA);
KNOWN_OVERLAY_SCHEMAS.forEach((schema) => {
  jsonSchemaValidator.addSchema(schema);
});

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
        oneOf: [
          ...KNOWN_OVERLAY_SCHEMAS.map((schema) => ({
            $ref: schema.id
          })),
          {
            $ref: UNKNOWN_OVERLAY_SCHEMA.id
          }
        ]
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
