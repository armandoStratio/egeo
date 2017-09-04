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
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input,
   OnChanges, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { StTextareaError } from './st-textarea.error.model';

@Component({
   selector: 'st-textarea',
   templateUrl: './st-textarea.component.html',
   styleUrls: ['./st-textarea.component.scss'],
   providers: [
      { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StTextareaComponent), multi: true },
      { provide: NG_VALIDATORS, useExisting: forwardRef(() => StTextareaComponent), multi: true }
   ],
   changeDetection: ChangeDetectionStrategy.OnPush
})

export class StTextareaComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

   @Input() placeholder: string = '';
   @Input() name: string = '';
   @Input() label: string = '';
   @Input() errors: StTextareaError;
   @Input() qaTag: string;
   @Input() forceValidations: boolean = false;
   @Input() contextualHelp: string;
   @Input() maxLength: number;
   @Input() isFocused: boolean = false;
   @Input() cols: number;
   @Input() rows: number;
   @Input() wrap: string = 'soft';

   @ViewChildren('textarea') vc: any;

   public isDisabled: boolean = false; // To check disable
   public focus: boolean = false;
   public internalControl: FormControl;
   public errorMessage: string = undefined;

   private sub: Subscription;
   private valueChangeSub: Subscription;
   private internalTextareaModel: any = '';

   constructor(private _cd: ChangeDetectorRef) { }

   onChange = (_: any) => { };
   onTouched = () => { };

   validate(control: FormControl): any {
      if (this.sub) {
         this.sub.unsubscribe();
      }
      this.sub = control.statusChanges.subscribe(() => this.checkErrors(control));
   }

   ngOnChanges(change: any): void {
      if (this.forceValidations) {
         this.writeValue(this.internalControl.value);
      }
      this._cd.markForCheck();
   }

   ngOnInit(): void {
      this.internalControl = new FormControl(this.internalTextareaModel);
      this.valueChangeSub = this.internalControl.valueChanges.subscribe((value) => this.onChange(value));
   }

   ngAfterViewInit(): void {
      if (this.isFocused) {
         this.focus = true;
         this.vc.first.nativeElement.focus();
      }
   }

   ngOnDestroy(): void {
      if (this.valueChangeSub) {
         this.valueChangeSub.unsubscribe();
      }
      if (this.sub) {
         this.sub.unsubscribe();
      }
   }

   // When value is received from outside
   writeValue(value: any): void {
      this.internalControl.setValue(value);
      this.internalTextareaModel = value;
   }

   // Registry the change function to propagate internal model changes
   registerOnChange(fn: (_: any) => void): void {
      this.onChange = fn;
   }

   // Registry the touch function to propagate internal touch events TODO: make this function.
   registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
   }

   setDisabledState(disable: boolean): void {
      this.isDisabled = disable;
      if (this.isDisabled && this.internalControl && this.internalControl.enabled) {
         this.internalControl.disable();
      } else if (!this.isDisabled && this.internalControl && this.internalControl.disabled) {
         this.internalControl.enable();
      }
      this._cd.markForCheck();
   }

   showError(): boolean {
      return this.errorMessage !== undefined && (!this.internalControl.pristine || this.forceValidations) && !this.focus && !this.isDisabled;
   }

   /** Style functions */
   onFocus(event: Event): void {
      this.focus = true;
   }

   onFocusOut(event: Event): void {
      this.focus = false;
   }

   // When status change call this function to check if have errors
   private checkErrors(control: FormControl): void {
      let errors: { [key: string]: any } = control.errors;
      this.errorMessage = this.getErrorMessage(errors);
      this._cd.markForCheck();
   }

   // Get error message in function of error list.
   private getErrorMessage(errors: { [key: string]: any }): string {
      if (!errors) {
         return undefined;
      }

      if (!this.errors) {
         return '';
      }

      if (errors.hasOwnProperty('required')) {
         return this.errors.required || this.errors.generic || '';
      }
      return '';
   }

}
