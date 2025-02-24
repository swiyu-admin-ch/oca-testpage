/** https://oca.colossi.network/specification/#capture-base */
export type CaptureBase = {
  type: 'spec/capture_base/1.0';
  digest: string;
  attributes: Partial<Record<string, string>>;
  classification?: string;
  flagged_attributes?: string[];
};
