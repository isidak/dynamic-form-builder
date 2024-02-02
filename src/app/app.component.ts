import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from "./features/editor/editor.component";
import { FormRendererComponent } from "./features/form-renderer/form-renderer.component";
import { ControlConfig } from "./features/dynamic-control/control-config";
import { CardComponent } from "./shared/card/card.component";
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { FormConfigsService } from './services/form-configs.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, EditorComponent, FormRendererComponent, CardComponent, JsonPipe, NgIf, AsyncPipe]
})
export class AppComponent {
  title = 'dynamic-form-builder';
  private formConfigService = inject(FormConfigsService);

  formConfigs$ = this.formConfigService.formConfigs$;

  addForm(value: any) {
    this.formConfigService.addForm(value);
  }

  submitForm(value: any) {
    this.formConfigService.submitForm(value);
  }
}
