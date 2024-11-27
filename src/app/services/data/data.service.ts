import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getPersonExample() {
    return {
      input: {
        firstname: "John",
        lastname: "Smith",
        birthdate: "01.01.2000",
        address: {
          street: "Main Street 1",
          country: "Utopia"
        }
      },
      oca: {
        capture_bases: [
          {
            type: "spec/capture_base/1.0",
            digest: "IHlGw+Ud8t+H/vUTU2vOro0XjrBKEeNBcl6lLSOb/G+H",
            attributes: {
              firstname: "Text",
              lastname: "Text",
              birthdate: "DateTime",
              address_street: "Text",
              address_country: "Text",
            }
          }
        ],
        overlays: [
          {
            type: "spec/overlays/meta/1.0",
            capture_base: "IHlGw+Ud8t+H/vUTU2vOro0XjrBKEeNBcl6lLSOb/G+H",
            language: "en",
            name: "Person ID"
          },
          {
            type: "spec/overlays/format/1.0",
            capture_base: "IHlGw+Ud8t+H/vUTU2vOro0XjrBKEeNBcl6lLSOb/G+H",
            attribute_formats: {
              birthdate: "DD.MM.YYYY"
            }
          },
          {
            type: "spec/overlays/standard/1.0",
            capture_base: "IHlGw+Ud8t+H/vUTU2vOro0XjrBKEeNBcl6lLSOb/G+H",
            attr_standards: {
              birthdate: "urn:iso:std:iso:8601"
            }
          },
          {
            type: "spec/overlays/label/1.0",
            capture_base: "IHlGw+Ud8t+H/vUTU2vOro0XjrBKEeNBcl6lLSOb/G+H",
            language: "en",
            attribute_labels: {
              firstname: "Firstname",
              lastname: "Lastname",
              birthdate: "Birthdate",
              address_street: "Street",
              address_country: "Country",
            }
          },
          {
            type: "extend/overlays/data_source/1.0",
            capture_base: "IHlGw+Ud8t+H/vUTU2vOro0XjrBKEeNBcl6lLSOb/G+H",
            format: "json",
            attribute_sources: {
              firstname: "$.firstname",
              lastname: "$.lastname",
              birthdate: "$.birthdate",
              address_street: "$.address.street",
              address_country: "$.address.country",
            }
          }
        ]
      }
    }
  }
}
