import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OCAService {
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
}
