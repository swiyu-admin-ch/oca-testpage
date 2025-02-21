import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {}

  getPersonExample() {
    return {
      input: {
        portrait:
          'data:image/png;base64,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',
        firstname: 'John',
        lastname: 'Smith',
        birthdate: '01.01.2000',
        address: {
          street: 'Main Street 1',
          city: '1000 Utopia',
          country: 'Utopia'
        }
      },
      oca: {
        capture_bases: [
          {
            type: 'spec/capture_base/1.0',
            digest: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            attributes: {
              portrait: 'Text',
              firstname: 'Text',
              lastname: 'Text',
              birthdate: 'DateTime',
              address_street: 'Text',
              address_city: 'Text',
              address_country: 'Text'
            }
          }
        ],
        overlays: [
          {
            type: 'spec/overlays/meta/1.0',
            capture_base: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            language: 'en',
            name: 'Person ID'
          },
          {
            type: 'spec/overlays/format/1.0',
            capture_base: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            attribute_formats: {
              birthdate: 'DD.MM.YYYY'
            }
          },
          {
            type: 'spec/overlays/standard/1.0',
            capture_base: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            attr_standards: {
              portrait: 'urn:ietf:rfc:2397',
              birthdate: 'urn:iso:std:iso:8601'
            }
          },
          {
            type: 'spec/overlays/label/1.0',
            capture_base: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            language: 'en',
            attribute_labels: {
              portrait: 'Portrait',
              firstname: 'Firstname',
              lastname: 'Lastname',
              birthdate: 'Birthdate',
              address_street: 'Street',
              address_city: 'City',
              address_country: 'Country'
            }
          },
          {
            type: 'extend/overlays/data_source/1.0',
            capture_base: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            format: 'json',
            attribute_sources: {
              portrait: '$.portrait',
              firstname: '$.firstname',
              lastname: '$.lastname',
              birthdate: '$.birthdate',
              address_street: '$.address.street',
              address_city: '$.address.city',
              address_country: '$.address.country'
            }
          },
          {
            type: 'aries/overlays/branding/1.1',
            capture_base: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            language: 'en',
            theme: 'light',
            logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAACQCAMAAABgZzS4AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAHsIAAB7CAW7QdT4AAAHRUExURUdwTP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3MG3McAAACadFJOUwAwsJCAD7Po0AH7PPjwTMoVzti5uMJLUNZoLVsdX+oHoZYFihhag27AYveVHqRCyI/SUWBlRtGT+uDBJmnvT3gbIOmML94+48TtzWuUjp1K9HM/BtQ5JE1c5wn2AwiyVZg22xc7fqJAZALLjZLVEbb52lltcjT9fF0fr1L8PSMEKPFwN4Qnam8N9XS8iCsMsUnukdnJSHGaOGEBzcSNAAAEGUlEQVR42u2c51YTQRSAJ33TCQmh19BiEJBAEEV6710EKYpg74AC9t57vU/r4ah/JAlbBubOOt8T7HdmZ+e2WUIEAoFAIGBBiqes2liVagOwpVYZq8s8KbwZ1LXHYAdSex03Ava7hXmQgLyI086DwsJlSMrEFnYN+3Ef7ErfMGqHHCvIYnMDrcL9VyMgk5HR8zgdlvyggKvFGB2cNlDEiTF8DuE7oBBHLTYHM6jgFiqFk0Ogiu923tdhGzMeh0xQTT8Whxvr6iXWp3E4tB4DDRxDcV4UeUETrzGc3SbQCILNnePSKuHKYS5hBM0YWTukAwW+MpaQaEj47PwvBEA6/wvBeCkMQAkDz2fEX94wrG200ZI4ze59OgvUOMtfGoEp9iinJ1HOyiHfRU/iwBwjiUmgyCR/WelOMnk/JbYxMZII0JQIMJJIpSmRykiigaZEAyMJG00JGyMJF00Jl5D4z18nXWxsXXxidXHY6SLs0EUAOKaHUHzuAMVjIl+kp/97ocBJT8LJrnhGLfBoY1iMNfF+SmzzQw8FZeKj49AnmiyatzaVpZAIWzw0JDyMJXTRAtZHM56UapUoZe9Axr9oc/AWIZDQOirUSlDQpEWiiSChn7+slGZigWiQkZCIOocQQcUtNQ6PCDJqHUoV7oQJOsZOKKwgOwlCiq8qcfAvEZx8k30J5OVzgpaNTXkO1hyCGTkXo3zHCXLsWxPJFS4vcHHTzhlJfFmw8C4PCr+pa48z4hjj6NrmH/i/QCsQCAQCgQ6xVGQ5gyWNzU8KD1qPSJ298SKn3k7piPVgYWlzY0nQmVVhQfLoRyuzR0Mr/pjKDqRN8heEVrMrjzJ5+JauXHNBWje9FnB3WoE5t6tlXx5+/EGwzGTNoDgP8c/IeIbVdHP46fhePX/+49qBNDfsC+60+nOnaE97pNQMeh2wzzi8F9Nphe9T0aHrwIzPQ9F7Wr+bNfUZwJyMS02qv8aWsN8BSHAEoleUG7ybtl4DVFybL3mhSMEQcQNC3AOyZ0Asz3yAlr5MWdvDcwhQcyi4q8KZHkBPz5mkCkXmw8ABh5eT9L47JOAEqSORw1oecENbVoJ1mAWOcMf92p68AFzhjSdRC5yRG0fCyJtEvFkvG28SNr1KBPTwOv3Uw8YmXr4cLsRPItw8OTxMEHhktfHjkPc2YWGDnwBwKkkovsxHKG5OPoZq4CEp2j3TDmJPT+WNx99GvDWk2/JLNgM4SzYRZdd2ZqbnsSlYb8woLwJeiQbwlDH9YfXl2KZLGArK9TVa23vF2YsMS/unF7Np/QE0Jf0iiybLYA3tGan8U+fq96vd9bH8U3ht7y43tw7f3MvG4+zE+8H+DxWiBaymGb8aKvBLapvxMf9KaJRVMz7xWEQpf2MRAoEAI78AbqJTMu509qcAAAAASUVORK5CYII=',
            primary_background_color: '#FE3434',
            primary_field: '{{firstname}} {{lastname}}'
          },
          {
            type: 'extend/overlays/cluster_ordering/1.0',
            capture_base: 'IMbXA_RsMhYKpcq9qqKhJCSljyIdwc-T96GuhavMKved',
            language: 'en',
            cluster_order: {
              main: 1,
              address: 2
            },
            cluster_labels: {
              main: 'Content',
              address: 'Address'
            },
            attribute_cluster_order: {
              main: {
                portrait: 1,
                firstname: 2,
                lastname: 3,
                birthdate: 4
              },
              address: {
                address_street: 1,
                address_city: 2,
                address_country: 3
              }
            }
          }
        ]
      }
    };
  }
  getPetsExample() {
    return {
      input: {
        firstname: 'John',
        lastname: 'Smith',
        address: {
          street: 'Main Street 1',
          city: '1000 Utopia',
          country: 'Utopia'
        },
        pets: [
          {
            race: 'Dog',
            name: 'Rex'
          },
          {
            race: 'Cat',
            name: 'Mr. Pineapple'
          }
        ]
      },
      oca: {
        capture_bases: [
          {
            type: 'spec/capture_base/1.0',
            digest: 'IDif6Jd863C_YYjp1cHFCTAUr1_TzZSS1l-pv21Q56qs',
            attributes: {
              firstname: 'Text',
              lastname: 'Text',
              address_street: 'Text',
              address_city: 'Text',
              address_country: 'Text',
              pets: 'Array[refs:IKLvtGx1NU0007DUTTmI_6Zw-hnGRFicZ5R4vAxg4j2j]'
            }
          },
          {
            type: 'spec/capture_base/1.0',
            digest: 'IKLvtGx1NU0007DUTTmI_6Zw-hnGRFicZ5R4vAxg4j2j',
            attributes: {
              name: 'Text',
              race: 'Text'
            }
          }
        ],
        overlays: [
          {
            type: 'extend/overlays/data_source/1.0',
            capture_base: 'IDif6Jd863C_YYjp1cHFCTAUr1_TzZSS1l-pv21Q56qs',
            format: 'json',
            attribute_sources: {
              firstname: '$.firstname',
              lastname: '$.lastname',
              address_street: '$.address.street',
              address_city: '$.address.city',
              address_country: '$.address.country',
              pets: '$.pets'
            }
          },
          {
            type: 'extend/overlays/data_source/1.0',
            capture_base: 'IKLvtGx1NU0007DUTTmI_6Zw-hnGRFicZ5R4vAxg4j2j',
            format: 'json',
            attribute_sources: {
              name: '$.pets[*].name',
              race: '$.pets[*].race'
            }
          },
          {
            type: 'aries/overlays/branding/1.1',
            capture_base: 'IDif6Jd863C_YYjp1cHFCTAUr1_TzZSS1l-pv21Q56qs',
            language: 'en',
            theme: 'light',
            logo: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGbSURBVHgBvVaBUcMwDFQ4BjAbmA06QjYgGzQbkA1aJmg3yHWCwgSGCVImcJkg3UDYjVMUI6VxW/g7X+701kuWZTsAI0DEwo0GO9RuKMKpYGvdsH4uXALnqPE3DOFrhs8hFc5pizxyN2YCZyS9+5FYuWCfgYzZJYFUon2UuwMZ+xG7xO3gXKBQ95xwGyHIuxuvbhwY/oPo+WbSQAyKtDCGVtWM3aMifmXENcGnb3uqp6Q2NZHgEpnWDQl5rsJwxgS9NTBZ98ghEdgdcA6t3yOpJQtGSIUVekHN+DwJWsfSWSGLmsm2xWHti2iOEbQav6I3IYtPIqDdZwvDc3K0OY5W5EvQ2vUb2jJZaBLIogxL5pUcf9LC7gzZQPigJXFe4HmsyPw1sRvk9jKsjj4Fc5yOOfFTyDcLcEGfMR0VpACnlUvC4j+C9FjFulkURLuPhdvgIcuy08UbPxMabofBjRMHOsAfIS6db21fOgXXYe/K9kgNgxWFmr7A9dhMmoXD001h8OcvSPpLWkIKsLu3THC2yBxG7B48S5IoJb1vHubbPPxs2qsAAAAASUVORK5CYII=',
            primary_background_color: '#2C75E3',
            primary_field: '{{firstname}} {{lastname}} from {{address_country}}'
          },
          {
            type: 'spec/overlays/meta/1.0',
            capture_base: 'IDif6Jd863C_YYjp1cHFCTAUr1_TzZSS1l-pv21Q56qs',
            language: 'en',
            name: 'Pet Permit'
          },
          {
            capture_base: 'IDif6Jd863C_YYjp1cHFCTAUr1_TzZSS1l-pv21Q56qs',
            type: 'extend/overlays/cluster_ordering/1.0',
            language: 'en',
            cluster_order: {
              pets: 1,
              owner: 2
            },
            cluster_labels: {
              pets: 'Pets',
              owner: 'Owner information'
            },
            attribute_cluster_order: {
              pets: {
                pets: 1
              },
              owner: {
                firstname: 1,
                lastname: 2,
                address_street: 3,
                address_city: 4,
                address_country: 5
              }
            }
          },
          {
            capture_base: 'IKLvtGx1NU0007DUTTmI_6Zw-hnGRFicZ5R4vAxg4j2j',
            type: 'spec/overlays/label/1.0',
            language: 'en',
            attribute_labels: {
              race: 'Race',
              name: 'Name'
            }
          },
          {
            capture_base: 'IDif6Jd863C_YYjp1cHFCTAUr1_TzZSS1l-pv21Q56qs',
            type: 'spec/overlays/label/1.0',
            language: 'en',
            attribute_labels: {
              firstname: 'Firstname',
              lastname: 'Lastname',
              address_street: 'Street',
              address_city: 'City',
              address_country: 'Country'
            }
          },
          {
            capture_base: 'IKLvtGx1NU0007DUTTmI_6Zw-hnGRFicZ5R4vAxg4j2j',
            type: 'extend/overlays/cluster_ordering/1.0',
            language: 'en',
            cluster_order: {
              default: 1
            },
            cluster_labels: {},
            attribute_cluster_order: {
              default: {
                race: 1,
                name: 2
              }
            }
          }
        ]
      }
    };
  }
}
