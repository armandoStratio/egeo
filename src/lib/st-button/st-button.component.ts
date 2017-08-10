/*
 * Copyright (C) 2016 Stratio (http://stratio.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
   selector: 'st-button',
   templateUrl: './st-button.component.html'
})

export class StButtonComponent implements OnInit {
   @Input() inputType: string = 'button'; // button / submit / reset
   @Input() isDisabled: boolean = false;
   @Input() leftIcon: string;
   @Input() qaTag: string;
   @Input() rightIcon: string;
   @Input() subtypeClass: string = 'default';
   @Input() text: string = 'Click Me';
   @Input() themeClass: string;
   @Input() typeClass: string = 'btnMain';

   @Output() onClick: EventEmitter<any> = new EventEmitter();

   public internalText: string = '';

   ngOnInit(): void {
      if (this.typeClass !== 'btnTool') {
         this.internalText = this.text;
      }
   }

   public getButtonTypeClass(): string {

      if (this.typeClass === 'btnMain') {
         switch (this.subtypeClass) {
            case 'subtype1': return `button-sq1`;
            case 'subtype2': return `button-sq2`;
            case 'subtype3': return `button-sq3`;
            case 'subtype4': return `button-sq4`;
            default: return `button-sq1`;
         }
      } else if (this.typeClass === 'btnLink') {
         if (this.themeClass === 'themeB') {
            switch (this.subtypeClass) {
               case 'subtype1': return `button-lk3`;
               case 'subtype2': return `button-lk4`;
               default: return `button-lk3`;
            }
         } else {
            switch (this.subtypeClass) {
               case 'subtype1': return `button-lk1`;
               case 'subtype2': return `button-lk2`;
               default: return `button-lk1`;
            }
         }
      } else if (this.typeClass === 'btnTool') {
         if (this.themeClass === 'themeB') {
            switch (this.subtypeClass) {
               case 'subtype1': return `button-rd4`;
               case 'subtype2': return `button-rd5`;
               case 'subtype3': return `button-rd6`;
               default: return `button-rd4`;
            }
         } else {
            switch (this.subtypeClass) {
               case 'subtype1': return `button-rd1`;
               case 'subtype2': return `button-rd2`;
               case 'subtype3': return `button-rd3`;
               case 'subtype4': return `button-rd7`;
               default: return `button-rd1`;
            }

         }
      }

      return 'button-sq1';
   }


   public onClickEvent(event: any): void {
      this.onClick.emit(event);
   }
}
