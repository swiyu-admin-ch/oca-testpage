export const enum CaptureBaseSpecType {
  BASE_1_0 = 'spec/capture_base/1.0'
}

/** https://oca.colossi.network/specification/#capture-base */
export type CaptureBase = {
  type: CaptureBaseSpecType.BASE_1_0;
  digest: string;
  attributes: Partial<Record<string, string>>;
  classification?: string;
  flagged_attributes?: string[];
};
