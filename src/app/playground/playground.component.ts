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
    this.code = this.ocaService.initOCA();
  }

  code = ''
}
