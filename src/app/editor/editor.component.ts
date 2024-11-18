import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CodeEditorComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {
  @Input() 
  get code(): string {
    return ''
  }
  set code(newCode: string) {
    const clone = {...this.codeModel};
    clone.value = newCode;
    this.codeModel = clone;
  }

  @Output() codeChanged = new EventEmitter<string>();

  codeModel: CodeModel = {
    language: 'json',
    uri: 'file',
    value: this.code
  };

  onCodeChanged(value: string) {
    this.codeChanged.emit(value);
  }
}
