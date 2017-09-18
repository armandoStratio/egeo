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
import { DebugElement } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

// Component
import { StModal } from './st-modal.component';
import { StModalButton, StModalConfig, StModalMainTextSize, StModalResponse, StModalType, StModalWidth } from './st-modal.model';

@Component({
   selector: 'st-modal-test',
   template: `<h1>Hello World</h1> <h2>{{name}}</h2>
   <div (click)="onClick()" id="st-modal-test-out">Out</div>
   `
})
export class ModalTestComponent {
   @Input() name: string;
   @Output() notify: EventEmitter<string> = new EventEmitter<string>();

   onClick(): void {
      this.notify.emit(this.name);
   }
}


let comp: StModal;
let fixture: ComponentFixture<StModal>;
let de: DebugElement;

let message: string = 'test message';
let html: string = '<h1>test message</h1>';
let contextualTitle: string = 'contextual title';
let title: string = 'DEFAULT TITLE';
let qaTag: string = 'st-modal-test';

let buttons: StModalButton[] = [
   { icon: 'icon-trash', iconLeft: true, label: 'Yes', primary: true, response: StModalResponse.YES },
   { icon: 'icon-circle-cross', iconLeft: true, label: 'No', response: StModalResponse.NO }
];

let modalCompact: Object = { 'min-width': '700px', 'max-width': '700px', 'max-heigth': '500px' };
let modalRegular: Object = { 'min-width': '950px', 'max-width': '950px', 'max-heigth': '500px' };
let modalLarge: Object = { 'min-width': '1240px', 'max-width': '1240px', 'min-heigth': '600px', 'max-heigth': '600px' };

function getInitialConfig(): StModalConfig {
   return {
      inputs: {},
      outputs: {},
      modalTitle: title,
      modalType: StModalType.NEUTRAL,
      modalWidth: StModalWidth.COMPACT,
      buttons: [],
      closeOnAccept: true,
      mainText: StModalMainTextSize.MEDIUM,
      qaTag
   };
}

