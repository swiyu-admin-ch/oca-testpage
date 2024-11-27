import { Component } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { OCAService } from '../services/oca/oca.service';
import { DataService } from '../services/data/data.service';
import { FormsModule, ValueChangeEvent } from '@angular/forms';

@Component({
  selector: 'app-playground',
  host: {
    class: "h-full"
  },
  standalone: true,
  imports: [FormsModule ,EditorComponent],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css'
})
export class PlaygroundComponent {
  // Internal properties

  input = '{}';
  updatedInput = '';

  code = '';
  updatedCode = '';

  // Fields

  loadExampleState = "";

  constructor(private ocaService: OCAService, private dataService: DataService) {
    this.reset(null);
  }

  onInputChanged(value: string) {
    this.updatedInput = value;
  }

  onCodeChanged(value: string) {
    this.updatedCode = value;
  }

  loadExample(event: Event) {
    let example = null;
    switch(this.loadExampleState) {
      case "person-id":
        example = this.dataService.getPersonExample();
        break;
    }

    if(example != null) {
      this.input = JSON.stringify(example.input, null, '\t');
      this.code = JSON.stringify(example.oca, null, '\t');
    }
  }

  reset(event: Event | null) {
    this.code = this.ocaService.initOCA();
    this.input = '{}';
    this.updatedInput = this.input
    this.updatedCode = this.code;
    this.loadExampleState = "";
  }

  addCaptureBase(event: Event) {
    this.code = this.ocaService.addCaptureBase(this.updatedCode);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.code = await this.ocaService.computeDigests(this.updatedCode);
  }
}
