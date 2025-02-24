import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { OCAService } from '../../services/oca/oca.service';
import { OCABundle } from '../../model/top-level';

@Component({
  selector: 'app-language-selection',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './language-selection.component.html',
  styleUrl: './language-selection.component.css'
})
export class LanguageSelectionComponent {
  selected!: string;
  selectionOptions: string[] = [];
  constructor(private ocaService: OCAService) {}

  @Input({ required: true })
  set oca(oca: OCABundle) {
    this.selectionOptions = this.ocaService.getLanguages(oca);
    if (!this.selectionOptions.length) {
      this.selectionOptions.push('en');
    }
    this.selected = this.selectionOptions[0];
    this.onChanged();
  }

  @Output() languageChanged = new EventEmitter<string>();
  onChanged(event?: Event) {
    this.languageChanged.emit(this.selected);
  }
}
