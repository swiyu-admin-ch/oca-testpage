import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideMonacoEditor({
      // https://github.com/microsoft/monaco-editor/issues/4778#issuecomment-2607849212
      baseUrl: window.location.origin + '/assets/monaco/min/vs'
    })
  ]
};
