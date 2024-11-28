import { Component, Input, OnInit } from '@angular/core';
import { OCAService, Overlays } from '../../services/oca/oca.service';

@Component({
  selector: 'app-vc-preview',
  standalone: true,
  imports: [],
  templateUrl: './vc-preview.component.html',
  styleUrl: './vc-preview.component.css'
})
export class VcPreviewComponent implements OnInit {
  @Input({required: true}) input!: string;
  @Input({required: true}) oca!: string;

  vcName = "";
  vcSubtitle = "";
  vcImage = "";

  constructor(private ocaService: OCAService) {

  }

  ngOnInit() {
    const meta = this.ocaService.getOverlay(this.oca, Overlays.META, "en");
    if(meta) {
      this.vcName = meta.name;
    }
  }
}
