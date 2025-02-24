import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { OCAService } from '../services/oca/oca.service';
import { DataService } from '../services/data/data.service';
import { FormsModule } from '@angular/forms';
import { Renderer, getRenderer, getRendererSelectionOptions } from '../renderer';
import { NgFor } from '@angular/common';
import { JsonObject, OCABundle } from '../model/top-level';

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
  inputModel!: JsonObject;
  inputUserModifications!: JsonObject;

  ocaModel!: OCABundle;
  ocaUserModifications!: OCABundle;

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

  onInputChanged(value: JsonObject) {
    this.inputUserModifications = value;
    this.loadViewRenderer();
  }

  onOCAChanged(value: JsonObject) {
    // TODO: add validation
    this.ocaUserModifications = value as OCABundle;
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
      this.inputModel = example.input;
      this.inputUserModifications = example.input;
      this.ocaModel = example.oca;
      this.ocaUserModifications = example.oca;
    }
  }

  loadViewRenderer(event?: Event) {
    this.viewRenderComponent?.clear();
    const viewComponent = this.viewRenderComponent?.createComponent(
      getRenderer(this.viewRenderSelection)
    );

    viewComponent?.setInput('input', this.inputUserModifications);
    viewComponent?.setInput('oca', this.ocaUserModifications);
  }

  reset(event?: Event) {
    this.ocaModel = this.ocaService.initOCA();
    this.ocaUserModifications = this.ocaModel;
    this.inputModel = {};
    this.inputUserModifications = this.inputModel;
    this.loadExampleState = '';
    this.viewRenderComponent?.clear();
  }

  addCaptureBase(event: Event) {
    this.ocaModel = this.ocaService.addCaptureBase(this.ocaUserModifications);
  }

  async computeCaptureBaseDigest(event: Event) {
    this.ocaModel = await this.ocaService.computeDigests(this.ocaUserModifications);
  }
}
