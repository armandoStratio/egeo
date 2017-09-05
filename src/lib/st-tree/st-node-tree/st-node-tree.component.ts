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
   Input,
   OnInit,
   OnChanges,
   SimpleChanges,
   ChangeDetectorRef,
   EventEmitter,
   Output,
   OnDestroy
} from '@angular/core';
import { cloneDeep as _cloneDeep, isEqual as _isEqual } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { StNodeTree, StNodeTreeChange } from '../st-tree.model';

/**
 * @description {Component} Node-Tree
 * This component show a subtree structure
 *
 * @example
 *
 *  <st-node-tree [father]="fatherNode" [node]="internalTree" ></st-node-tree>
 */
@Component({
   selector: 'st-node-tree',
   templateUrl: './st-node-tree.component.html',
   styleUrls: ['./st-node-tree.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StNodeTreeComponent implements OnInit, OnChanges, OnDestroy {

   /** @Input {string[]} fahter Variable to get full path for father */
   @Input() father: number[];
   /** @Input {StNodeTree} node Subtree structure */
   @Input() node: StNodeTree;
   @Input() pos: number;
   @Input() maxLevel: number;
   @Input() changeStreamNotification: Observable<StNodeTreeChange>;
   @Input() selectedPath: string;

   @Output() internalNodeUpdate: EventEmitter<StNodeTreeChange> = new EventEmitter<StNodeTreeChange>();
   @Output() toogleNode: EventEmitter<StNodeTreeChange> = new EventEmitter<StNodeTreeChange>();
   @Output() selectNode: EventEmitter<StNodeTreeChange> = new EventEmitter<StNodeTreeChange>();

   public actualPath: number[] = [];

   private subscriptionNotifications: Subscription;

   constructor(private _cd: ChangeDetectorRef) { }

   ngOnInit(): void {
      this.actualPath = this.buildActualPath(this.father, this.pos);
      this.checkSubscriptionToChanges(this.changeStreamNotification);
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes.father) {
         this.actualPath = this.buildActualPath(changes.father.currentValue, this.pos);
         this._cd.markForCheck();
      }

      if (changes && changes.pos) {
         this.actualPath = this.buildActualPath(this.father, changes.pos.currentValue);
      }
      if (changes && changes.changeStreamNotification && changes.changeStreamNotification.currentValue) {
         this.checkSubscriptionToChanges(changes.changeStreamNotification.currentValue);
      }
      this._cd.markForCheck();
   }

   ngOnDestroy(): void {
      if (this.subscriptionNotifications) {
         this.subscriptionNotifications.unsubscribe();
      }
   }

   getType(): string {
      return this.node.expanded ? 'expanded' : 'collapsed';
   }

   hasChildren(): boolean {
      return this.node && this.node.children && this.node.children.length > 0;
   }

   isLevelOverflow(): boolean {
      return this.maxLevel !== undefined && this.father && this.father.length >= this.maxLevel;
   }

   isNodeSelected(): boolean {
      return (this.selectedPath && this.getPath() === this.selectedPath) || this.node.selected;
   }

   onClickForSelect(event: Event): void {
      this.node.selected = true;
      let changeEvent: StNodeTreeChange = { node: this.node, path: this.getPath() };
      this.selectNode.emit(changeEvent);
   }

   onToogleNode(event: Event): void {
      this.node.expanded = !this.node.expanded;
      this.toogleNode.emit({ node: this.node, path: this.getPath() });
   }

   private checkSubscriptionToChanges(stream: Observable<StNodeTreeChange>): void {
      if (this.changeStreamNotification) {
         if (this.subscriptionNotifications) {
            this.subscriptionNotifications.unsubscribe();
         }
         this.subscriptionNotifications = this.changeStreamNotification.subscribe((change: StNodeTreeChange) => this.changeNode(change));
      }
   }

   private changeNode(change: StNodeTreeChange): void {
      let path: string = this.getPath();
      if (change.path === path && !_isEqual(change.node, this.node)) {
         this.node = _cloneDeep(change.node);
         this.internalNodeUpdate.emit({ node: this.node, path });
         this._cd.markForCheck();
      }
   }

   private getPath(): string {
      if (this.father.length === 0) {
         return '';
      } else if (this.father.length === 1) {
         return `children[${this.pos}]`;
      }
      return [...this.father.slice(1).map((father) => `children[${father}]`), ...[`children[${this.pos}]`]].join('.');
   }

   private buildActualPath(fatherPath: number[], actualNode: number): number[] {
      return [...fatherPath, actualNode];
   }
}
