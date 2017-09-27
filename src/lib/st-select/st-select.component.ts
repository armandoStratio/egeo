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
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   ElementRef,
   forwardRef,
   Input,
   OnChanges,
   Renderer,
   SimpleChanges,
   ViewChild,
   OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { EventWindowManager } from '../utils/event-window-manager';
import { StDropDownMenuItem } from '../st-dropdown-menu/st-dropdown-menu.interface';

@Component({
   selector: 'st-select',
   templateUrl: './st-select.component.html',
   providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StSelectComponent), multi: true },
      { provide: NG_VALIDATORS, useExisting: forwardRef(() => StSelectComponent), multi: true }
   ],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StSelectComponent extends EventWindowManager implements ControlValueAccessor, OnDestroy, OnChanges {
   @Input() label: string = '';
   @Input() qaTag: string;
   @Input() tooltip: string;
   @Input() name: string = '';
   @Input() placeholder: string = '';
   @Input() errorRequiredMessage: string = '';
   @Input() options: StDropDownMenuItem[] = [];
   @Input() disabled: boolean | string = false;
   @Input() selectedValue: StDropDownMenuItem;
   @Input() forceValidations: boolean = false;

   public errorMessage: string = undefined;
   public onChange: (_: any) => void;
   public onTouched: () => void;
   public isFocused: boolean = false;

   dropdownButtonControl: FormControl = new FormControl();

   private sub: Subscription;
   private pristine: boolean = true;


   constructor(
      private renderer: Renderer,
      private cd: ChangeDetectorRef,
      @ViewChild('buttonId') public buttonElement: ElementRef,
      @ViewChild('input') public inputElement: ElementRef
   ) {
      super(renderer, cd, buttonElement);
   }

   ngOnInit(): void {
      console.log( this.disabled );
      this.setDisabledState(this.disabled);
   }

   validate(control: FormControl): any {
      if (this.sub) {
         this.sub.unsubscribe();
      }
      this.sub = control.statusChanges.subscribe(() => this.checkErrors(control));
      this.checkErrors(control);
   }

   hasOptions(): boolean {
      return this.options !== undefined && this.options.length > 0;
   }

   // Write a new value to the element.
   writeValue(newValue: any): void {
      this.selectedValue = this.options.find(option => option.value === newValue);
   }

   // Set the function to be called when the control receives a change event.
   registerOnChange(fn: (_: any) => void): void {
      this.onChange = fn;
   }

   // Set the function to be called when the control receives a touch event.
   registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
   }

   // This function is called when the control status changes to or from "DISABLED".
   // Depending on the value, it will enable or disable the appropriate DOM element.
   // setDisabledState(disabled: boolean): void {
   //    this.disabled = disabled;
   // }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.forceValidations && changes.forceValidations.currentValue) {
         this.writeValue(this.selectedValue);
      }
      this.cd.markForCheck();
   }

   ngOnDestroy(): void {
      this.closeElement();
   }

   changeOption(selection: StDropDownMenuItem): void {
      this.selectedValue = selection;
      this.onChange(selection.value);
      this.onTouched();
      this.pristine = false;
      this.closeElement();
   }

   // onClickButton(event: Event): void {
   //    if (!this.disabled) {
   //       (this.inputElement.nativeElement as HTMLInputElement).focus();
   //       this.openElement();
   //    }
   // }

   showError(): boolean {
      return this.errorMessage !== undefined && (!this.pristine || this.forceValidations) && !this.isFocused && !this.disabled;
   }

   onFocus(event: Event): void {
      this.isFocused = true;
   }

   onFocusOut(event: Event): void {
      this.isFocused = false;
   }

   setDisabledState(disabled: boolean | string): void {
      console.log( '>>>>>>>> disabled in select', this.disabled );
      if (
         (typeof disabled === 'boolean' && disabled) ||
         (typeof disabled === 'string' && disabled !== 'true')
      ) {
         this.dropdownButtonControl.disable();
      } else {
         this.dropdownButtonControl.enable();
      }
   }

   // When status change call this function to check if have errors
   private checkErrors(control: FormControl): void {
      this.pristine = control.pristine;
      this.errorMessage = this.getErrorMessage(control.errors);
      this.cd.markForCheck();
   }


   // Get error message in function of error list.
   private getErrorMessage(errors: { [key: string]: any }): string {
      if (!errors) {
         return undefined;
      }

      if (!this.errorRequiredMessage) {
         return '';
      }

      if (errors.hasOwnProperty('required')) {
         return this.errorRequiredMessage;
      }

      return '';
   }
}
