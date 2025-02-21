import { Injectable } from '@angular/core';
import { computeSHA256CESRDigest } from '../../utils/CESR';
import { CaptureBase } from '../../model/oca-capture';
import { OCABundle } from '../../model/oca-bundle';

export enum Overlays {
  LABEL,
  META,
  BRANDING,
  DATA_SOURCE,
  CLUSTER_ORDERING,
  STANDARD
}

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

  getOverlay(oca: string, overlay: Overlays, language: string = 'en') {
    const ocaObj = JSON.parse(oca);

    const rootCaptureBase = this._getRootCaptureBase(ocaObj);
    const rootDigest = rootCaptureBase.digest;

    return this._getOverlayByDigest(ocaObj, overlay, language, rootDigest);
  }

  getOverlayByDigest(oca: string, overlay: Overlays, language: string, digest: string) {
    const ocaObj = JSON.parse(oca);

    return this._getOverlayByDigest(ocaObj, overlay, language, digest);
  }

  getCaptureBaseByDigest(oca: string, digest: string) {
    const ocaObj = JSON.parse(oca);

    if (!ocaObj.hasOwnProperty('capture_bases')) {
      throw Error('OCA has no valid Capture Base');
    }

    const captureBases = ocaObj['capture_bases'];

    const filteredCaptureBase = captureBases.filter((c: any) => {
      if (!c.hasOwnProperty('digest')) return false;

      return c['digest'] === digest;
    });

    if (filteredCaptureBase.length < 1) {
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

  private _getOverlayByDigest(ocaObj: any, overlay: Overlays, language: string, digest: string) {
    if (!ocaObj.hasOwnProperty('overlays')) {
      throw Error('OCA has no overlays!');
    }

    const overlays = ocaObj.overlays;

    switch (overlay) {
      case Overlays.META:
        return overlays.find(
          (o: { [x: string]: string }) =>
            o['type'] === 'spec/overlays/meta/1.0' &&
            o['capture_base'] === digest &&
            o['language'] === language
        );
        break;
      case Overlays.LABEL:
        return overlays.find(
          (o: { [x: string]: string }) =>
            o['type'] === 'spec/overlays/label/1.0' &&
            o['capture_base'] === digest &&
            o['language'] === language
        );
        break;
      case Overlays.STANDARD:
        return overlays.find(
          (o: { [x: string]: string }) =>
            o['type'] === 'spec/overlays/standard/1.0' && o['capture_base'] === digest
        );
        break;
      case Overlays.DATA_SOURCE:
        return overlays.find(
          (o: { [x: string]: string }) =>
            o['type'] === 'extend/overlays/data_source/1.0' &&
            o['capture_base'] === digest &&
            o['format'] === 'json'
        );
        break;
      case Overlays.CLUSTER_ORDERING:
        return overlays.find(
          (o: { [x: string]: string }) =>
            o['type'] === 'extend/overlays/cluster_ordering/1.0' &&
            o['capture_base'] === digest &&
            o['language'] === language
        );
        break;
      case Overlays.BRANDING:
        return overlays.find(
          (o: { [x: string]: string }) =>
            o['type'] === 'aries/overlays/branding/1.1' &&
            o['capture_base'] === digest &&
            o['language'] === language
        );
        break;
    }
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
