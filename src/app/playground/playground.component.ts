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
  updatedInput = '';

  oca = '';
  updatedOCA = '';

  // Fields

  get rendererSelectionOptions() {
    return getRendererSelectionOptions();
  }

  loadExampleState = '';
  viewRenderState = Renderer.PREVIEW;
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
    this.updatedInput = value;
    this.loadViewRenderer();
  }

  onCodeChanged(value: string) {
    this.updatedOCA = value;
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

    if (example != null) {
      this.input = JSON.stringify(example.input, null, '\t');
      this.oca = JSON.stringify(example.oca, null, '\t');
      this.updatedInput = this.input;
      this.updatedOCA = this.oca;
    }
  }

  loadViewRenderer(event?: Event) {
    this.viewRenderComponent?.clear();
    const viewComponent = this.viewRenderComponent?.createComponent(
      getRenderer(this.viewRenderState)
    );

    if (viewComponent) {
      viewComponent.setInput('input', this.updatedInput);
      viewComponent.setInput('oca', this.updatedOCA);
    }
  }

  reset(event?: Event) {
    this.oca = this.ocaService.initOCA();
    this.input = '{}';
    this.updatedInput = this.input;
    this.updatedOCA = this.oca;
    this.loadExampleState = '';
    this.viewRenderComponent?.clear();
  }

  addCaptureBase(event: Event) {
    this.oca = this.ocaService.addCaptureBase(this.updatedOCA);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.oca = await this.ocaService.computeDigests(this.updatedOCA);
  }
}
