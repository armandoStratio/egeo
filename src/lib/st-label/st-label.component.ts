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
import { Component, ElementRef, Input } from '@angular/core';

@Component({
   host: {class: 'st-label'},
   selector: '[st-label]',
   styleUrls: ['./st-label.component.scss'],
   templateUrl: './st-label.component.html'
})

export class StLabelComponent {
   @Input() tooltip: string;

   private host: any;

   constructor(private el: ElementRef) {
      this.host = this.el.nativeElement;
      this.tooltip = '';
   }

   getId(sufix?: string): string {
      if (this.host.id) {
         return this.host.id + sufix;
      }
      return '';
   }
}
