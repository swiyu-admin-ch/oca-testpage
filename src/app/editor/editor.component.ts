import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, EditorComponent as MonacoEditor } from 'ngx-monaco-editor-v2';
import type { editor as Editor } from 'monaco-editor';
import { JsonObject } from '../model';
import jsonMap from 'json-source-map';

function findPosition(code: string, path: string) {
  const position = jsonMap.parse(code).pointers[path];
  return position
    ? {
        start: (position.key ?? position.value).pos,
        end: position.valueEnd.pos
      }
    : undefined;
}

export interface ErrorMark {
  path: string;
  message: string;
}

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

  @Input()
  set error(mark: ErrorMark | undefined) {
    const editor = this.getEditor();
    if (!mark) {
      editor?.removeAllMarkers('custom');
      return;
    }

    const model = this.getModel();
    const position = findPosition(this._code, mark.path);
    if (!position || !model) {
      return;
    }

    const start = model.getPositionAt(position.start);
    const end = model.getPositionAt(position.end);

    editor?.setModelMarkers(model, 'custom', [
      {
        severity: 8, // MarkerSeverity.Error
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column,
        message: mark.message,
        source: mark.path
      }
    ]);
  }

  updateLayout() {
    this.getCodeEditor()?.layout();
  }

  @ViewChild('editor', { read: MonacoEditor }) editor: MonacoEditor | undefined;
  getModel() {
    return this.getCodeEditor()?.getModel();
  }
  getCodeEditor(): Editor.ICodeEditor | undefined {
    return (this.editor as any)?._editor;
  }
  getEditor(): typeof Editor | undefined {
    return (window as any).monaco?.editor;
  }

  editorOptions: Editor.IStandaloneEditorConstructionOptions = {
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
