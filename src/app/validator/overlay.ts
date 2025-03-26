import {
  AnyOverlay,
  BrandingOverlay1_1,
  CaptureBase,
  ClusterOrderingOverlay,
  DataSourceOverlay,
  FormatOverlay,
  LabelOverlay,
  OverlaySpecType,
  StandardOverlay
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

function validateFormat(overlay: FormatOverlay, relatedBase: CaptureBase) {
  Object.keys(overlay.attribute_formats).forEach((attribute) => {
    if (!(attribute in relatedBase.attributes)) {
      throw new OCAOverlayError(
        `attribute_formats/${attribute}`,
        `Attribute "${attribute}" not found in related capture base attributes`
      );
    }
  });
}

function validateStandard(overlay: StandardOverlay, relatedBase: CaptureBase) {
  Object.keys(overlay.attr_standards).forEach((attribute) => {
    if (!(attribute in relatedBase.attributes)) {
      throw new OCAOverlayError(
        `attr_standards/${attribute}`,
        `Attribute "${attribute}" not found in related capture base attributes`
      );
    }
  });
}

function validateClusterOrdering(overlay: ClusterOrderingOverlay, relatedBase: CaptureBase) {
  const clusterOrderKeys = Object.keys(overlay.cluster_order);

  if (new Set(Object.values(overlay.cluster_order)).size !== clusterOrderKeys.length) {
    throw new OCAOverlayError(`cluster_order`, `Cluster order values must be unique`);
  }

  if (overlay.cluster_labels) {
    Object.keys(overlay.cluster_labels).forEach((key) => {
      if (!clusterOrderKeys.includes(key)) {
        throw new OCAOverlayError(
          `cluster_labels/${key}`,
          `Key "${key}" not found in cluster_order`
        );
      }
    });
  }

  Object.keys(overlay.attribute_cluster_order).forEach((key) => {
    if (!clusterOrderKeys.includes(key)) {
      throw new OCAOverlayError(
        `attribute_cluster_order/${key}`,
        `Key "${key}" not found in cluster_order`
      );
    }
  });

  Object.entries(overlay.attribute_cluster_order).forEach(([clusterKey, clusterAttributes]) => {
    Object.keys(clusterAttributes).forEach((attribute) => {
      if (!(attribute in relatedBase.attributes)) {
        throw new OCAOverlayError(
          `attribute_cluster_order/${clusterKey}/${attribute}`,
          `Attribute "${attribute}" not found in related capture base attributes`
        );
      }
    });

    if (new Set(Object.values(clusterAttributes)).size !== Object.keys(clusterAttributes).length) {
      throw new OCAOverlayError(
        `attribute_cluster_order/${clusterKey}`,
        `Cluster attribute order values must be unique`
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
    case OverlaySpecType.FORMAT_1_0:
      validateFormat(overlay, relatedBase);
      break;
    case OverlaySpecType.STANDARD_1_0:
      validateStandard(overlay, relatedBase);
      break;
    case OverlaySpecType.CLUSTER_ORDERING_1_0:
      validateClusterOrdering(overlay, relatedBase);
      break;
  }
}
