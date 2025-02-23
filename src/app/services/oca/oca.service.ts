import { Injectable } from '@angular/core';
import { computeSHA256CESRDigest } from '../../utils/CESR';
import { CaptureBase, Overlay, OverlaySpecType } from '../../model/oca-capture';
import { OCABundle } from '../../model/oca-bundle';

@Injectable({
  providedIn: 'root'
})
export class OCAService {
  private cesrDummy: string = '############################################';
  private captureBaseDummy = {
    type: 'spec/capture_base/1.0',
    digest: '############################################',
    attributes: {
      firstname: 'Text',
      lastname: 'Text'
    }
  };
  private nestedCaptureBaseDummy = {
    type: 'spec/capture_base/1.0',
    digest: '############################################',
    attributes: {
      title: 'Test',
      items: 'Array[refs:############################################]'
    }
  };
  constructor() {}

  initOCA(): string {
    return JSON.stringify(
      {
        capture_bases: [this.captureBaseDummy],
        overlays: []
      },
      null,
      '\t'
    );
  }

  addCaptureBase(oca: string): string {
    const ocaObj = JSON.parse(oca);

    ocaObj['capture_bases'].push(this.nestedCaptureBaseDummy);

    return JSON.stringify(ocaObj, null, '\t');
  }

  async computeDigests(oca: string): Promise<string> {
    const ocaObj = JSON.parse(oca);

    if (ocaObj.hasOwnProperty('capture_bases')) {
      const captureBases = ocaObj['capture_bases'];

      for (let i = 0; i < captureBases.length; i++) {
        captureBases[i].digest = this.cesrDummy;
        captureBases[i].digest = await computeSHA256CESRDigest(captureBases[i]);
      }
    } else {
      throw Error('OCA has no valid Capture Base');
    }

    return JSON.stringify(ocaObj, null, '\t');
  }

  getOverlay<Type extends OverlaySpecType>(
    oca: string,
    overlay: Type | ReadonlyArray<Type>,
    language: string = 'en'
  ) {
    const ocaObj = JSON.parse(oca);

    const rootCaptureBase = this._getRootCaptureBase(ocaObj);
    const rootDigest = rootCaptureBase.digest;

    return this._getOverlayByDigest<Type>(ocaObj, overlay, language, rootDigest);
  }

  getOverlayByDigest<Type extends OverlaySpecType>(
    oca: string,
    overlay: Type | ReadonlyArray<Type>,
    language: string,
    digest: string
  ) {
    const ocaObj = JSON.parse(oca);

    return this._getOverlayByDigest<Type>(ocaObj, overlay, language, digest);
  }

  getCaptureBaseByDigest(oca: string, digest: string) {
    const ocaObj: OCABundle = JSON.parse(oca);

    if (!ocaObj.hasOwnProperty('capture_bases')) {
      throw Error('OCA has no valid Capture Base');
    }

    const filteredCaptureBase = ocaObj.capture_bases.filter((c) => c.digest === digest);

    if (filteredCaptureBase.length > 1) {
      throw Error('OCA has multiple Capture Bases with the same digests');
    } else if (filteredCaptureBase.length == 1) {
      return filteredCaptureBase[0];
    } else {
      throw Error(`OCA has no Capture Base with the following digest: ${digest}`);
    }
  }

  getRootCaptureBase(oca: string) {
    const ocaObj = JSON.parse(oca);
    return this._getRootCaptureBase(ocaObj);
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
