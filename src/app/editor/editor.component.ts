import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { JsonObject } from '../model/top-level';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  @Input()
  set code(newCode: JsonObject) {
    this._code = JSON.stringify(newCode, null, '\t');
  }

  editorOptions = {
    theme: 'vs-light',
    language: 'json',
    minimap: { enabled: false },
    scrollBeyondLastLine: false
  };
  _code: string = '';

  @Output() codeChanged = new EventEmitter<JsonObject>();
  @Output() invalid = new EventEmitter<string>();

  onCodeChanged(value: string) {
    try {
      const code = JSON.parse(value);
      this.codeChanged.emit(code);
    } catch (e) {
      this.invalid.emit(`Invalid JSON: ${e}`);
    }
  }
}
