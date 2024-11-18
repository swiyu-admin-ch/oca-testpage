import { Component } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { OCAService } from '../services/oca/oca.service';

@Component({
  selector: 'app-playground',
  host: {
    class: "h-full"
  },
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css'
})
export class PlaygroundComponent {
  constructor(private ocaService: OCAService) {
    this.resetCode(null);
  }

  code = ''
  updatedCode = ''

  onCodeChanged(value: string) {
    this.updatedCode = value;
  }

  resetCode(event: Event | null) {
    this.code = this.ocaService.initOCA();
    this.updatedCode = this.code;
  }

  addCaptureBase(event: Event) {
    this.code = this.ocaService.addCaptureBase(this.updatedCode);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.code = await this.ocaService.computeDigests(this.updatedCode);
  }
}
