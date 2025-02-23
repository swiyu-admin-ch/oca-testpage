import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { OCAService } from '../services/oca/oca.service';
import { DataService } from '../services/data/data.service';
import { FormsModule } from '@angular/forms';
import { Renderer, getRenderer, getRendererSelectionOptions } from '../renderer';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-playground',
  host: {
    class: 'h-full'
  },
  standalone: true,
  imports: [FormsModule, EditorComponent, NgFor],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css'
})
export class PlaygroundComponent {
  // Internal properties
  input = '{}';
  oca = '';

  // Fields
  get rendererSelectionOptions() {
    return getRendererSelectionOptions();
  }

  loadExampleState = '';
  viewRenderSelection = Renderer.PREVIEW;
  @ViewChild('viewRenderComponent', { read: ViewContainerRef }) viewRenderComponent:
    | ViewContainerRef
    | undefined;

  constructor(
    private ocaService: OCAService,
    private dataService: DataService
  ) {
    this.reset();
  }

  onInputChanged(value: string) {
    this.input = value;
    this.loadViewRenderer();
  }

  onOCAChanged(value: string) {
    this.oca = value;
    this.loadViewRenderer();
  }

  loadExample(event: Event) {
    let example = null;
    switch (this.loadExampleState) {
      case 'person-id':
        example = this.dataService.getPersonExample();
        break;
      case 'pets':
        example = this.dataService.getPetsExample();
        break;
    }

    if (example) {
      this.input = JSON.stringify(example.input, null, '\t');
      this.oca = JSON.stringify(example.oca, null, '\t');
    }
  }

  loadViewRenderer(event?: Event) {
    this.viewRenderComponent?.clear();
    const viewComponent = this.viewRenderComponent?.createComponent(
      getRenderer(this.viewRenderSelection)
    );

    if (viewComponent) {
      viewComponent.setInput('input', this.input);
      viewComponent.setInput('oca', this.oca);
    }
  }

  reset(event?: Event) {
    this.oca = this.ocaService.initOCA();
    this.input = '{}';
    this.loadExampleState = '';
    this.viewRenderComponent?.clear();
  }

  addCaptureBase(event: Event) {
    this.oca = this.ocaService.addCaptureBase(this.oca);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.oca = await this.ocaService.computeDigests(this.oca);
  }
}
