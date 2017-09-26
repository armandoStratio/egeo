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
   AfterViewInit,
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   ElementRef,
   EventEmitter,
   Input,
   OnChanges,
   OnDestroy,
   OnInit,
   Output,
   Renderer,
   ViewChild,
   HostListener,
   SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { EventWindowManager } from '../utils/event-window-manager';

import {
   StDropDownMenuGroup,
   StDropDownMenuItem
} from '../st-dropdown-menu/st-dropdown-menu.interface';

import { StEgeo, StRequired } from '../decorators/require-decorators';

@StEgeo()
@Component({
   selector: 'st-dropdown',
   templateUrl: './st-dropdown.component.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StDropdownComponent extends EventWindowManager implements OnDestroy, OnInit, OnChanges {
   @Input() button: string;
   @Input() active: boolean;
   @StRequired()
   @Input() items: Array<StDropDownMenuItem | StDropDownMenuGroup>;
   @Input() default: boolean;
   @Input() firstSelected: boolean;
   @Input() disabled: boolean = false;
   @Input() width: string;
   @Input() qaTag: string;
   @Input() themeClass: string;
   @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() change: EventEmitter<Object> = new EventEmitter<Object>();

   widthMenu: string;
   dropdownButtonControl: FormControl = new FormControl();

   constructor(
      private renderer: Renderer,
      private cd: ChangeDetectorRef,
      @ViewChild('input') buttonElement: ElementRef
   ) {
      super(renderer, cd, buttonElement);
   }

   ngOnInit(): void {
      this.checkFirstSelected();
      this.findSelected();
      this.dropdownButtonControl.setValue(this.button ? this.button : '');
      this.setDisabledState(this.disabled);
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes.items) {
         this.checkFirstSelected();
         this.findSelected();
      }
      if (changes.disabled) {
         this.setDisabledState(changes.disabled.currentValue);
      }
   }

   ngOnDestroy(): void {
      this.closeElement();
   }

   changeOption(item: StDropDownMenuItem): void {
      this.active = !this.active;
      this.updateSelected(item);

      if (!this.default) {
         this.dropdownButtonControl.setValue(item.label);
      }
      this.change.emit(item);
      this.closeElement();
   }

   onClickEvent(event: MouseEvent): void {
      this.openElement();
      this.click.emit(true);
   }

   @HostListener('document:keydown', ['$event'])
   public hideMenu(event?: KeyboardEvent): void {
      if (
         event &&
         ((event.keyCode && event.keyCode !== 27) ||
            (event.key && event.key !== 'Escape'))
      ) {
         return;
      }
      this.closeElement();
   }

   private setDisabledState(disabled: boolean | string): void {
      if ((typeof disabled === 'boolean' && disabled) || (typeof disabled === 'string' && disabled !== 'true')) {
         this.dropdownButtonControl.disable();
      } else {
         this.dropdownButtonControl.enable();
      }
   }

   private findSelected(): void {
      if (this.isStDropdownItem(this.items)) {
         let item = this.items.find(object => object.selected === true);

         if (item) {
            this.dropdownButtonControl.setValue(item.label);
            this.cd.markForCheck();
         }
      } else if (this.items && this.items.length > 0) {
         let items = this.items
            .map((i: StDropDownMenuGroup) => {
               return i.items.find(object => object.selected === true);
            })
            .filter(object => object !== undefined);

         if (items.length > 0) {
            this.dropdownButtonControl.setValue(items[0].label);
            this.cd.markForCheck();
         }
      }
   }

   private isStDropdownItem(
      items: Array<StDropDownMenuItem | StDropDownMenuGroup>
   ): items is StDropDownMenuItem[] {
      if (items && items.length > 0) {
         return (<StDropDownMenuGroup[]>items)[0].items === undefined;
      }
   }

   private updateSelected(item?: StDropDownMenuItem): void {
      if (this.isStDropdownItem(this.items)) {
         const itemSelected = Object.assign(
            [],
            this.items.find(object => object.selected === true)
         );

         if (itemSelected) {
            itemSelected.selected = false;
         }

         if (item) {
            const element = Object.assign([], this.items.find(i => i === item));

            if (element) element.selected = true;
         }
      } else if (this.items && this.items.length > 0) {
         this.items.map((i: StDropDownMenuGroup) => {
            let itemSelected = Object.assign(
               [],
               i.items.find(object => object.selected === true)
            );

            if (itemSelected) {
               itemSelected.selected = false;
            }

            if (item) {
               const element = Object.assign([], i.items.find(n => n === item));

               if (element) element.selected = true;
            }
         });
      }
   }

   private checkFirstSelected(): void {
      if (this.firstSelected) {
         if (this.isStDropdownItem(this.items)) {
            this.updateSelected();
            this.items[0].selected = true;
         } else if (this.items && this.items.length > 0) {
            this.updateSelected();
            this.items.map((i: StDropDownMenuGroup) => {
               i.items[0].selected = true;
            });
         }
      }
   }
}
