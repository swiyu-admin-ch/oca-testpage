import { Type } from '@angular/core';
import { VcDetailComponent } from './vc-detail/vc-detail.component';
import { VcListComponent } from './vc-list/vc-list.component';
import { VcPreviewComponent } from './vc-preview/vc-preview.component';

export const enum Renderer {
  PREVIEW = 'vc-preview',
  LIST = 'vc-list',
  DETAIL = 'vc-detail'
}

export function getRenderer(renderer: Renderer): Type<unknown> {
  switch (renderer) {
    case Renderer.PREVIEW:
      return VcPreviewComponent;

    case Renderer.LIST:
      return VcListComponent;

    case Renderer.DETAIL:
      return VcDetailComponent;
  }
}

export function getRendererSelectionOptions() {
  return [
    { key: Renderer.PREVIEW, label: 'VC Preview' },
    { key: Renderer.LIST, label: 'VC List' },
    { key: Renderer.DETAIL, label: 'VC Detail' }
  ];
}
