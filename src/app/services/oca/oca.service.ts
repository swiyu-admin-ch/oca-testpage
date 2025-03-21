import { Injectable } from '@angular/core';
import { CaptureBase, OverlaySpecType, OCABundle, CaptureBaseSpecType } from '../../model';
import {
  calculateCaptureBaseDigest,
  getOverlayByDigest,
  getRootCaptureBase
} from '../../utils/OCA';

const DUMMY_CAPTURE_BASE: Readonly<CaptureBase> = {
  type: CaptureBaseSpecType.BASE_1_0,
  digest: 'IEsMrJ1buvWSv-Lh_yooVZ22PY6fUKnDt19u6-Y8vKwG',
  attributes: {
    firstname: 'Text',
    lastname: 'Text'
  }
};

const NESTED_DUMMY_CAPTURE_BASE: Readonly<CaptureBase> = {
  type: CaptureBaseSpecType.BASE_1_0,
  digest: '############################################',
  attributes: {
    title: 'Text',
    items: 'Array[refs:############################################]'
  }
};

@Injectable({
  providedIn: 'root'
})
export class OCAService {
  constructor() {}

  initOCA(): OCABundle {
    return {
      capture_bases: [DUMMY_CAPTURE_BASE],
      overlays: []
    };
  }

  addCaptureBase(oca: OCABundle): OCABundle {
    return {
      capture_bases: [...oca.capture_bases, NESTED_DUMMY_CAPTURE_BASE],
      overlays: oca.overlays
    };
  }

  async computeDigests(oca: OCABundle): Promise<OCABundle> {
    const oldToNewMapping: Record<string, string> = {};

    const capture_bases = [];
    for (const base of oca.capture_bases) {
      const digest = await calculateCaptureBaseDigest(base);
      capture_bases.push({ ...base, digest });
      if (digest != base.digest) {
        oldToNewMapping[base.digest] = digest;
      }
    }

    const overlays = oca.overlays.map((curr) => {
      if (curr.capture_base in oldToNewMapping) {
        return { ...curr, capture_base: oldToNewMapping[curr.capture_base] };
      } else {
        return curr;
      }
    });

    return { capture_bases, overlays };
  }

  getOverlay<Type extends OverlaySpecType>(
    oca: OCABundle,
    overlay: Type | ReadonlyArray<Type>,
    language: string = 'en'
  ) {
    const rootCaptureBase = getRootCaptureBase(oca);
    const rootDigest = rootCaptureBase.digest;

    return getOverlayByDigest<Type>(oca, overlay, rootDigest, language);
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

  getLanguages(oca: OCABundle) {
    const result = oca.overlays.reduce((aggr, overlay) => {
      if ('language' in overlay && overlay.language) {
        aggr.add(overlay.language);
      }
      return aggr;
    }, new Set<string>());
    return Array.from(result);
  }
}
