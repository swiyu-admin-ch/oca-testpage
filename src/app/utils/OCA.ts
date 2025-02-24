import { CaptureBase, OCABundle, Overlay, OverlaySpecType } from '../model';
import { computeSHA256CESRDigest } from './CESR';

export function getRootCaptureBase(oca: OCABundle): CaptureBase {
  const captureBases = oca.capture_bases;

  if (captureBases.length < 1) {
    throw Error('OCA has no valid Capture Base');
  }

  if (captureBases.length == 1) {
    return captureBases[0];
  }

  const captureBaseReferences = captureBases.reduce<string[]>(
    (aggr, base) => [
      ...aggr,
      ...Object.values(base.attributes).filter((value): value is string =>
        Boolean(value?.startsWith('refs:') || value?.startsWith('Array[refs:'))
      )
    ],
    []
  );

  const rootCaptureBases = captureBases.filter(
    (base) => !captureBaseReferences.some((ref) => ref.includes(base.digest))
  );

  if (rootCaptureBases.length == 0) {
    throw Error('OCA has no valid Capture Base');
  }

  if (rootCaptureBases.length > 1) {
    throw Error('OCA can only have one root Capture Base');
  }

  return rootCaptureBases[0];
}

export function getOverlayByDigest<Type extends OverlaySpecType>(
  ocaObj: OCABundle,
  overlay: Type | ReadonlyArray<Type>,
  digest: string,
  language?: string
): Overlay<Type> | undefined {
  const types: ReadonlyArray<Type> = Array.isArray(overlay) ? overlay : [overlay];
  for (const type of types) {
    const result = ocaObj.overlays.find(
      (o) =>
        o.type === type &&
        o.capture_base === digest &&
        ('language' in o ? o.language === language : true)
    );
    if (result) {
      return result as Overlay<Type>;
    }
  }
  return undefined;
}

export async function calculateCaptureBaseDigest(data: CaptureBase) {
  const cesrDummy: string = '############################################';
  const dummy = { ...data, digest: cesrDummy };
  return await computeSHA256CESRDigest(dummy);
}
