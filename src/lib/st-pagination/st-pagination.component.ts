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
   ChangeDetectorRef,
   Component,
   EventEmitter,
   Input,
   OnChanges,
   OnInit,
   Output
} from '@angular/core';

import { StDropDownMenuItem } from '../st-dropdown-menu/st-dropdown-menu.interface';
import { Paginate, PaginateTexts } from './st-pagination.interface';

@Component({
   selector: 'st-pagination',
   templateUrl: './st-pagination.component.html',
   styleUrls: ['./st-pagination.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StPaginationComponent implements OnInit, OnChanges {
   @Input() total: number;
   @Input() perPage: number = 20;
   @Input() perPageOptions: number[] = [20, 50, 100];
   @Input() currentPage: number = 1;
   @Input() label: PaginateTexts;
   @Input() qaTag: string;
   @Input() showPerPage: boolean = false;
   @Input() hidePerPage: boolean = false;
   @Input() theme: string = 'themeA';

   @Output() change: EventEmitter<Paginate> = new EventEmitter<Paginate>();

   public disableNextButton: boolean = false;
   public disablePrevButton: boolean = true;
   public firstItem: number;
   public lastItem: number;
   public items: StDropDownMenuItem[] = [];
   public selectedItem: StDropDownMenuItem;

   constructor(private cd: ChangeDetectorRef) {
      if (!this.label) {
         this.label = {
            display: 'Display',
            element: 'elements',
            perPage: 'per page',
            of: 'of'
         };
         this.cd.markForCheck();
      }
   }

   ngOnInit(): void {
      this.updatePages(false);
      this.generateItems();
   }

   ngOnChanges(values: any): void {
      if (values.total) {
         this.generateItems();
         this.updatePages(false);
      }

      if (values.currentPage || values.perPage) {
         this.updatePages(false);
      }
   }

   generateItems(): void {
      this.items = this.perPageOptions.map(option => ({
         label: `${this.label.display} ${option} ${this.label.element} ${this.label
            .perPage}`,
         value: option
      }));
      this.selectedItem = this.items.find(item => item.value === this.perPage);
   }

   showItemsPerPage(): boolean {
      if (this.showPerPage) {
         return true;
      }

      if (this.hidePerPage) {
         return false;
      }

      if (this.total <= 50) {
         return false;
      }

      return true;
   }

   nextPage(): void {
      this.currentPage++;
      this.updatePages();
   }

   prevPage(): void {
      this.currentPage--;
      this.updatePages();
   }

   updatePages(emit: boolean = true): void {
      this.lastItem = this.perPage * this.currentPage;

      if (this.currentPage === 1) {
         this.firstItem = this.currentPage;
         this.disablePrevButton = true;
      } else {
         this.firstItem = this.perPage * (this.currentPage - 1) + 1;
         this.disablePrevButton = false;
      }

      if (this.lastItem >= this.total) {
         this.lastItem = this.total;
         this.disableNextButton = true;
      } else {
         this.disableNextButton = false;
      }

      if (emit) {
         this.change.emit({
            currentPage: this.currentPage,
            perPage: this.perPage
         });
      }
   }

   onChangePerPage(perPage: number): void {
      this.currentPage = 1;
      this.perPage = perPage;
      this.updatePages();
      this.selectedItem = this.items.find(item => item.value === this.perPage);
   }
}
