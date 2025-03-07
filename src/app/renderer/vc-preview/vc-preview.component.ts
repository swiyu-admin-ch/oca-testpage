import { Component, Input, OnInit } from '@angular/core';
import { OCAService } from '../../services/oca/oca.service';
import JsonPath from '../../utils/JsonPath';
import Colors from '../../utils/Colors';
import { OverlayTypes, JsonObject, OCABundle } from '../../model';
import { getRootCaptureBase } from '../../utils/OCA';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-vc-preview',
  standalone: true,
  imports: [ErrorComponent],
  templateUrl: './vc-preview.component.html',
  styleUrl: './vc-preview.component.css'
})
export class VcPreviewComponent implements OnInit {
  @Input({ required: true }) input!: JsonObject;
  @Input({ required: true }) oca!: OCABundle;
  @Input({ required: true }) language!: string;

  vcName = '';
  vcSubtitle = '';
  vcLogo = '';
  vcPrimaryBackgroundStart = '';
  vcPrimaryBackgroundEnd = '';
  vcFontColor = '';
  error: Error | undefined;

  constructor(private ocaService: OCAService) {}

  ngOnInit() {
    try {
      this.error = undefined;
      this.update();
    } catch (e) {
      this.error = e as Error;
    }
  }

  private update() {
    const captureBase = getRootCaptureBase(this.oca);
    const meta = this.ocaService.getOverlay(this.oca, OverlayTypes.META, this.language);
    if (!meta) {
      throw new Error(`No meta overlay for language ${this.language} found`);
    }
    const branding = this.ocaService.getOverlay(this.oca, OverlayTypes.BRANDING, this.language);
    if (!branding) {
      throw new Error(`No branding overlay for language ${this.language} found`);
    }
    const dataSource = this.ocaService.getOverlay(this.oca, OverlayTypes.DATA_SOURCE);
    if (!dataSource) {
      throw new Error('No dataSource overlay found');
    }

    const mappedValues = Object.keys(captureBase.attributes).reduce<Record<string, any>>(
      (aggr, key) => ({
        ...aggr,
        [key]: JsonPath.query(this.input, dataSource.attribute_sources[key])
      }),
      {}
    );

    this.vcName = meta.name;
    this.vcLogo = branding.logo;
    this.vcPrimaryBackgroundEnd = branding.primary_background_color;
    this.vcPrimaryBackgroundStart = Colors.darken(branding.primary_background_color, 35);
    this.vcFontColor = Colors.isDarkColor(branding.primary_background_color)
      ? '#FFFFFF'
      : '#000000';

    if ('primary_field' in branding && branding.primary_field) {
      this.vcSubtitle = branding.primary_field.replace(/\{\{(.*?)\}\}/g, (_, param) => {
        if (param in mappedValues) {
          return mappedValues[param];
        }
        throw new Error(`Primary field placeholder "${param}" not found`);
      });
    }
  }
}
