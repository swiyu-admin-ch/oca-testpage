import { Injectable } from '@angular/core';
import { OCABundle } from '../../model/top-level';

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
      oca: PersonOCA as OCABundle
    };
  }

  getPetsExample() {
    return {
      input: PetInput,
      oca: PetOCA as unknown as OCABundle
    };
  }
}
