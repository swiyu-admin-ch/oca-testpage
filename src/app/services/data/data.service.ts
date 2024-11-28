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
          },
          {
            type: "aries/overlays/branding/1.1",
            capture_base: "IHlGw+Ud8t+H/vUTU2vOro0XjrBKEeNBcl6lLSOb/G+H",
            language: "en",
            theme: "light",
            logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAACQCAMAAABgZzS4AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAHsIAAB7CAW7QdT4AAAHRUExURUdwTP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3MG3McAAACadFJOUwAwsJCAD7Po0AH7PPjwTMoVzti5uMJLUNZoLVsdX+oHoZYFihhag27AYveVHqRCyI/SUWBlRtGT+uDBJmnvT3gbIOmML94+48TtzWuUjp1K9HM/BtQ5JE1c5wn2AwiyVZg22xc7fqJAZALLjZLVEbb52lltcjT9fF0fr1L8PSMEKPFwN4Qnam8N9XS8iCsMsUnukdnJSHGaOGEBzcSNAAAEGUlEQVR42u2c51YTQRSAJ33TCQmh19BiEJBAEEV6710EKYpg74AC9t57vU/r4ah/JAlbBubOOt8T7HdmZ+e2WUIEAoFAIGBBiqes2liVagOwpVYZq8s8KbwZ1LXHYAdSex03Ava7hXmQgLyI086DwsJlSMrEFnYN+3Ef7ErfMGqHHCvIYnMDrcL9VyMgk5HR8zgdlvyggKvFGB2cNlDEiTF8DuE7oBBHLTYHM6jgFiqFk0Ogiu923tdhGzMeh0xQTT8Whxvr6iXWp3E4tB4DDRxDcV4UeUETrzGc3SbQCILNnePSKuHKYS5hBM0YWTukAwW+MpaQaEj47PwvBEA6/wvBeCkMQAkDz2fEX94wrG200ZI4ze59OgvUOMtfGoEp9iinJ1HOyiHfRU/iwBwjiUmgyCR/WelOMnk/JbYxMZII0JQIMJJIpSmRykiigaZEAyMJG00JGyMJF00Jl5D4z18nXWxsXXxidXHY6SLs0EUAOKaHUHzuAMVjIl+kp/97ocBJT8LJrnhGLfBoY1iMNfF+SmzzQw8FZeKj49AnmiyatzaVpZAIWzw0JDyMJXTRAtZHM56UapUoZe9Axr9oc/AWIZDQOirUSlDQpEWiiSChn7+slGZigWiQkZCIOocQQcUtNQ6PCDJqHUoV7oQJOsZOKKwgOwlCiq8qcfAvEZx8k30J5OVzgpaNTXkO1hyCGTkXo3zHCXLsWxPJFS4vcHHTzhlJfFmw8C4PCr+pa48z4hjj6NrmH/i/QCsQCAQCgQ6xVGQ5gyWNzU8KD1qPSJ298SKn3k7piPVgYWlzY0nQmVVhQfLoRyuzR0Mr/pjKDqRN8heEVrMrjzJ5+JauXHNBWje9FnB3WoE5t6tlXx5+/EGwzGTNoDgP8c/IeIbVdHP46fhePX/+49qBNDfsC+60+nOnaE97pNQMeh2wzzi8F9Nphe9T0aHrwIzPQ9F7Wr+bNfUZwJyMS02qv8aWsN8BSHAEoleUG7ybtl4DVFybL3mhSMEQcQNC3AOyZ0Asz3yAlr5MWdvDcwhQcyi4q8KZHkBPz5mkCkXmw8ABh5eT9L47JOAEqSORw1oecENbVoJ1mAWOcMf92p68AFzhjSdRC5yRG0fCyJtEvFkvG28SNr1KBPTwOv3Uw8YmXr4cLsRPItw8OTxMEHhktfHjkPc2YWGDnwBwKkkovsxHKG5OPoZq4CEp2j3TDmJPT+WNx99GvDWk2/JLNgM4SzYRZdd2ZqbnsSlYb8woLwJeiQbwlDH9YfXl2KZLGArK9TVa23vF2YsMS/unF7Np/QE0Jf0iiybLYA3tGan8U+fq96vd9bH8U3ht7y43tw7f3MvG4+zE+8H+DxWiBaymGb8aKvBLapvxMf9KaJRVMz7xWEQpf2MRAoEAI78AbqJTMu509qcAAAAASUVORK5CYII=",
            primary_background: "#FBB0B0",
            primary_field: "{{firstname}} {{lastname}}"
          }
        ]
      }
    }
  }
}
