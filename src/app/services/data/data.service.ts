import { Injectable } from '@angular/core';

import PersonInput from './example/person.input.json';
import PersonOCA from './example/person.oca.json';

import PetInput from './example/pet.input.json';
import PetOCA from './example/pet.oca.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {}

  getPersonExample() {
    return {
      input: PersonInput,
      oca: PersonOCA
    };
  }

  getPetsExample() {
    return {
      input: PetInput,
      oca: PetOCA
    };
  }
}
