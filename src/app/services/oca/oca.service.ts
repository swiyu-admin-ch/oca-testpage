import { Injectable } from '@angular/core';
import { computeSHA256CESRDigest } from '../../utils/CESR';
import { CaptureBase, Overlay, OverlaySpecType } from '../../model/oca-capture';
import { OCABundle } from '../../model/top-level';

@Injectable({
  providedIn: 'root'
})
export class OCAService {
  private cesrDummy: string = '############################################';
  private captureBaseDummy: CaptureBase = {
    type: 'spec/capture_base/1.0',
    digest: '############################################',
    attributes: {
      firstname: 'Text',
      lastname: 'Text'
    }
  };
  private nestedCaptureBaseDummy: CaptureBase = {
    type: 'spec/capture_base/1.0',
    digest: '############################################',
    attributes: {
      title: 'Test',
      items: 'Array[refs:############################################]'
    }
  };
  constructor() {}

  initOCA(): OCABundle {
    return {
      capture_bases: [this.captureBaseDummy],
      overlays: []
    };
  }

  addCaptureBase(oca: OCABundle): OCABundle {
    return {
      capture_bases: [...oca.capture_bases, this.nestedCaptureBaseDummy],
      overlays: oca.overlays
    };
  }

  async computeDigests(oca: OCABundle): Promise<OCABundle> {
    const capture_bases = [];
    for (const base of oca.capture_bases) {
      const dummy = { ...base, digest: this.cesrDummy };
      const digest = await computeSHA256CESRDigest(dummy);
      capture_bases.push({ ...base, digest });
    }

    return { capture_bases, overlays: oca.overlays };
  }

  getOverlay<Type extends OverlaySpecType>(
    oca: OCABundle,
    overlay: Type | ReadonlyArray<Type>,
    language: string = 'en'
  ) {
    const rootCaptureBase = this._getRootCaptureBase(oca);
    const rootDigest = rootCaptureBase.digest;

    return this._getOverlayByDigest<Type>(oca, overlay, language, rootDigest);
  }

  getOverlayByDigest<Type extends OverlaySpecType>(
    oca: OCABundle,
    overlay: Type | ReadonlyArray<Type>,
    language: string,
    digest: string
  ) {
    return this._getOverlayByDigest<Type>(oca, overlay, language, digest);
  }

  getCaptureBaseByDigest(oca: OCABundle, digest: string) {
    const filteredCaptureBase = oca.capture_bases.filter((c) => c.digest === digest);

    if (filteredCaptureBase.length > 1) {
      throw Error('OCA has multiple Capture Bases with the same digests');
    } else if (filteredCaptureBase.length == 1) {
      return filteredCaptureBase[0];
    } else {
      throw Error(`OCA has no Capture Base with the following digest: ${digest}`);
    }
  }

  getRootCaptureBase(oca: OCABundle) {
    return this._getRootCaptureBase(oca);
  }

  private _getOverlayByDigest<Type extends OverlaySpecType>(
    ocaObj: OCABundle,
    overlay: Type | ReadonlyArray<Type>,
    language: string,
    digest: string
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

  private _getRootCaptureBase(ocaObj: OCABundle): CaptureBase {
    const captureBases = ocaObj.capture_bases;

    if (captureBases.length < 1) {
      throw Error('OCA has no valid Capture Base');
    }

    if (captureBases.length == 1) {
      return captureBases[0];
    }

    const captureBaseReferences = captureBases.reduce<string[]>(
      (aggr, base) => [
        ...aggr,
        ...Object.values(base.attributes).filter(
          (value) => value.startsWith('refs:') || value.startsWith('Array[refs:')
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
}
