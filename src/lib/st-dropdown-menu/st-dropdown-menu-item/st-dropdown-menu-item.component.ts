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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StDropDownMenuItem } from '../st-dropdown-menu.interface';

@Component({
   selector: 'st-dropdown-menu-item',
   templateUrl: './st-dropdown-menu-item.component.html'
})
export class StDropdownMenuItemComponent implements OnInit {

   @Input() item: StDropDownMenuItem;
   @Input() qaTag: string;
   @Output() change: EventEmitter<StDropDownMenuItem> = new EventEmitter<StDropDownMenuItem>();

   constructor() {
   }

   ngOnInit(): void {
      if (undefined === this.item) {
         throw new Error('Attribute item is required');
      }
   }

   onChangeItem(): void {
      this.change.emit(this.item);
   }
}
