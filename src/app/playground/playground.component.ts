import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { OCAService } from '../services/oca/oca.service';
import { DataService } from '../services/data/data.service';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { VcPreviewComponent } from '../renderer/vc-preview/vc-preview.component';
import { VcListComponent } from '../renderer/vc-list/vc-list.component';
import { VcDetailComponent } from '../renderer/vc-detail/vc-detail.component';

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
  viewRenderState = "";
  @ViewChild('viewRenderComponent', {read: ViewContainerRef}) viewRenderComponent: ViewContainerRef | undefined;

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
      this.viewRenderState = "vc-preview";
      this.loadViewRenderer(null);
    }
  }

  loadViewRenderer(event: Event | null) {
    this.viewRenderComponent?.clear()
    switch(this.viewRenderState) {
      case "vc-preview":
        this.viewRenderComponent?.createComponent(VcPreviewComponent);
        break;
      case "vc-list":
        this.viewRenderComponent?.createComponent(VcListComponent);
        break;
      case "vc-detail":
        this.viewRenderComponent?.createComponent(VcDetailComponent);
        break;
    }
  }

  reset(event: Event | null) {
    this.code = this.ocaService.initOCA();
    this.input = '{}';
    this.updatedInput = this.input
    this.updatedCode = this.code;
    this.loadExampleState = "";
    this.viewRenderState = "";
    this.viewRenderComponent?.clear();
  }

  addCaptureBase(event: Event) {
    this.code = this.ocaService.addCaptureBase(this.updatedCode);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.code = await this.ocaService.computeDigests(this.updatedCode);
  }
}
