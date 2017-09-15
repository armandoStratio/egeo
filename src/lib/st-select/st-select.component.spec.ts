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
import { Component, DebugElement, SimpleChanges, SimpleChange } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { StLabelModule } from '../st-label/st-label.module';
import { StDropdownMenuModule } from '../st-dropdown-menu/st-dropdown-menu.module';
import { StSelectComponent } from './st-select.component';

import { StDropDownMenuItem } from '../st-dropdown-menu/st-dropdown-menu.interface';

let comboInput: HTMLInputElement;
let options: StDropDownMenuItem[] = [
   { label: 'label1', value: 'value1' },
   { label: 'label2', value: 'value2' },
   { label: 'label3', value: 'value3' },
   { label: 'label4', value: 'value4' },
   { label: 'label5', value: 'value5' },
   { label: 'label6', value: 'value6' },
   { label: 'label7', value: 'value7' },
   { label: 'label8', value: 'value8' },
   { label: 'label9', value: 'value9' },
   { label: 'label10', value: 'value10' }
];

describe('StSelect', () => {

   let component: StSelectComponent;
   let fixture: ComponentFixture<StSelectComponent>;
   let compiled: any;
   let de: DebugElement;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, ReactiveFormsModule, StLabelModule, StDropdownMenuModule],
         declarations: [StSelectComponent]
      })
         .compileComponents();  // compile template and css
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StSelectComponent);
      comboInput = fixture.debugElement.query(By.css('input')).nativeElement;
      component = fixture.componentInstance;
      compiled = fixture.debugElement.nativeElement;

   });

   it('st-select should have a placeholder', () => {
      let placeholder: string = 'Select option';
      component.placeholder = placeholder;
      fixture.detectChanges();
      expect(comboInput.placeholder).toEqual(placeholder);
   });

   it('st-select should be init with options', () => {
      component.options = options;
      fixture.detectChanges();
      expect(component.hasOptions()).toBeTruthy();
   });

   it('st-select should be init by default with empty options', () => {
      fixture.detectChanges();
      expect(component.hasOptions()).toBeFalsy();
      expect(component.options).toEqual([]);
   });

   it('st-select should change disabled status', () => {
      fixture.detectChanges();
      expect(component.disabled).toBeFalsy();

      component.setDisabledState(true);
      fixture.detectChanges();
      expect(component.disabled).toBeTruthy();

      component.setDisabledState(false);
      fixture.detectChanges();
      expect(component.disabled).toBeFalsy();
   });

   it('st-select should change value when come from outside', () => {
      fixture.detectChanges();
      expect(component.selectedValue).toBeUndefined();

      component.writeValue(options[2]);
      fixture.detectChanges();
      expect(component.selectedValue).toBeDefined();
      expect(component.selectedValue).toEqual(options[2]);
   });

   it('st-select should register onChange function', () => {
      fixture.detectChanges();
      expect(component.onChange).toBeUndefined();

      let fakeFunction: (_: any) => void = jasmine.createSpy('fake');

      component.registerOnChange(fakeFunction);
      component.onChange(options[1]);
      fixture.detectChanges();
      expect(fakeFunction).toHaveBeenCalled();
      expect(fakeFunction).toHaveBeenCalledWith(options[1]);
   });

   it('st-select should register onTouched function', () => {
      fixture.detectChanges();
      expect(component.onTouched).toBeUndefined();

      let fakeFunction: () => void = jasmine.createSpy('fake');

      component.registerOnTouched(fakeFunction);
      component.onTouched();
      fixture.detectChanges();
      expect(fakeFunction).toHaveBeenCalled();
   });

   it('st-select should write value when update forceValidations input', () => {
      spyOn(component, 'writeValue').and.callThrough();
      fixture.detectChanges();
      expect(component.writeValue).not.toHaveBeenCalled();

      let changeOther: SimpleChanges = { 'options': new SimpleChange([], [], true) };
      component.ngOnChanges(changeOther);
      fixture.detectChanges();
      expect(component.writeValue).not.toHaveBeenCalled();

      let change: SimpleChanges = { 'forceValidations': new SimpleChange(false, true, true) };
      component.ngOnChanges(change);
      fixture.detectChanges();
      expect(component.writeValue).toHaveBeenCalled();
   });

   it('st-select should change option and notify', () => {
      component.options = options;
      fixture.detectChanges();

      let fakeOnChange: (_: any) => void = jasmine.createSpy('fakeOnChange');
      let fakeOnTouched: () => void = jasmine.createSpy('fakeOnTouched');

      component.registerOnChange(fakeOnChange);
      component.registerOnTouched(fakeOnTouched);
      fixture.detectChanges();

      expect(component.selectedValue).toBeUndefined();
      expect(component.onChange).not.toHaveBeenCalled();
      expect(component.onTouched).not.toHaveBeenCalled();

      component.changeOption(options[2]);
      fixture.detectChanges();

      expect(component.selectedValue).toBeDefined();
      expect(component.selectedValue).toEqual(options[2]);
      expect(component.onChange).toHaveBeenCalled();
      expect(component.onChange).toHaveBeenCalledWith(options[2]);
      expect(component.onTouched).toHaveBeenCalled();
   });

   it('st-select should not open menu when is disabled', () => {
      spyOn(component, 'onClickButton').and.callThrough();
      component.options = options;
      fixture.detectChanges();

      component.setDisabledState(true);
      fixture.detectChanges();
      comboInput.click();
      fixture.detectChanges();
      expect(component.onClickButton).toHaveBeenCalled();
      expect(component.onClickButton).toHaveBeenCalledTimes(1);
      expect(component.isActive).toBeFalsy();
   });

   it('st-select should open menu', () => {
      spyOn(component, 'onClickButton').and.callThrough();
      component.options = options;
      fixture.detectChanges();

      fixture.detectChanges();
      comboInput.click();
      fixture.detectChanges();
      expect(component.onClickButton).toHaveBeenCalled();
      expect(component.onClickButton).toHaveBeenCalledTimes(1);
      expect(component.isActive).toBeTruthy();
   });

   it('st-select should return error only in certain cases', () => {
      component.options = options;

      fixture.detectChanges();
      expect(component.showError()).toBeFalsy();

      component.errorMessage = '';
      fixture.detectChanges();
      expect(component.showError()).toBeFalsy();

      component.errorMessage = 'error';
      fixture.detectChanges();
      expect(component.showError()).toBeFalsy();

      component.forceValidations = true;
      fixture.detectChanges();
      expect(component.showError()).toBeTruthy();

      component.onFocus(new Event('focus'));
      fixture.detectChanges();
      expect(component.showError()).toBeFalsy();

      component.setDisabledState(true);
      fixture.detectChanges();
      expect(component.showError()).toBeFalsy();
   });

   it('st-select should change classes when error', () => {
      fixture.detectChanges();
      expect(component.getBarType()).toEqual('st-input-normal-bar sth-input-normal-bar');

      component.errorMessage = 'error';
      component.forceValidations = true;
      fixture.detectChanges();
      expect(component.getBarType()).toEqual('st-input-error-bar sth-input-error-bar');
   });

   it('st-select should focus input', () => {
      component.errorMessage = 'error';
      component.forceValidations = true;
      fixture.detectChanges();
      expect(component.showError()).toBeTruthy();

      component.onFocus(new Event('focus'));
      fixture.detectChanges();
      expect(component.showError()).toBeFalsy();

      component.onFocusOut(new Event('focusout'));
      fixture.detectChanges();
      expect(component.showError()).toBeTruthy();
   });

   it('st-select should validate with default message', () => {
      let control: FormControl = new FormControl(undefined, [Validators.required]);
      component.selectedValue = options[2];
      component.forceValidations = true;
      control.setValue(options[2]);

      fixture.detectChanges();

      component.validate(control);
      expect(component.showError()).toBeFalsy();

      // Third if in checkValidations
      control.setValue(undefined);
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();

      // Second if in checkValidations
      control.setValue({ value: 'value' });
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();

      control.setValue({ label: 'test' });
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();

      control.setValue('test');
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();

      // First if in checkValidations
      control.setValue({});
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();
   });

   it('st-select should validate with custom message', () => {
      let control: FormControl = new FormControl();
      component.selectedValue = options[2];
      component.forceValidations = true;
      component.errorRequiredMessage = 'This field is required';
      control.setValue(options[2]);

      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeFalsy();

      control.setValue(options[2]);
      control.setErrors({ 'required': true });
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();

      control.setValue(undefined);
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();

      control.setValue(options[2]);
      control.setErrors({ 'custom': true });
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();

      control.setValue(undefined);
      control.setErrors({ 'required': true });
      fixture.detectChanges();
      component.validate(control);
      expect(component.showError()).toBeTruthy();
   });

});





