import { Injectable } from '@angular/core';
import canonicalize from 'canonicalize';
import { encodeBase64url } from '../../utils/Base64';

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
        captureBases[i].digest = await this.computeSHA256CESRDigest(captureBases[i]);
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

  private _getRootCaptureBase(ocaObj: any): any {
    if (ocaObj.hasOwnProperty('capture_bases')) {
      const captureBases = ocaObj['capture_bases'];

      if (captureBases.length < 1) {
        throw Error('OCA has no valid Capture Base');
      } else if (captureBases.length == 1) {
        return captureBases[0];
      } else {
        for (let i = 0; i < captureBases.length; i++) {
          // TODO too much loops can surely be simplified
          const captureBaseWithReferences = captureBases.filter(
            (c: { hasOwnProperty: (arg0: string) => any; attributes: { [x: string]: string } }) => {
              if (!c.hasOwnProperty('attributes')) return false;

              for (const key in c.attributes) {
                const value = c.attributes[key];

                if (value.startsWith('refs:') || value.startsWith('Array[refs:')) {
                  return true;
                }
              }
              return false;
            }
          );

          let rootCaptureBases = [];
          // check for root capture bases.
          // TODO could be optimized with internal storage
          for (let i = 0; i < captureBaseWithReferences.length; i++) {
            const currentDigest = captureBaseWithReferences[i];

            const referringCaptureBases = captureBaseWithReferences.filter(
              (c: { attributes: { [x: string]: string } }) => {
                for (const key in c.attributes) {
                  const value = c.attributes[key];

                  if (value.startsWith('refs:') || value.startsWith('Array[refs:')) {
                    if (value.includes(currentDigest)) {
                      return true;
                    }
                  }
                }
                return false;
              }
            );

            if (referringCaptureBases.length == 0) {
              rootCaptureBases.push(captureBaseWithReferences[i]);
            }
          }

          if (rootCaptureBases.length == 0) {
            throw Error('OCA has no valid Capture Base');
          }

          if (rootCaptureBases.length > 1) {
            throw Error('OCA can only have one root Capture Base');
          }

          return rootCaptureBases[0];
        }
      }
    } else {
      throw Error('OCA has no valid Capture Base');
    }
  }

  // see https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/appendixes/cesr-sha256-encoder.md
  // for a longer explanation
  private async computeSHA256CESRDigest(captureBaseObj: any): Promise<string> {
    const canonicalizedObj = canonicalize(captureBaseObj);

    if (canonicalizedObj === undefined) {
      throw Error('Could not canonicalize the Capture Base.');
    }

    const encoder = new TextEncoder();
    const rawDigestBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalizedObj));
    const rawDigest = new Uint8Array(rawDigestBuffer);
    const bytes = new Uint8Array(rawDigest.length + 1);
    bytes[0] = 0;
    for (let i = 0; i < rawDigest.length; i++) {
      bytes[i + 1] = rawDigest[i];
    }

    const base64Digest = encodeBase64url(bytes);
    return 'I' + base64Digest.substring(1);
  }
}
