import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EditorComponent } from '../editor/editor.component';
import { OCAService } from '../services/oca/oca.service';
import { DataService } from '../services/data/data.service';
import { FormsModule } from '@angular/forms';
import { Renderer, getRenderer, getRendererSelectionOptions } from '../renderer';
import { NgFor } from '@angular/common';
import { JsonObject, OCABundle } from '../model/top-level';
import { ErrorComponent } from '../renderer/error/error.component';

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
  inputError: string | undefined;

  ocaModel!: OCABundle;
  ocaUserModifications!: OCABundle;
  ocaError: string | undefined;

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
    this.inputError = undefined;
    this.inputUserModifications = value;
    this.updateViewRenderer();
  }

  onInputError(value: string) {
    this.inputError = value;
    this.updateViewRenderer();
  }

  onOCAChanged(value: JsonObject) {
    this.ocaError = undefined;
    // TODO: add validation
    this.ocaUserModifications = value as OCABundle;
    this.updateViewRenderer();
  }

  onOCAError(value: string) {
    this.ocaError = value;
    this.updateViewRenderer();
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

  updateViewRenderer(event?: Event) {
    this.viewRenderComponent?.clear();

    if (this.inputError || this.ocaError) {
      const viewComponent = this.viewRenderComponent?.createComponent(ErrorComponent);
      viewComponent?.setInput('title', this.inputError ? 'Input Error' : 'OCA Error');
      viewComponent?.setInput('description', this.inputError || this.ocaError);
      return;
    }

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
