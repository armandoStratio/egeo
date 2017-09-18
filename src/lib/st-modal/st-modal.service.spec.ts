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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// Component
import { StModalButton, StModalConfig, StModalMainTextSize, StModalResponse, StModalType, StModalWidth } from './st-modal.model';
import { StModalService } from './st-modal.service';

@Component({ selector: 'st-modal-test', template: `<h1>Hello World</h1>` }) export class ModalTestComponent { }

let notifySubject: Subject<StModalResponse> = new Subject<StModalResponse>();
let closeSubject: Subject<Event> = new Subject<Event>();
let cfr: any;
let containerRef: any;
let clearFunction: any;
let destroyFunction: any;
let detectChangesFunction: any;
let instanceObj: any;


describe('StModalService', () => {
   let service: StModalService;

   beforeEach(() => {
      destroyFunction = jasmine.createSpy('destroy');
      detectChangesFunction = jasmine.createSpy('detectChanges');
      clearFunction = jasmine.createSpy('clear');
      cfr = {
         resolveComponentFactory: jasmine.createSpy('resolveComponentFactory').and.returnValue('fake-resolver')
      };
      instanceObj = {
         close: closeSubject.asObservable(),
         click: notifySubject.asObservable(),
         modalConfig: '',
         component: ''
      };

      containerRef = {
         clear: clearFunction,
         createComponent: jasmine.createSpy('createComponent').and.returnValue({
            instance: instanceObj,
            destroy: destroyFunction,
            changeDetectorRef: { detectChanges: detectChangesFunction }
         })
      };
   });

   it('should be close modal', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      let responseFunction = jasmine.createSpy('response');

      service.show({ qaTag: 'tag-message', message: 'message' }).subscribe(responseFunction);

      service.close();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledWith(StModalResponse.CLOSE);

      expect(clearFunction).toHaveBeenCalled();
      expect(containerRef.createComponent).toHaveBeenCalled();
      expect(destroyFunction).toHaveBeenCalled();

      service.container = undefined;
      service.close();
   });

   it('should be thrown an error when init twice', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      service.show({ qaTag: 'tag-message', message: 'message' });
      try {
         expect(service.show({ qaTag: 'tag-message', message: 'message' })).toThrow();
      } catch (error) {
         expect(error.message).toEqual(
            `[ERROR]: StModalService => Can't create modal beacause already exists one. Are you sure that you call close method?)`
         );
      }
   });

   it('should be thrown an error when init without container', () => {
      service = new StModalService(cfr);

      try {
         expect(service.show({ qaTag: 'tag-message', message: 'message' })).toThrow();
      } catch (error) {
         expect(error.message).toEqual(
            `[ERROR]: StModalService => Cant find container, are you sure you declarate in MAIN APP component in html and typescript?`
         );
      }
   });

   it('should be thrown an error when init without html nor message nor component', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      try {
         expect(service.show({ qaTag: 'tag-message' })).toThrow();
      } catch (error) {
         expect(error.message).toEqual(`[ERROR]: StModalService => Can't find message, html or component to show in modal`);
      }
   });

   it('should be thrown an error when init without qaTag', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      try {
         expect(service.show({ qaTag: undefined, message: 'message' })).toThrow();
      } catch (error) {
         expect(error.message).toEqual(`[ERROR]: StModalService => qaTag is a required field`);
      }
   });

   it('should be test all posible default configurations', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      let allConfig: StModalConfig = {
         inputs: {},
         outputs: {},
         modalTitle: 'TITLE',
         modalType: StModalType.INFO,
         modalWidth: StModalWidth.LARGE,
         buttons: [{ label: 'button', response: StModalResponse.YES }],
         closeOnAccept: false,
         mainText: StModalMainTextSize.BIG,
         message: 'test message',
         html: '<h1>Title</h1>',
         contextualTitle: 'contextual',
         qaTag: 'test'
      };

      let minConfig: StModalConfig = { message: 'test message', qaTag: 'test' };
      let defaultConfig: StModalConfig = {
         inputs: {},
         outputs: {},
         modalTitle: 'DEFAULT TITLE',
         modalType: StModalType.NEUTRAL,
         modalWidth: StModalWidth.COMPACT,
         buttons: [],
         closeOnAccept: true,
         mainText: StModalMainTextSize.MEDIUM,
         message: minConfig.message,
         html: undefined,
         contextualTitle: undefined,
         qaTag: minConfig.qaTag
      };


      service.show(allConfig);
      expect(instanceObj.modalConfig).toEqual(allConfig);

      service.close();
      service.show(minConfig);
      expect(instanceObj.modalConfig).toEqual(defaultConfig);
   });

   it('should test if resolve component factory return undefined', () => {
      let mycfr: any = { resolveComponentFactory: jasmine.createSpy('resolveComponentFactory').and.returnValue(undefined) };
      service = new StModalService(mycfr);
      service.container = containerRef;

      service.show({ qaTag: 'tag', message: 'message' });

      expect(clearFunction).toHaveBeenCalledTimes(0);
      expect(containerRef.createComponent).toHaveBeenCalledTimes(0);
   });


   it('should be manage buttons response', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      let responseFunction = jasmine.createSpy('response');
      service.show({ qaTag: 'tag', message: 'message', closeOnAccept: false }).subscribe(responseFunction);

      notifySubject.next(StModalResponse.YES);
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledWith(StModalResponse.YES);

      notifySubject.next(StModalResponse.NO);
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledWith(StModalResponse.NO);
   });

   it('should be manage buttons response with close on accept', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      let responseFunction = jasmine.createSpy('response');
      service.show({ qaTag: 'tag', message: 'message', closeOnAccept: true }).subscribe(responseFunction);

      notifySubject.next(StModalResponse.NO);
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);
      expect(responseFunction).toHaveBeenCalledWith(StModalResponse.NO);

      notifySubject.next(StModalResponse.YES);
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(3); // One for yes and one for close
      expect(responseFunction).toHaveBeenCalledWith(StModalResponse.YES);
      expect(responseFunction).toHaveBeenCalledWith(StModalResponse.CLOSE);
   });

      it('should be manage buttons response with close when close modal', () => {
      service = new StModalService(cfr);
      service.container = containerRef;

      let responseFunction = jasmine.createSpy('response');
      service.show({ qaTag: 'tag', message: 'message', closeOnAccept: true }).subscribe(responseFunction);

      closeSubject.next(new Event('click'));
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);
      expect(responseFunction).toHaveBeenCalledWith(StModalResponse.CLOSE);
   });
});
