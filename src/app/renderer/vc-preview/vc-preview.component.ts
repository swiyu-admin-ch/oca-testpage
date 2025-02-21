import { Component, Input, OnInit } from '@angular/core';
import { OCAService, Overlays } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';
import Colors from '../../utils/Colors';

@Component({
  selector: 'app-vc-preview',
  standalone: true,
  imports: [],
  templateUrl: './vc-preview.component.html',
  styleUrl: './vc-preview.component.css'
})
export class VcPreviewComponent implements OnInit {
  @Input({ required: true }) input!: string;
  @Input({ required: true }) oca!: string;

  vcName = '';
  vcSubtitle = '';
  vcLogo = '';
  vcPrimaryBackgroundStart = '';
  vcPrimaryBackgroundEnd = '';
  vcFontColor = '';

  constructor(private ocaService: OCAService) {}

  // FIXME: Error handling
  ngOnInit() {
    const captureBase = this.ocaService.getRootCaptureBase(this.oca);
    const meta = this.ocaService.getOverlay(this.oca, Overlays.META, 'en');
    const branding = this.ocaService.getOverlay(this.oca, Overlays.BRANDING, 'en');
    const dataSource = this.ocaService.getOverlay(this.oca, Overlays.DATA_SOURCE);

    let mappedValues: { [x: string]: any } = {};
    for (const key in captureBase.attributes) {
      mappedValues[key] = JsonPath.query(this.input, dataSource.attribute_sources[key]);
    }

    if (meta) {
      this.vcName = meta.name;
    }
    if (branding) {
      this.vcLogo = branding.logo;
      this.vcPrimaryBackgroundEnd = branding.primary_background_color;
      this.vcPrimaryBackgroundStart = Colors.darken(branding.primary_background_color, 35);
      this.vcFontColor = Colors.isDarkColor(branding.primary_background_color)
        ? '#FFFFFF'
        : '#000000';
      this.vcSubtitle = branding.primary_field.replace(/\{\{(.*?)\}\}/g, (_: any, p1: string) =>
        mappedValues.hasOwnProperty(p1) ? mappedValues[p1] : ''
      );
    }
  }
}
