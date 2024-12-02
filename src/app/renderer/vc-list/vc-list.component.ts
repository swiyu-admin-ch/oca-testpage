import { Component, Input } from '@angular/core';
import { OCAService, Overlays } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';

@Component({
  selector: 'app-vc-list',
  standalone: true,
  imports: [],
  templateUrl: './vc-list.component.html',
  styleUrl: './vc-list.component.css'
})
export class VcListComponent {
  @Input({required: true}) input!: string;
  @Input({required: true}) oca!: string;

  vcName = "";
  vcSubtitle = "";
  vcLogo = "";
  vcPrimaryBackground = "";

  constructor(private ocaService: OCAService) {}

  // FIXME: Error handling
  ngOnInit() {
    const captureBase = this.ocaService.getRootCaptureBase(this.oca);
    const meta = this.ocaService.getOverlay(this.oca, Overlays.META, "en");
    const branding = this.ocaService.getOverlay(this.oca, Overlays.BRANDING, "en");
    const dataSource = this.ocaService.getOverlay(this.oca, Overlays.DATA_SOURCE);

    let mappedValues: {[x: string]: any;} = {};
    for(const key in captureBase.attributes) {
      mappedValues[key] = JsonPath.query(this.input, dataSource.attribute_sources[key]);
    }

    if(meta) {
      this.vcName = meta.name;
    }
    if(branding) {
      this.vcLogo = branding.logo;
      this.vcPrimaryBackground = branding.primary_background;
      this.vcSubtitle = branding.primary_field.replace(/\{\{(.*?)\}\}/g, (_: any, p1: string) => mappedValues.hasOwnProperty(p1) ? mappedValues[p1]: '');
    }
  }
}
