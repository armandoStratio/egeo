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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {StPopModule} from '../st-pop/st-pop.module';
import { StDropdownMenuItemComponent } from './st-dropdown-menu-item/st-dropdown-menu-item.component';
import { StDropdownMenuComponent } from './st-dropdown-menu.component';
import { StDropDownMenuItem } from './st-dropdown-menu.interface';

let items: StDropDownMenuItem[] = [
   {
      label: 'example 1',
      value: 1
   },
   {
      label: 'example 2',
      value: 2
   }
];

describe('StDropdownMenuComponent', () => {

   let component: StDropdownMenuComponent;
   let fixture: ComponentFixture<StDropdownMenuComponent>;
   let de: DebugElement;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [StPopModule],
         declarations: [StDropdownMenuComponent, StDropdownMenuItemComponent]
      })
      .compileComponents();  // compile template and css
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StDropdownMenuComponent);
      component = fixture.componentInstance;
   });

   it('should show two items in component', () => {
      component.items = items;
      fixture.detectChanges();
      expect(component.items.length).toBe(items.length);
   });

   it('should show the menu inactive', () => {
      component.items = items;
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.st-dropdown-menu')).toBeNull();
   });

   it('should show the menu active', async(() => {
      component.items = items;
      component.active = true;
      fixture.whenStable().then(() => {
         expect(fixture.debugElement.nativeElement.querySelector('.st-dropdown-menu')).toBeDefined();
      });
   }));


});
