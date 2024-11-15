import { Component, Input } from '@angular/core';
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
    this.codeModel.value = newCode;
  } 

  codeModel: CodeModel = {
    language: 'json',
    uri: 'file',
    value: this.code
  };
}
