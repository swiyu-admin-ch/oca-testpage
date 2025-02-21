enum SpecType {
  Base1_0 = 'spec/capture_base/1.0',

  Meta1_0 = 'spec/overlays/meta/1.0',
  Format1_0 = 'spec/overlays/format/1.0',
  Standard1_0 = 'spec/overlays/standard/1.0',
  Label1_0 = 'spec/overlays/label/1.0',

  Branding1_1 = 'aries/overlays/branding/1.1',

  DataSource1_0 = 'extend/overlays/data_source/1.0',
  ClusterOrdering1_0 = 'extend/overlays/cluster_ordering/1.0'
}

/** https://oca.colossi.network/specification/#capture-base */
export interface CaptureBase {
  type: SpecType.Base1_0;
  digest: string;
  attributes: Record<string, string>;
  classification?: string;
  flagged_attributes?: string[];
}

/** https://oca.colossi.network/specification/#common-attributes */
export interface CommonOverlay {
  type: SpecType[keyof SpecType];
  capture_base: string;
}
export interface CommonLocalizedOverlay extends CommonOverlay {
  language: string;
}

/** https://oca.colossi.network/specification/#meta-overlay */
export interface MetaOverlay extends CommonLocalizedOverlay {
  type: SpecType.Meta1_0;
  name: string;
  description?: string;
}

/** https://oca.colossi.network/specification/#format-overlay */
export interface FormatOverlay extends CommonOverlay {
  type: SpecType.Format1_0;
  attribute_formats: Record<string, string>;
}

/** https://oca.colossi.network/specification/#standard-overlay */
export interface StandardOverlay extends CommonOverlay {
  type: SpecType.Standard1_0;
  attr_standards: Record<string, string>;
}

/** https://oca.colossi.network/specification/#label-overlay */
export interface LabelOverlay extends CommonLocalizedOverlay {
  type: SpecType.Label1_0;
  attribute_labels: Record<string, string>;
}

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#aries-branding-overlay-update-proposal */
export interface BrandingOverlay extends CommonOverlay {
  type: SpecType.Branding1_1;
  language?: string;
  theme?: string;
  logo: string;
  primary_background_color: string;
  primary_field?: string;
  secondary_field?: string;
}

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#data-source-mapping-overlay */
export interface DataSourceOverlay extends CommonOverlay {
  type: SpecType.DataSource1_0;
  format: string;
  attribute_sources: Record<string, string>;
}

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#cluster-ordering-overlay */
export interface ClusterOrderingOverlay extends CommonLocalizedOverlay {
  type: SpecType.ClusterOrdering1_0;
  cluster_order: Record<string, number>;
  attribute_cluster_order: Record<string, Record<string, number>>;
  cluster_labels?: Record<string, string>;
}

export type Overlay =
  | MetaOverlay
  | FormatOverlay
  | StandardOverlay
  | LabelOverlay
  | BrandingOverlay
  | DataSourceOverlay
  | ClusterOrderingOverlay;

export enum OverlayType {
  META = SpecType.Meta1_0,
  FORMAT = SpecType.Format1_0,
  STANDARD = SpecType.Standard1_0,
  LABEL = SpecType.Label1_0,
  BRANDING = SpecType.Branding1_1,
  DATA_SOURCE = SpecType.DataSource1_0,
  CLUSTER_ORDERING = SpecType.ClusterOrdering1_0
}
