/*
 * © 2017 Stratio Big Data Inc., Sucursal en España.
 *
 * This software is licensed under the Apache License, Version 2.0.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the terms of the License for more details.
 *
 * SPDX-License-Identifier: Apache-2.0.
 */
import {
   ComponentFactory,
   ComponentFactoryResolver,
   ComponentRef,
   Injectable,
   Type,
   ViewContainerRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

/* local dependencies */
import { StModal } from './st-modal.component';
import { StModalButton, StModalConfig, StModalMainTextSize, StModalResponse, StModalType, StModalWidth } from './st-modal.model';

@Injectable()
export class StModalService {

   private _containerRef: ViewContainerRef = undefined;
   private dynamicModal: ComponentRef<StModal> = undefined;
   private notifyButtonInteraction: Subject<StModalResponse>;

   constructor(private _cfr: ComponentFactoryResolver) { }

   /* External API */
   set container(container: ViewContainerRef) {
      this._containerRef = container;
   }

   // - Public methods
   show(config: StModalConfig, component?: Type<any>): Observable<StModalResponse> {
      let errors: string[] = this.canCreateModal(config, component);
      if (errors && errors.length > 0) {
         throw new Error(errors.join(' '));
      }
      this.notifyButtonInteraction = new Subject<StModalResponse>();
      this.createModal(this.createConfig(config), component);
      return this.notifyButtonInteraction.asObservable();
   }

   showDeleteConfirmation(
      message: string,
      modalTitle: string,
      okButton: string,
      cancelButton: string,
      qaTag?: string,
      modalType?: StModalType
   ): Observable<StModalResponse> {

      let buttons: StModalButton[] = [
         { icon: 'icon-trash', iconLeft: true, label: okButton, primary: true, response: StModalResponse.YES },
         { icon: 'icon-circle-cross', iconLeft: true, label: cancelButton, primary: false, response: StModalResponse.NO }
      ];
      return this.show({
         qaTag: qaTag ? qaTag : 'delete-confirmation',
         modalType: modalType ? modalType : StModalType.WARNING,
         modalWidth: StModalWidth.COMPACT,
         mainText: StModalMainTextSize.BIG,
         message,
         modalTitle,
         buttons
      });
   }

   close(): void {
      this.destroy();
   }

   /* INTERNAL METHODS FOR WORK WITH MODALS */
   private createModal(modalConfig: StModalConfig, component?: Type<any>): void {
      let stModalFactory: ComponentFactory<StModal> = this._cfr.resolveComponentFactory(StModal);
      if (stModalFactory) {
         this._containerRef.clear();
         this.dynamicModal = this._containerRef.createComponent<StModal>(stModalFactory);
         this.bindVars(modalConfig, component);
      }
   }

   private destroy(): void {
      if (this.dynamicModal) {
         this.dynamicModal.destroy();
         this.dynamicModal = undefined;
         this.notifyButtonInteraction.next(StModalResponse.CLOSE);
         this.notifyButtonInteraction.complete();
      }
   }

   private bindVars(modalConfig: StModalConfig, component: Type<any>): void {
      this.dynamicModal.instance.component = component;

      this.dynamicModal.instance.close.subscribe((event: MouseEvent) => this.onClose(event));
      this.dynamicModal.instance.click.subscribe((response: StModalResponse) => this.notify(response, modalConfig.closeOnAccept));
      this.dynamicModal.instance.modalConfig = modalConfig;

      this.dynamicModal.changeDetectorRef.detectChanges();
   }

   private onClose(event: MouseEvent): void {
      this.close();
   }

   private notify(response: StModalResponse, closeOnAccept?: boolean): void {
      this.notifyButtonInteraction.next(response);
      if (closeOnAccept && response === StModalResponse.YES) {
         this.close();
      }
   }

   private canCreateModal(config: StModalConfig, component?: Type<any>): string[] {
      let errors: string[] = [];
      if (!this._containerRef) {
         errors.push(`[ERROR]: StModalService => Cant find container, are you sure you declarate in MAIN APP component in html and typescript?`);
      }
      if (this.dynamicModal !== undefined) {
         errors.push(`[ERROR]: StModalService => Can't create modal beacause already exists one. Are you sure that you call close method?)`);
      }
      if (!component && !config.message && !config.html) {
         errors.push(`[ERROR]: StModalService => Can't find message, html or component to show in modal`);
      }
      return errors;
   }

   private createConfig(config: StModalConfig): StModalConfig {
      if (config.qaTag === undefined || config.qaTag.length === 0) {
         throw new Error(`[ERROR]: StModalService => qaTag is a required field`);
      }
      return {
         inputs: config.inputs !== undefined ? config.inputs : {},
         outputs: config.outputs !== undefined ? config.outputs : {},
         modalTitle: config.modalTitle !== undefined && config.modalTitle.length > 0 ? config.modalTitle : 'DEFAULT TITLE',
         modalType: config.modalType !== undefined ? config.modalType : StModalType.NEUTRAL,
         modalWidth: config.modalWidth !== undefined ? config.modalWidth : StModalWidth.COMPACT,
         buttons: config.buttons !== undefined ? config.buttons : [],
         closeOnAccept: config.closeOnAccept !== undefined ? config.closeOnAccept : true,
         mainText: config.mainText !== undefined ? config.mainText : StModalMainTextSize.MEDIUM,
         message: config.message, // Because undefined is a valid value
         html: config.html, // Because undefined is a valid value
         contextualTitle: config.contextualTitle, // Because undefined is a valid value
         qaTag: config.qaTag // Beacuse is required and checked before
      };
   }
}
