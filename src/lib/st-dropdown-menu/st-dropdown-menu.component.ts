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
   HostListener,
   Input,
   Output,
   OnChanges,
   SimpleChanges,
   ViewChild
} from '@angular/core';

import { StPopPlacement, StPopOffset } from '../st-pop/st-pop.model';
import { StDropDownMenuGroup, StDropDownMenuItem } from './st-dropdown-menu.interface';

/**
 * @description {Component} [Dropdown Menu]
 * This directive show a dropdown menu list in element that you attach
 *
 * @example
 *
 * {html}
 *
 * ```
 * <st-dropdown-menu [items]="list" [active]="show" (change)="onChange(event)">
 *    <button class="button button-primary" (click)="show = !show">Show menu</button>
 * </st-dropdown-menu>
 * ```
 */
@Component({
   selector: 'st-dropdown-menu',
   templateUrl: './st-dropdown-menu.component.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StDropdownMenuComponent implements AfterViewInit, OnChanges {

   /** @Input {boolean} [active=false] Show or hide list */
   @Input() active: boolean = false;
   /** @Input {StDropDownMenuItem[] | StDropDownMenuGroup[]} [items=\[\]] List of items or groups of them to show in menu */
   @Input() items: StDropDownMenuItem[] | StDropDownMenuGroup[] = [];
   /* tslint:disable-next-line:max-line-length */
   /** @Input {StPopPlacement} [placement=StPopPlacement.BOTOM_START] Posible possitions of menu with respect element to attach */
   @Input() placement: StPopPlacement = StPopPlacement.BOTTOM_START;
   /** @Input {string} [emptyListMessage=''] Message to show in case of empty list */
   @Input() emptyListMessage: string = '';
   /** @Input {StDropDownMenuItem | undefined} [selectedItem=undefined] Define selected item without passing as property */
   @Input() selectedItem: StDropDownMenuItem = undefined;
   /** @Input {StDropDownMenuItem | undefined} [selectedItem=undefined] Define selected item without passing as property */
   @Input() itemsBeforeScroll: number = 8;
   /** @Input {boolean} [moveSelected=true] If true, apply class selected to selected item */
   @Input() moveSelected: boolean = true;
   /** @Input {boolean} [styleSelected=true] If true, move selected item to top in menu when open */
   @Input() styleSelected: boolean = true;
   /** @Input {StPopOffset} [offset={x: 0 , y: 0}] For position with offset in x o y axis */
   @Input() offset: StPopOffset = { y: 0 };

   /** @output {StDropDownMenuItem} [change] Event emitted when user select an item */
   @Output() change: EventEmitter<StDropDownMenuItem> = new EventEmitter<StDropDownMenuItem>();

   @ViewChild('buttonId') buttonElement: ElementRef;
   @ViewChild('itemList') itemListElement: ElementRef;

   widthMenu: string;

   private _itemHeight: number = 42;

   constructor(private el: ElementRef, private cd: ChangeDetectorRef) { }

   get componentId(): string | null {
      const id = (this.el.nativeElement as HTMLElement).getAttribute('id');
      return id !== undefined && id !== null ? id : null;
   }

   get menuId(): string | null {
      return this.componentId !== null ? `${this.componentId}-menu` : null;
   }

   get isItemGroup(): boolean {
      return this.isDropDownGroup(this.items);
   }

   get menuMaxHeight(): string {
      return `${this._itemHeight * this.itemsBeforeScroll}px`;
   }

   getItemId(value: any | undefined): string | null {
      return this.componentId !== null ? `${this.componentId}-option-${this.getItemValueMerged(value)}` : null;
   }

   isDropDownGroup(value: StDropDownMenuItem[] | StDropDownMenuGroup[]): value is StDropDownMenuGroup[] {
      return value && value.length > 0 && (<StDropDownMenuGroup>value[0]).title !== undefined;
   }

   ngAfterViewInit(): void {
      this.updateWidth();
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes.active && changes.active.currentValue && this.selectedItem && this.moveSelected) {
         // Only can do this functionality with timeout because we need to wait for angular to load new DOM
         // with items before move scroll
         setTimeout(() => {
            const parent: HTMLElement = this.itemListElement.nativeElement;
            const listOfElements: NodeListOf<Element> = parent.getElementsByClassName('selected');
            if (listOfElements && listOfElements.length > 0) {
               const target: HTMLElement = (listOfElements.item(0) as HTMLElement);
               parent.scrollTop = target.offsetTop - parent.offsetTop;
            }
         }, 0);
      }
   }

   onChange(value: StDropDownMenuItem): void {
      this.change.emit(value);
   }

   @HostListener('window:resize')
   @HostListener('window:load')
   updateWidth(): void {
      if (this.buttonElement && this.buttonElement.nativeElement) {
         const button: HTMLElement = this.buttonElement.nativeElement;

         if (button.children && button.children.length > 0) {
            this.widthMenu = button.children[0].getBoundingClientRect().width + 'px';
         } else {
            this.widthMenu = button.getBoundingClientRect().width + 'px';
         }
      }
      this.cd.markForCheck();
   }

   private getItemValueMerged(value: any): string {
      return value ? value.toString().replace(/\s+/g, '_') : '';
   }
}
