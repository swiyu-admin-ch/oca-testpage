import { Component, Input } from '@angular/core';
import { OCAService } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';
import Colors from '../../utils/Colors';
import { OverlayTypes, JsonObject, OCABundle } from '../../model';
import { getRootCaptureBase } from '../../utils/OCA';

@Component({
  selector: 'app-vc-list',
  standalone: true,
  imports: [],
  templateUrl: './vc-list.component.html',
  styleUrl: './vc-list.component.css'
})
export class VcListComponent {
  @Input({ required: true }) input!: JsonObject;
  @Input({ required: true }) oca!: OCABundle;
  @Input({ required: true }) language!: string;

  vcName = '';
  vcSubtitle = '';
  vcLogo = '';
  vcPrimaryBackgroundStart = '';
  vcPrimaryBackgroundEnd = '';

  constructor(private ocaService: OCAService) {}

  ngOnInit() {
    this.update();
  }

  // FIXME: Error handling
  private update() {
    const captureBase = getRootCaptureBase(this.oca);
    const meta = this.ocaService.getOverlay(this.oca, OverlayTypes.META, this.language);
    const branding = this.ocaService.getOverlay(this.oca, OverlayTypes.BRANDING, this.language);
    const dataSource = this.ocaService.getOverlay(this.oca, OverlayTypes.DATA_SOURCE);

    const mappedValues: Record<string, any> = {};
    if (dataSource) {
      for (const key in captureBase.attributes) {
        mappedValues[key] = JsonPath.query(this.input, dataSource.attribute_sources[key]);
      }
    }

    if (meta) {
      this.vcName = meta.name;
    }
    if (branding) {
      this.vcLogo = branding.logo;
      this.vcPrimaryBackgroundEnd = branding.primary_background_color;
      this.vcPrimaryBackgroundStart = Colors.darken(branding.primary_background_color, 35);
      if ('primary_field' in branding && branding.primary_field) {
        this.vcSubtitle = branding.primary_field?.replace(/\{\{(.*?)\}\}/g, (_: any, p1: string) =>
          mappedValues.hasOwnProperty(p1) ? mappedValues[p1] : ''
        );
      }
    }
  }
}
