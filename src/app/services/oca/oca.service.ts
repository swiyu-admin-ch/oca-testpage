import { Injectable } from '@angular/core';
import canonicalize from 'canonicalize'

@Injectable({
  providedIn: 'root'
})
export class OCAService {
  private cesrDummy: string = "############################################";
  private captureBaseDummy = {
    type: "spec/capture_base/1.0",
    digest: "############################################",
    attributes: {
      firstname: "Text",
      lastname: "Text"
    }
  };
  private nestedCaptureBaseDummy = {
    type: "spec/capture_base/1.0",
    digest: "############################################",
    attributes: {
      title: "Test",
      items: "Array[refs:############################################]"
    }
  };
  constructor() { }

  initOCA(): string {
    return JSON.stringify({
      capture_base: this.captureBaseDummy,
      overlays: []
    }, null, "\t");
  }

  addCaptureBase(oca: string): string {
    const ocaObj = JSON.parse(oca);

    if(ocaObj.hasOwnProperty('capture_base')) {
      ocaObj["capture_bases"] = [];
      ocaObj["capture_bases"].push(ocaObj['capture_base']);
      delete ocaObj['capture_base'];
    }

    ocaObj["capture_bases"].push(this.nestedCaptureBaseDummy)

    return JSON.stringify(ocaObj, null, '\t');
  }

  async computeDigests(oca: string): Promise<string> {
    const ocaObj = JSON.parse(oca);
    
    if(ocaObj.hasOwnProperty('capture_base')) {
      const captureBase = ocaObj['capture_base'];
      captureBase.digest = this.cesrDummy;
      captureBase.digest = await this.computeSHA256CESRDigest(captureBase);

    } else if(ocaObj.hasOwnProperty('capture_bases')) {
      const captureBases = ocaObj['capture_bases'];

      for(let i = 0; i < captureBases.length; i++) {
        captureBases[i].digest = this.cesrDummy;
        captureBases[i].digest = await this.computeSHA256CESRDigest(captureBases[i]);
      }

    } else {
      throw Error("OCA has no valid Capture Base");
    }

    return JSON.stringify(ocaObj, null, '\t');
  }

  // see https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/appendixes/cesr-sha256-encoder.md
  // for a longer explanation
  private async computeSHA256CESRDigest(captureBaseObj: any): Promise<string> {
    const canonicalizedObj = canonicalize(captureBaseObj);

    if(canonicalizedObj === undefined) {
      throw Error("Could not canonicalize the Capture Base.");
    }

    const encoder = new TextEncoder();
    const rawDigestBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(canonicalizedObj));
    const rawDigest = new Uint8Array(rawDigestBuffer);
    const bytes = new Uint8Array(rawDigest.length + 1);
    bytes[0] = 0;
    for(let i = 0; i < rawDigest.length; i++) {
      bytes[i+1] = rawDigest[i];
    }

    const base64Digest = btoa(bytes.reduce((acc, current) => acc + String.fromCharCode(current), ''));
    return 'I' + base64Digest.substring(1);
  }
}
