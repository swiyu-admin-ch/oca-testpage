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

  oca = '';
  updatedOCA = '';

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
    this.updatedOCA = value;
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
      this.oca = JSON.stringify(example.oca, null, '\t');
      this.viewRenderState = "vc-preview";
      this.loadViewRenderer(null);
    }
  }

  loadViewRenderer(event: Event | null) {
    this.viewRenderComponent?.clear()
    let viewComponent = null;
    switch(this.viewRenderState) {
      case "vc-preview":
        viewComponent = this.viewRenderComponent?.createComponent(VcPreviewComponent);
        break;
      case "vc-list":
        viewComponent = this.viewRenderComponent?.createComponent(VcListComponent);
        break;
      case "vc-detail":
        viewComponent = this.viewRenderComponent?.createComponent(VcDetailComponent);
        break;
    }

    if(viewComponent != null) {
      viewComponent.setInput('input', this.input);
      viewComponent.setInput('oca', this.oca);
    }
  }

  reset(event: Event | null) {
    this.oca = this.ocaService.initOCA();
    this.input = '{}';
    this.updatedInput = this.input
    this.updatedOCA = this.oca;
    this.loadExampleState = "";
    this.viewRenderState = "";
    this.viewRenderComponent?.clear();
  }

  addCaptureBase(event: Event) {
    this.oca = this.ocaService.addCaptureBase(this.updatedOCA);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.oca = await this.ocaService.computeDigests(this.updatedOCA);
  }
}
