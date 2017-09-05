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
   OnChanges,
   OnInit,
   SimpleChanges,
   Output,
   EventEmitter,
   ChangeDetectorRef
} from '@angular/core';
import {
   get as _get,
   set as _set,
   isEqual as _isEqual
} from 'lodash';
import { Observable } from 'rxjs/Observable';

import { StEgeo, StRequired } from '../decorators/require-decorators';
import { StNodeTree, StNodeTreeChange } from './st-tree.model';
import { EgeoResolveService } from '../utils/egeo-resolver/egeo-resolve.service';

/**
 * @description {Component} [Tree]
 *
 * The tree is a component for representing information in a hierarchical way.
 * It allows navigating between the different nodes and visualizing the parent-child relationships between nodes.
 * Up to 5 depth levels can be displayed at a time. To avoid a horizontal scroll,
 * from the 5th level will be collapsing previous levels, starting with the first parent.
 *
 * @model
 *
 *   [Node of tree] {./st-tree.model.ts#StNodeTree}
 *   [Object emited on changes] {./st-tree.model.ts#StNodeTreeChange}
 *
 * @example
 *
 * {html}
 *
 * ```
 * <st-tree
 *    [tree]="treeA"
 *    [maxLevel]="treeModel.max"
 *    [isRoot]="true"
 *    (toogleNode)="onToogleNode($event, treeA)"
 *    (selectNode)="onSelectNode($event, treeA)"
 *    (navigatePrevious)="onNavigatePrevious($event)"
 *    [changeStreamNotification]="notificationChangeStream">
 * </st-tree>
 * ```
 *
 */
@StEgeo()
@Component({
   selector: 'st-tree',
   templateUrl: './st-tree.component.html',
   styleUrls: ['./st-tree.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StTreeComponent implements OnInit, OnChanges {

   /** @Input {string} [qaTag=''] Id value for qa test */
   @Input() qaTag: string = '';
   /** @Input {StNodeTree} [^tree] Tree root node */
   @Input() @StRequired()
   get tree(): StNodeTree {
      return this._tree;
   }

   set tree(tree: StNodeTree) {
      this._tree = tree;
   }
   /** @Input {number} [maxLevel] Max level to show. From this level the tree does not expand more */
   @Input() maxLevel: number;
   /** @Input {boolean} [isRoot=true] TRUE: the first node is root and not show dots, FALSE: the first node is not root and
    * we put three dots to indicate that are more levels upper
    */
   @Input() isRoot: boolean = true;
   /** @Input {boolean} [expandFatherBranch=true] TRUE: Expand the path from the root to the expanded node if any node is not expanded.
    * FALSE: Only expand the selected node
    */
   @Input() expandFatherBranch: boolean = true;
   /** @Input {boolean} [collapseChildsBranch=true] TRUE: Collapse all child nodes. FALSE: Only collapse the selected node */
   @Input() collapseChildsBranch: boolean = true;
   /** @Input {Observable<StNodeTreeChange>} [changeStreamNotification] Stream for notificating changes in some node and not change all tree */
   @Input() changeStreamNotification: Observable<StNodeTreeChange>;

   /** @Output {StNodeTreeChange} [toogleNode] Notify any node expansion or collapsed */
   @Output() toogleNode: EventEmitter<StNodeTreeChange> = new EventEmitter<StNodeTreeChange>();
   /** @Output {StNodeTreeChange} [selectNode] Notify any node selection */
   @Output() selectNode: EventEmitter<StNodeTreeChange> = new EventEmitter<StNodeTreeChange>();
   /** @Output {Event} [navigatePrevious] Notify click over three dots to indicate that user wants to go up in tree structrure */
   @Output() navigatePrevious: EventEmitter<Event> = new EventEmitter<Event>();

   public fatherNode: number[] = [];
   public selectedPath: string = '';

   private _tree: StNodeTree;

   constructor(
      private _resolver: EgeoResolveService,
      private _cd: ChangeDetectorRef
   ) { }

   ngOnInit(): void {
      this.checkTreeExpand();
   }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes.tree && !changes.tree.firstChange && !_isEqual(changes.tree.currentValue, changes.tree.previousValue)) {
         if (!_isEqual(this._tree, changes.tree.currentValue)) {
            this._tree = changes.tree.currentValue;
            this.checkTreeExpand();
            this._cd.markForCheck();
         }
      }
   }

   onToogleNode(nodeChange: StNodeTreeChange): void {
      this.collapseAllBranchFromNode(nodeChange);
      this.toogleNode.emit(nodeChange);
   }

   onSelectNode(nodeChange: StNodeTreeChange): void {
      this.nodeSetSelected(this._tree);
      this.selectNode.emit(nodeChange);
      this.selectedPath = nodeChange.path;
      this._cd.markForCheck();
   }

   onInternalNodeUpdate(update: StNodeTreeChange): void {
      _set(this._tree, update.path, update.node);
   }

   private nodeSetSelected(node: StNodeTree): void {
      if (node.selected) {
         node.selected = false;
      }

      if (node.children) {
         node.children.map(i => this.nodeSetSelected(i));
      }
   }

   private checkTreeExpand(): void {
      if (this.expandFatherBranch) {
         let paths: string[] = this._resolver.getKeys(this._tree, 'expanded', true).map(resolveKey => resolveKey.path);
         this.expandBranchFromNode(paths);
      }
   }

   private collapseAllBranchFromNode(nodeChange: StNodeTreeChange): void {
      if (nodeChange && nodeChange.node && !nodeChange.node.expanded && this.collapseChildsBranch) {
         let node: StNodeTree;
         if (nodeChange.path.length > 0) {
            node = _get<StNodeTree>(this._tree, nodeChange.path, undefined);
         } else {
            node = this._tree;
         }
         let paths: string[] = this._resolver.getKeys(node, 'expanded', true).map(resolveKey => resolveKey.path);
         let actualNode: StNodeTree;
         paths.forEach(path => {
            actualNode = _get<StNodeTree>(node, path);
            actualNode.expanded = false;
            let fullPath: string = nodeChange.path.length === 0 ? path : `${nodeChange.path}.${path}`;
            this.toogleNode.emit({ node: actualNode, path: fullPath });
         });
      }
   }

   private expandBranchFromNode(path: string[]): void {
      path.forEach(pathForExpand => {
         let i: number = 1;
         let fatherNode: StNodeTreeChange = this.getFatherNode(this._tree, pathForExpand, i);
         while (fatherNode && !fatherNode.node.expanded) {
            fatherNode.node.expanded = true;
            this.toogleNode.emit(fatherNode);
            fatherNode = this.getFatherNode(this._tree, pathForExpand, ++i);
         }
      });
   }

   private getFatherNode(tree: StNodeTree, path: string, levelsToUp: number): StNodeTreeChange {
      let pathParts: string[] = path.split('.');
      if (pathParts && pathParts.length >= levelsToUp) {
         pathParts = pathParts.slice(0, pathParts.length - levelsToUp);
         if (pathParts.length === 0) {
            return { node: tree, path: '' };
         } else if (pathParts.length > 0) {
            return { node: _get<StNodeTree>(this._tree, pathParts.join('.'), undefined), path: pathParts.join('.') };
         }
      }
      return undefined;
   }

}
