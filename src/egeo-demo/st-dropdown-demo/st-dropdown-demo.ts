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
import { Component } from '@angular/core';
import { StDropDownMenuItem, StDropDownMenuGroup } from '@stratio/egeo';

@Component({
   selector: 'st-dropdown-demo',
   templateUrl: 'st-dropdown-demo.html',
   styles: [`
      .background-grey {
         background-color: #f5f5f5;
         padding-top: 10px;
         padding-bottom: 10px;
      }
   `]
})
export class StDropdownDemoComponent {

   public disabled: boolean = false;

   public items: Array<StDropDownMenuItem> = [
      { label: 'Item 1', value: 1, selected: true },
      { label: 'Item 2', value: 2 },
      { label: 'Item 3', value: 3 },
      { label: 'Item 4', value: 4 }
   ];

   public items10: Array<StDropDownMenuItem> = [
      { label: 'Item 1', value: 1 },
      { label: 'Item 2', value: 2 },
      { label: 'Item 3', value: 3 },
      { label: 'Item 4', value: 4 },
      { label: 'Item 5', value: 5 },
      { label: 'Item 6', value: 6 },
      { label: 'Item 7', value: 7 },
      { label: 'Item 8', value: 8 }
   ];

   public itemsWithIcon: Array<StDropDownMenuItem> = [
      { label: 'Edit', icon: 'icon-edit2', value: 'edit' },
      { label: 'Duplicate', icon: 'icon-copy', value: 'duplicate' },
      { label: 'Add', icon: 'icon-copy', value: 'add' },
      { label: 'Delete', icon: 'icon-copy', value: 'delete' }
   ];

   public itemsWithGroup: Array<StDropDownMenuGroup> = [
      { title: 'Group1', items: this.items },
      { title: 'Group2', items: this.items10 }
   ];

   public toogleDisable(): void {
      this.disabled = !this.disabled;
   }
}
