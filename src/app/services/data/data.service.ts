import { Injectable } from '@angular/core';
import { JsonObject, OCABundle } from '../../model';

import PersonInput from './example/person.input.json';
import PersonOCA from './example/person.oca.json';

import PetInput from './example/pet.input.json';
import PetOCA from './example/pet.oca.json';

export interface Example {
  id: string;
  label: string;
  input: JsonObject;
  oca: OCABundle;
}

const PERSON_ID: Example = {
  id: 'person-id',
  label: 'Person ID',
  input: PersonInput,
  oca: PersonOCA as OCABundle
};

const PETS: Example = {
  id: 'pets',
  label: 'Pet Permit',
  input: PetInput,
  oca: PetOCA as OCABundle
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getExamples() {
    return [PERSON_ID, PETS];
  }
}
