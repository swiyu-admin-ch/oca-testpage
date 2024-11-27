import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  @Input() 
  get code(): string {
    return '';
  }
  set code(newCode: string) {
    
    this._code = newCode;
  }

  editorOptions = {
    theme: 'vs-light',
    language: 'json',
    minimap: {enabled: false},
    scrollBeyondLastLine: false
  };
  _code: string = "";

  @Output() codeChanged = new EventEmitter<string>();

  onCodeChanged(value: string) {
    this.codeChanged.emit(value);
  }
}
