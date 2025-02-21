import { Component, Input } from '@angular/core';
import { OCAService } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';
import Colors from '../../utils/Colors';
import { OverlayType } from '../../model/oca-capture';

@Component({
  selector: 'app-vc-list',
  standalone: true,
  imports: [],
  templateUrl: './vc-list.component.html',
  styleUrl: './vc-list.component.css'
})
export class VcListComponent {
  @Input({ required: true }) input!: string;
  @Input({ required: true }) oca!: string;

  vcName = '';
  vcSubtitle = '';
  vcLogo = '';
  vcPrimaryBackgroundStart = '';
  vcPrimaryBackgroundEnd = '';

  constructor(private ocaService: OCAService) {}

  // FIXME: Error handling
  ngOnInit() {
    const captureBase = this.ocaService.getRootCaptureBase(this.oca);
    const meta = this.ocaService.getOverlay(this.oca, OverlayType.META, 'en');
    const branding = this.ocaService.getOverlay(this.oca, OverlayType.BRANDING, 'en');
    const dataSource = this.ocaService.getOverlay(this.oca, OverlayType.DATA_SOURCE);

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
      this.vcSubtitle =
        branding.primary_field?.replace(/\{\{(.*?)\}\}/g, (_: any, p1: string) =>
          mappedValues.hasOwnProperty(p1) ? mappedValues[p1] : ''
        ) ?? '';
    }
  }
}
