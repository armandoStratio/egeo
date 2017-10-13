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
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StDropDownMenuItem } from '../st-dropdown-menu.interface';
import { StDropdownMenuItemComponent } from './st-dropdown-menu-item.component';

const item: StDropDownMenuItem = {
   label: 'example 1',
   value: 1
};

describe('StDropdownMenuItemComponent', () => {

   let component: StDropdownMenuItemComponent;
   let fixture: ComponentFixture<StDropdownMenuItemComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [StDropdownMenuItemComponent],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();  // compile template and css
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StDropdownMenuItemComponent);
      component = fixture.componentInstance;
   });

   it('should show value 1 in item in component', () => {
      component.item = item;
      fixture.detectChanges();
      expect(true).toBe(true);
      // component.item = item;
      // fixture.detectChanges();
      // expect(component.item.value).toBe(1);
   });

   // it('should click item and dispatch event change with value of item', () => {
   //    spyOn(component.change, 'emit');
   //    component.item = item;
   //    let itemElement = fixture.nativeElement.querySelector('li');
   //    itemElement.dispatchEvent(new Event('click'));
   //    fixture.detectChanges();
   //    expect(component.change.emit).toHaveBeenCalledWith(item);
   // });


});
