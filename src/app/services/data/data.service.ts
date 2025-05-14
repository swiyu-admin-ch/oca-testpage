import { Injectable } from '@angular/core';
import { JsonObject, OCABundle } from '../../model';

import PersonInput from './example/person.input.json';
import PersonOCA from './example/person.oca.json';

import PetInput from './example/pet.input.json';
import PetOCA from './example/pet.oca.json';

import BetaIDHelvetiaInput from './example/betaid-helvetia.input.json';
import BetaIDHelvetiaOCA from './example/betaid-helvetia.oca.json';

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

const BETAID_HELVETIA: Example = {
  id: 'betaid-helvetia',
  label: 'BetaID Helvatia',
  input: BetaIDHelvetiaInput,
  oca: BetaIDHelvetiaOCA as OCABundle
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getExamples() {
    return [BETAID_HELVETIA, PERSON_ID, PETS];
  }
}