describe('StModal', () => {

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [StModal, ModalTestComponent]
      });

      TestBed.overrideModule(BrowserDynamicTestingModule, {
         set: { entryComponents: [ModalTestComponent] }
      }).compileComponents();  // compile template and css

   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StModal);
      comp = fixture.componentInstance;
      comp.modalConfig = getInitialConfig();
   });

   afterEach(() => {
      comp.modalConfig = getInitialConfig();
   });

   it('should be init', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.getModalSize()).toEqual(modalCompact);
      expect(comp.getTitleClass()).toEqual('st-modal-neutral');
      expect(comp.hasContextualTitle()).toBeFalsy();
      expect(comp.contextualTitle).toBeUndefined();
      expect(comp.getHeaderHeight()).toEqual('80px');
      expect(comp.hasIcon()).toBeFalsy();
      expect(comp.getIcon()).toEqual('');
      expect(comp.getTitle()).toEqual(title);
      expect(comp.hasButtons()).toBeFalsy();
      expect(comp.isMessageModal()).toBeTruthy();
      expect(comp.getButtons()).toEqual([]);
      expect(comp.getHTML()).toBeUndefined();
      expect(comp.message).toEqual(message);
      expect(comp.qaTag).toEqual(qaTag);
   });

   it('should be init wrong and return error', () => {
      comp.modalConfig = undefined;
      try {
         expect(fixture.detectChanges()).toThrow();
      } catch (error) {
         expect(error).toBeDefined();
      }
   });

   it('should set size', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.getModalSize()).toEqual(modalCompact);
      comp.modalConfig.modalWidth = StModalWidth.REGULAR;
      fixture.detectChanges();
      expect(comp.getModalSize()).toEqual(modalRegular);
      comp.modalConfig.modalWidth = StModalWidth.LARGE;
      fixture.detectChanges();
      expect(comp.getModalSize()).toEqual(modalLarge);
      comp.modalConfig.modalWidth = undefined;
      fixture.detectChanges();
      expect(comp.getModalSize()).toEqual(modalCompact);
   });

   it('should set class', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.getTitleClass()).toEqual('st-modal-neutral');
      comp.modalConfig.modalType = StModalType.INFO;
      fixture.detectChanges();
      expect(comp.getTitleClass()).toEqual('st-modal-info');
      comp.modalConfig.modalType = StModalType.WARNING;
      fixture.detectChanges();
      expect(comp.getTitleClass()).toEqual('st-modal-warning');
      comp.modalConfig.modalType = undefined;
      fixture.detectChanges();
      expect(comp.getTitleClass()).toEqual('st-modal-neutral');
   });

   it('should get if has contextualTitle', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.hasContextualTitle()).toBeFalsy();
      comp.modalConfig.contextualTitle = '';
      fixture.detectChanges();
      expect(comp.hasContextualTitle()).toBeFalsy();
      comp.modalConfig.contextualTitle = 'contextual';
      fixture.detectChanges();
      expect(comp.hasContextualTitle()).toBeTruthy();
   });

   it('should get contextualTitle', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.contextualTitle).toBeUndefined();
      comp.modalConfig.contextualTitle = '';
      fixture.detectChanges();
      expect(comp.contextualTitle).toEqual('');
      comp.modalConfig.contextualTitle = 'contextual';
      fixture.detectChanges();
      expect(comp.contextualTitle).toEqual('contextual');
   });

   it('should set head height', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.getHeaderHeight()).toEqual('80px');
      comp.modalConfig.contextualTitle = '';
      fixture.detectChanges();
      expect(comp.getHeaderHeight()).toEqual('80px');
      comp.modalConfig.contextualTitle = 'contextual';
      fixture.detectChanges();
      expect(comp.getHeaderHeight()).toEqual('90px');
   });

   it('should get if has icon', () => {
      comp.modalConfig.message = message;
      comp.modalConfig.modalType = StModalType.NEUTRAL;
      fixture.detectChanges();
      expect(comp.hasIcon()).toBeFalsy();
      comp.modalConfig.modalType = StModalType.INFO;
      fixture.detectChanges();
      expect(comp.hasIcon()).toBeTruthy();
      comp.modalConfig.modalType = StModalType.WARNING;
      fixture.detectChanges();
      expect(comp.hasIcon()).toBeTruthy();
   });

   it('should get icon', () => {
      comp.modalConfig.message = message;
      comp.modalConfig.modalType = StModalType.NEUTRAL;
      fixture.detectChanges();
      expect(comp.getIcon()).toEqual('');
      comp.modalConfig.modalType = StModalType.INFO;
      fixture.detectChanges();
      expect(comp.getIcon()).toEqual('icon-info1');
      comp.modalConfig.modalType = StModalType.WARNING;
      fixture.detectChanges();
      expect(comp.getIcon()).toEqual('icon-alert');
   });

   it('should get title', () => {
      let newTitle: string = 'New Title';
      comp.modalConfig.message = message;
      fixture.detectChanges();

      expect(comp.getTitle()).toEqual(title);
      comp.modalConfig.modalTitle = newTitle;
      fixture.detectChanges();
      expect(comp.getTitle()).toEqual(newTitle);
   });

   it('should get if has buttons', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();

      expect(comp.hasButtons()).toBeFalsy();
      comp.modalConfig.buttons = [];
      fixture.detectChanges();
      expect(comp.hasButtons()).toBeFalsy();

      comp.modalConfig.buttons = buttons;
      fixture.detectChanges();
      expect(comp.hasButtons()).toBeTruthy();
   });

   it('should get button subtype', () => {
      comp.modalConfig.message = message;
      let subtype1: StModalButton = { label: 'label', primary: true, response: StModalResponse.YES };
      let subtype2: StModalButton = { label: 'label', primary: false, response: StModalResponse.YES };
      fixture.detectChanges();

      expect(comp.getButtonType(undefined)).toEqual('button-secondary-gray');
      expect(comp.getButtonType(subtype1)).toEqual('button-primary');
      expect(comp.getButtonType(subtype2)).toEqual('button-secondary-gray');
   });

   it('should get buttons', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.getButtons()).toEqual([]);

      comp.modalConfig.buttons = undefined;
      fixture.detectChanges();
      expect(comp.getButtons()).toEqual([]);

      comp.modalConfig.buttons = buttons;
      fixture.detectChanges();
      expect(comp.getButtons()).toEqual(buttons.reverse());
   });

   it('should get is message modal', () => {
      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.isMessageModal()).toBeTruthy();

      comp.modalConfig.message = undefined;
      comp.modalConfig.html = html;
      fixture.detectChanges();
      expect(comp.isMessageModal()).toBeFalsy();
   });

   it('should get is html modal', () => {
      comp.modalConfig.message = message;
      comp.modalConfig.html = undefined;
      fixture.detectChanges();
      expect(comp.isComplexMessageModal()).toBeFalsy();

      comp.modalConfig.message = undefined;
      comp.modalConfig.html = '';
      fixture.detectChanges();
      expect(comp.isComplexMessageModal()).toBeFalsy();

      comp.modalConfig.html = html;
      fixture.detectChanges();
      expect(comp.isComplexMessageModal()).toBeTruthy();
   });

   it('should get html value', () => {
      comp.modalConfig.message = message;
      comp.modalConfig.html = undefined;
      fixture.detectChanges();
      expect(comp.getHTML()).toBeUndefined();

      comp.modalConfig.message = undefined;
      comp.modalConfig.html = '';
      fixture.detectChanges();
      expect(comp.getHTML()).toEqual('');

      comp.modalConfig.html = html;
      fixture.detectChanges();
      expect(comp.getHTML()).toEqual(html);
   });

   it('should get message value', () => {
      comp.modalConfig.html = html;
      comp.modalConfig.message = undefined;
      fixture.detectChanges();
      expect(comp.message).toBeUndefined();

      comp.modalConfig.message = '';
      fixture.detectChanges();
      expect(comp.message).toEqual('');

      comp.modalConfig.message = message;
      fixture.detectChanges();
      expect(comp.message).toEqual(message);
   });

   it('should get mainText size', () => {
      comp.modalConfig.message = message;
      comp.modalConfig.mainText = undefined;
      fixture.detectChanges();
      expect(comp.mainTextSize).toEqual('');

      comp.modalConfig.mainText = StModalMainTextSize.MEDIUM;
      fixture.detectChanges();
      expect(comp.mainTextSize).toEqual('sth-modal-message-medium');

      comp.modalConfig.mainText = StModalMainTextSize.BIG;
      fixture.detectChanges();
      expect(comp.mainTextSize).toEqual('sth-modal-message-big');
   });

   it('should get qaTag', () => {
      comp.modalConfig.message = message;
      comp.modalConfig.qaTag = undefined;
      try {
         fixture.detectChanges();
         expect(comp.qaTag).toThrow();
      } catch (error) {
         expect(error.message).toEqual('[ERROR]: StModal => qa tag is a required field');
      }

      comp.modalConfig.qaTag = qaTag;
      fixture.detectChanges();
      expect(comp.qaTag).toEqual(qaTag);
   });

   it('should load a component', () => {
      comp.component = ModalTestComponent;
      fixture.detectChanges();

      let div: HTMLDivElement = fixture.debugElement.query(By.css('.sth-modal-body')).nativeElement;
      expect(div.children.length).toEqual(2);
      expect(div.children[1]).toBeDefined();
      expect(div.children[1].firstChild).toBeDefined();
      expect(div.children[1].firstChild.textContent).toEqual('Hello World');
   });


   it('should bind inputs and outputs to component', () => {
      let name: string = 'Test Name';
      let outFunc = jasmine.createSpy('outFunc');
      comp.component = ModalTestComponent;
      comp.modalConfig.inputs = { name };
      comp.modalConfig.outputs = { notify: outFunc };
      fixture.detectChanges();

      let div: HTMLDivElement = fixture.debugElement.query(By.css('.sth-modal-body')).nativeElement;
      expect(div.children.length).toEqual(2);
      expect(div.children[1]).toBeDefined();
      expect(div.children[1].children.length).toEqual(3);
      expect(div.children[1].children[1]).toBeDefined();
      expect(div.children[1].children[1].textContent).toEqual(name);

      let divOut: HTMLDivElement = fixture.debugElement.query(By.css('#st-modal-test-out')).nativeElement;
      expect(divOut).toBeDefined();
      divOut.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(outFunc).toHaveBeenCalled();
      expect(outFunc).toHaveBeenCalledWith(name);

      comp.ngOnInit();
   });

   it('should emit when click in positive button', () => {
      let button: StModalButton = { label: 'label', response: StModalResponse.YES };
      let responseFunction = jasmine.createSpy('response');

      comp.modalConfig.message = message;
      comp.modalConfig.buttons = [button];
      comp.modalConfig.closeOnAccept = false;
      fixture.detectChanges();
      let htmlButton: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

      comp.click.subscribe(responseFunction);

      htmlButton.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledWith(button.response);
   });

   it('should emit when click in negative button', () => {
      let button: StModalButton = { label: 'label', response: StModalResponse.NO };
      let responseFunction = jasmine.createSpy('response');

      comp.modalConfig.message = message;
      comp.modalConfig.buttons = [button];
      comp.modalConfig.closeOnAccept = false;
      fixture.detectChanges();
      let htmlButton: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

      comp.click.subscribe(responseFunction);

      htmlButton.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledWith(button.response);
   });

   it('should emit when click in close button', () => {
      let responseFunction = jasmine.createSpy('response');
      comp.modalConfig.message = message;

      fixture.detectChanges();
      let htmlButton: HTMLDivElement = fixture.debugElement.query(By.css('#st-modal-close-button')).nativeElement;

      comp.close.subscribe(responseFunction);

      htmlButton.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(responseFunction).toHaveBeenCalled();
   });
});
