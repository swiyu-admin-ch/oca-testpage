import { Injectable } from '@angular/core';
import canonicalize from 'canonicalize'

@Injectable({
  providedIn: 'root'
})
export class OCAService {
  private cesrDummy: string = "############################################";
  constructor() { }

  initOCA(): string {
    return JSON.stringify({
      capture_base: {
        type: "spec/capture_base/1.0",
        digest: "############################################",
        attributes: {
          firstname: "John",
          lastname: "Smith"
        }
      },
      overlays: []
    }, null, "\t");
  }

  async computeDigests(oca: string): Promise<string> {
    let ocaObj = JSON.parse(oca);
    
    if(ocaObj.hasOwnProperty('capture_base')) {
      const captureBase = ocaObj['capture_base'];
      captureBase.digest = this.cesrDummy;
      captureBase.digest = await this.computeSHA256CESRDigest(captureBase);

      ocaObj["capture_base"] = captureBase;

    } else if(ocaObj.hasOwnProperty('capture_bases')) {

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
