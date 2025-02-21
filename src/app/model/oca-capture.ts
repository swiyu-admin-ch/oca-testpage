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

export const enum OverlayType {
  META = SpecType.Meta1_0,
  FORMAT = SpecType.Format1_0,
  STANDARD = SpecType.Standard1_0,
  LABEL = SpecType.Label1_0,
  BRANDING = SpecType.Branding1_1,
  DATA_SOURCE = SpecType.DataSource1_0,
  CLUSTER_ORDERING = SpecType.ClusterOrdering1_0
}

/** https://oca.colossi.network/specification/#common-attributes */
export interface CommonOverlay<Type extends OverlayType> {
  type: Type;
  capture_base: string;
}
export interface CommonLocalizedOverlay<Type extends OverlayType> extends CommonOverlay<Type> {
  language: string;
}

/** https://oca.colossi.network/specification/#meta-overlay */
export interface MetaOverlay extends CommonLocalizedOverlay<OverlayType.META> {
  name: string;
  description?: string;
}

/** https://oca.colossi.network/specification/#format-overlay */
export interface FormatOverlay extends CommonOverlay<OverlayType.FORMAT> {
  attribute_formats: Record<string, string>;
}

/** https://oca.colossi.network/specification/#standard-overlay */
export interface StandardOverlay extends CommonOverlay<OverlayType.STANDARD> {
  attr_standards: Record<string, string>;
}

/** https://oca.colossi.network/specification/#label-overlay */
export interface LabelOverlay extends CommonLocalizedOverlay<OverlayType.LABEL> {
  attribute_labels: Record<string, string>;
}

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#aries-branding-overlay-update-proposal */
export interface BrandingOverlay extends CommonOverlay<OverlayType.BRANDING> {
  language?: string;
  theme?: string;
  logo: string;
  primary_background_color: string;
  primary_field?: string;
  secondary_field?: string;
}

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#data-source-mapping-overlay */
export interface DataSourceOverlay extends CommonOverlay<OverlayType.DATA_SOURCE> {
  format: string;
  attribute_sources: Record<string, string>;
}

/** https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/spec.md#cluster-ordering-overlay */
export interface ClusterOrderingOverlay
  extends CommonLocalizedOverlay<OverlayType.CLUSTER_ORDERING> {
  cluster_order: Record<string, number>;
  attribute_cluster_order: Record<string, Record<string, number>>;
  cluster_labels?: Record<string, string>;
}

export type Overlay<Type extends OverlayType> = Type extends OverlayType.META
  ? MetaOverlay
  : Type extends OverlayType.FORMAT
    ? FormatOverlay
    : Type extends OverlayType.STANDARD
      ? StandardOverlay
      : Type extends OverlayType.LABEL
        ? LabelOverlay
        : Type extends OverlayType.BRANDING
          ? BrandingOverlay
          : Type extends OverlayType.DATA_SOURCE
            ? DataSourceOverlay
            : Type extends OverlayType.CLUSTER_ORDERING
              ? ClusterOrderingOverlay
              : never;
