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
   Component,
   EventEmitter,
   Input,
   OnInit,
   Output,
   AfterViewInit,
   ChangeDetectorRef,
   ElementRef,
   ViewChild,
   HostListener
} from '@angular/core';

import { StDropDownMenuGroup, StDropDownMenuItem } from './st-dropdown-menu.interface';

/**
 * @description {Component} Dropdown-Menu
 * This directive show a autocomplete list in element that you attach
 *
 * @example
 *
 * <st-dropdown-menu [items]="list" [active]="show" (change)="onChange(event)">
 *    <button (click)="show = !show">Show menu</button>
 * </st-dropdown-menu>
 */
@Component({
   selector: 'st-dropdown-menu',
   templateUrl: './st-dropdown-menu.component.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StDropdownMenuComponent implements OnInit, AfterViewInit {

   /** @input {string} qaTag For set id for tests */
   @Input() qaTag: string;
   /** @input {boolean} active=false Show or hide list */
   @Input() active: boolean = false;
   /** @input {StDropDownMenuItem[] | StDropDownMenuGroup[]} items List of items or groups of them to show in menu */
   @Input() items: StDropDownMenuItem[] | StDropDownMenuGroup[];
   /* tslint:disable-next-line:max-line-length */
   /** @input { 'top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'} [placement='bottom-start'] Posible possitions of menu with respect element to attach */
   @Input() placement: string = 'bottom-start';
   /** @input {string} [emptyListMessage=''] Message to show in case of empty list */
   @Input() emptyListMessage: string = '';

   /** @output {StDropDownMenuItem} change Event emitted when user select an item */
   @Output() change: EventEmitter<StDropDownMenuItem> = new EventEmitter<StDropDownMenuItem>();

   @ViewChild('buttonId') buttonElement: ElementRef;

   public itemsGroup: StDropDownMenuGroup[] = [];
   public widthMenu: string;

   constructor(private cd: ChangeDetectorRef) { }

   ngOnInit(): void {
      if (undefined === this.items) {
         throw new Error('Attribute items is required');
      }
      this.checkGroup();
   }

   ngOnChanges(values: any): void {
      if (values.items) {
         this.checkGroup();
      }
   }

   ngAfterViewInit(): void {
      setTimeout(() => {
         this.updateWidth();
      }, 0);
   }

   checkGroup(): void {
      if (this.isDropDownGroup(this.items)) {
         this.itemsGroup = this.items;
      }
   }

   isDropDownGroup(value: StDropDownMenuItem[] | StDropDownMenuGroup[]): value is StDropDownMenuGroup[] {
      return value && value.length > 0 && (<StDropDownMenuGroup>value[0]).title !== undefined;
   }

   onChange(value: StDropDownMenuItem): void {
      this.change.emit(value);
   }

   @HostListener('window:resize', ['$event']) onResize(event: Event): void {
      this.updateWidth();
   }

   private updateWidth(): void {
      if (this.buttonElement && this.buttonElement.nativeElement) {
         let el: HTMLElement = this.buttonElement.nativeElement;

         if (el.children && el.children.length > 0) {
            this.widthMenu = el.children[0].getBoundingClientRect().width + 'px';
         } else {
            this.widthMenu = el.getBoundingClientRect().width + 'px';
         }
      }
      this.cd.markForCheck();
   }
}

