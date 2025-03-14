import {
  AnyOverlay,
  BrandingOverlay1_1,
  CaptureBase,
  DataSourceOverlay,
  LabelOverlay,
  OverlaySpecType
} from '../model';

export class OCAOverlayError extends Error {
  field: string;
  constructor(field: string, message: string) {
    super(message);
    this.field = field;
    Object.setPrototypeOf(this, OCAOverlayError.prototype);
  }
}

function validateBranding1_1(overlay: BrandingOverlay1_1, relatedBase: CaptureBase) {
  (['primary_field', 'secondary_field'] as const).forEach((field) => {
    if (field in overlay) {
      const matches = overlay[field]?.matchAll(/\{\{(.*?)\}\}/g) ?? [];
      for (const match of matches) {
        const attribute = match[1];

        if (!(attribute in relatedBase.attributes)) {
          throw new OCAOverlayError(
            field,
            `Attribute "${attribute}" not found in related capture base attributes`
          );
        }
      }
    }
  });
}

function validateDataSource(overlay: DataSourceOverlay, relatedBase: CaptureBase) {
  Object.keys(overlay.attribute_sources).forEach((attribute) => {
    if (!(attribute in relatedBase.attributes)) {
      throw new OCAOverlayError(
        `attribute_sources/${attribute}`,
        `Attribute "${attribute}" not found in related capture base attributes`
      );
    }
  });

  Object.keys(relatedBase.attributes).forEach((attribute) => {
    if (!(attribute in overlay.attribute_sources)) {
      throw new OCAOverlayError(
        `attribute_sources`,
        `Capture base attribute "${attribute}" not found in attribute_sources`
      );
    }
  });
}

function validateLabel(overlay: LabelOverlay, relatedBase: CaptureBase) {
  Object.keys(overlay.attribute_labels).forEach((attribute) => {
    if (!(attribute in relatedBase.attributes)) {
      throw new OCAOverlayError(
        `attribute_labels/${attribute}`,
        `Attribute "${attribute}" not found in related capture base attributes`
      );
    }
  });

  Object.entries(relatedBase.attributes)
    .filter(([_, type]) => !(type?.startsWith('refs:') || type?.startsWith('Array[refs:')))
    .forEach(([attribute]) => {
      if (!(attribute in overlay.attribute_labels)) {
        throw new OCAOverlayError(
          `attribute_labels`,
          `Capture base attribute "${attribute}" not found in attribute_labels`
        );
      }
    });
}

export function validateOverlay(overlay: AnyOverlay, relatedBase: CaptureBase) {
  switch (overlay.type) {
    case OverlaySpecType.BRANDING_1_1:
      validateBranding1_1(overlay, relatedBase);
      break;
    case OverlaySpecType.DATA_SOURCE_1_0:
      validateDataSource(overlay, relatedBase);
      break;
    case OverlaySpecType.LABEL_1_0:
      validateLabel(overlay, relatedBase);
      break;
  }
}
