import { Component, ComponentRef, Input, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { ComponentImporterService } from '../../services/component-importer.service';
import { DynamicComponentConfig } from '../models/dynamic-component-config';

@Component({
  selector: 'app-dynamic-component-renderer',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-component-rendered.component.html',
  styleUrl: './dynamic-component-rendered.component.css'
})
export class DynamicComponentRenderedComponent {
  @ViewChild('placeholder', { read: ViewContainerRef })
  placeholder!: ViewContainerRef;
  addedComponents: ComponentRef<any>[] = [];
  selectedComponent: ComponentRef<any> | undefined;
  addedComponent: ComponentRef<any> | undefined;

  private cmpImportService = inject(ComponentImporterService);

  @Input() set component(value: DynamicComponentConfig) {
    setTimeout(() => this.addComponent(value), 1);
  }


  async addComponent( configs: DynamicComponentConfig, ) {
   
    const cmpType = this.cmpImportService.importComponentByName(configs.name);
    const importedCmp = await cmpType!();
    const addedComponent = this.placeholder.createComponent(importedCmp);
    addedComponent.setInput('inputs', configs.inputs);


    this.addedComponents.push(addedComponent);

    addedComponent.onDestroy(() => {
      const cmpIndex = this.addedComponents.findIndex((cmp) => cmp === addedComponent);
      this.addedComponents = [...this.addedComponents.slice(0, cmpIndex), ...this.addedComponents.slice(cmpIndex + 1, this.addedComponents.length)];
     
    });

  }
}
