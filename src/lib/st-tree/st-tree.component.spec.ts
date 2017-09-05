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
import { DebugElement, SimpleChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { cloneDeep as _cloneDeep } from 'lodash';


import { StTreeComponent } from './st-tree.component';
import { StNodeTree, StNodeTreeChange } from './st-tree.model';
import { StNodeTreeComponent } from './st-node-tree/st-node-tree.component';
import { StTreeNodeExpandComponent } from './st-tree-node-expand/st-tree-node-expand.component';

import { EgeoResolveService } from '../utils/egeo-resolver/egeo-resolve.service';
import { EgeoResolverKeys } from '../utils/egeo-resolver/egeo-resolve-model';

const mockTree: StNodeTree = {
   name: 'hdfs',
   icon: 'icon-folder',
   expanded: true,
   children: [
      { name: 'folder A', icon: 'icon-folder' },
      {
         name: 'folder B', icon: 'icon-folder', expanded: true, children: [
            {
               name: 'folder B.0', icon: 'icon-folder', children: [
                  { name: 'folder B.0.0', icon: 'icon-file' },
                  { name: 'folder B.0.1', icon: 'icon-file' }
               ]
            },
            {
               name: 'folder B.1', icon: 'icon-folder', expanded: true, children: [
                  { name: 'folder B.1.0', icon: 'icon-file' },
                  { name: 'folder B.1.1', icon: 'icon-file' }
               ]
            },
            { name: 'folder B.2', icon: 'icon-file' },
            { name: 'folder B.3', icon: 'icon-file' },
            {
               name: 'folder B.4', icon: 'icon-folder', expanded: true, children: [
                  { name: 'folder B.4.0', icon: 'icon-file' },
                  { name: 'folder B.4.1', icon: 'icon-file' },
                  { name: 'folder B.4.2', icon: 'icon-file' },
                  { name: 'folder B.4.3', icon: 'icon-file' },
                  { name: 'folder B.4.4', icon: 'icon-file' }
               ]
            }
         ]
      },
      { name: 'folder C', icon: 'icon-file' },
      { name: 'folder D', icon: 'icon-folder' }
   ]
};

let fixture: ComponentFixture<StTreeComponent>;

describe('StTreeComponent', () => {

   let comp: StTreeComponent;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [StTreeComponent, StNodeTreeComponent, StTreeNodeExpandComponent],
         providers: [EgeoResolveService]
      })
         .compileComponents();  // compile template and css
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StTreeComponent);
      comp = fixture.componentInstance;
   });


   it('should init correctly', () => {
      comp.tree = mockTree;
      fixture.detectChanges();

      expect(comp.fatherNode).toEqual([]);
      expect(comp.qaTag).toEqual('');
      expect(comp.maxLevel).toBeUndefined();
      expect(comp.isRoot).toBeTruthy();

      // Tree and mockTree are the same, internalTree its equal but not the same
      expect(comp.tree).toEqual(mockTree);
   });

   it('should change tree structure and reflect change', () => {
      comp.tree = mockTree;
      fixture.detectChanges();

      // Tree and mockTree are the same, internalTree its equal but not the same
      expect((comp as any)._tree).toEqual(mockTree);
      expect(comp.tree).toBe(mockTree);

      let newTree: StNodeTree = { name: 'hdfs', icon: 'icon-folder' };
      let changes: SimpleChanges = { tree: new SimpleChange(mockTree, newTree, false) };
      comp.tree = newTree;
      comp.ngOnChanges(changes);

      expect((comp as any)._tree).toEqual(newTree);
   });


   it('should collapse node without childs and collapseChildsBranch true', () => {
      let node: StNodeTree = { name: 'name', icon: '' };
      comp.collapseChildsBranch = true;
      comp.tree = { name: 'root', icon: '', children: [node] };
      fixture.detectChanges();

      let responseFunction = jasmine.createSpy('response');
      comp.toogleNode.subscribe(responseFunction);
      let nodeToSend: StNodeTree = (comp as any)._tree.children[0];
      nodeToSend.expanded = false;
      let change: StNodeTreeChange = { node: nodeToSend, path: 'children[0]' };

      comp.onToogleNode(change);

      expect((comp as any)._tree.children[0].expanded).toBeFalsy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledWith(change);

      comp.toogleNode.unsubscribe();
   });

   it('should collapse node with childs collapsed and collapseChildsBranch true', () => {
      let node: StNodeTree = { name: 'name', icon: '', expanded: true, children: [{ name: 'child1', icon: '' }] };
      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.collapseChildsBranch = true;
      fixture.detectChanges();

      let responseFunction = jasmine.createSpy('response');
      comp.toogleNode.subscribe(responseFunction);
      let nodeToSend: StNodeTree = (comp as any)._tree.children[0];
      nodeToSend.expanded = false;
      let change: StNodeTreeChange = { node: nodeToSend, path: 'children[0]' };

      comp.onToogleNode(change);

      expect((comp as any)._tree.children[0].expanded).toBeFalsy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);
      expect(responseFunction).toHaveBeenCalledWith(change);

      comp.toogleNode.unsubscribe();
   });

   it('should collapse node with childs expanded and collapseChildsBranch true', () => {
      let node: StNodeTree = { name: 'name', icon: '', expanded: true, children: [{ name: 'child1', icon: '', expanded: true }] };
      comp.tree = { name: 'root', icon: '', expanded: true, children: [node] };
      comp.collapseChildsBranch = true;
      fixture.detectChanges();

      let responseFunction = jasmine.createSpy('response');
      comp.toogleNode.subscribe(responseFunction);
      let nodeToSend: StNodeTree = (comp as any)._tree;
      nodeToSend.expanded = false;
      let change: StNodeTreeChange = { node: nodeToSend, path: '' };

      comp.onToogleNode(change);

      expect((comp as any)._tree.expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].children[0].expanded).toBeFalsy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(3);
      expect(responseFunction).toHaveBeenCalledWith(change);

      comp.toogleNode.unsubscribe();
   });

   it('should collapse node without childs and collapseChildsBranch false', () => {
      let node: StNodeTree = { name: 'name', icon: '' };
      comp.collapseChildsBranch = false;
      comp.tree = { name: 'root', icon: '', children: [node] };
      fixture.detectChanges();

      let responseFunction = jasmine.createSpy('response');
      comp.toogleNode.subscribe(responseFunction);
      let nodeToSend: StNodeTree = (comp as any)._tree.children[0];
      nodeToSend.expanded = false;
      let change: StNodeTreeChange = { node: nodeToSend, path: 'children[0]' };

      comp.onToogleNode(change);

      expect((comp as any)._tree.children[0].expanded).toBeFalsy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledWith(change);

      comp.toogleNode.unsubscribe();
   });

   it('should collapse node with childs collapsed and collapseChildsBranch false', () => {
      let node: StNodeTree = { name: 'name', icon: '', expanded: true, children: [{ name: 'child1', icon: '' }] };
      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.collapseChildsBranch = false;
      fixture.detectChanges();

      let responseFunction = jasmine.createSpy('response');
      comp.toogleNode.subscribe(responseFunction);
      let nodeToSend: StNodeTree = (comp as any)._tree.children[0];
      nodeToSend.expanded = false;
      let change: StNodeTreeChange = { node: nodeToSend, path: 'children[0]' };

      comp.onToogleNode(change);

      expect((comp as any)._tree.children[0].expanded).toBeFalsy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);
      expect(responseFunction).toHaveBeenCalledWith(change);

      comp.toogleNode.unsubscribe();
   });

   it('should collapse node with childs expanded and collapseChildsBranch false', () => {
      let node: StNodeTree = { name: 'name', icon: '', expanded: true, children: [{ name: 'child1', icon: '', expanded: true }] };
      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.collapseChildsBranch = false;
      fixture.detectChanges();

      let responseFunction = jasmine.createSpy('response');
      comp.toogleNode.subscribe(responseFunction);
      let nodeToSend: StNodeTree = (comp as any)._tree.children[0];
      nodeToSend.expanded = false;
      let change: StNodeTreeChange = { node: nodeToSend, path: 'children[0]' };

      comp.onToogleNode(change);

      expect((comp as any)._tree.children[0].expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].children[0].expanded).toBeTruthy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);
      expect(responseFunction).toHaveBeenCalledWith(change);

      comp.toogleNode.unsubscribe();
   });

   it('should emit on select node', () => {
      comp.tree = { name: 'root', icon: '' };

      let responseFunction = jasmine.createSpy('response');
      comp.selectNode.subscribe(responseFunction);

      let change: StNodeTreeChange = { node: (comp as any)._tree, path: '' };

      comp.onSelectNode(change);

      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);
      expect(responseFunction).toHaveBeenCalledWith(change);

      comp.selectNode.unsubscribe();
   });

   it('should expand father nodes when its a deep node with expandFatherBranch true', () => {
      let responseFunction = jasmine.createSpy('response');
      let node: StNodeTree = { name: 'name', icon: '', expanded: false, children: [{ name: 'child1', icon: '', expanded: true }] };

      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.toogleNode.subscribe(responseFunction);
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = true;
      fixture.detectChanges();

      expect((comp as any)._tree.expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].children[0].expanded).toBeTruthy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(2);
   });

   it('should expand father nodes when its a child of root node with expandFatherBranch true', () => {
      let responseFunction = jasmine.createSpy('response');
      let node: StNodeTree = { name: 'name', icon: '', expanded: true, children: [{ name: 'child1', icon: '' }] };

      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.toogleNode.subscribe(responseFunction);
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = true;
      fixture.detectChanges();

      expect((comp as any)._tree.expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].expanded).toBeTruthy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);

   });

   it('should expand father nodes when its the root node with expandFatherBranch true', () => {
      let responseFunction = jasmine.createSpy('response');
      let node: StNodeTree = { name: 'name', icon: '', expanded: false, children: [{ name: 'child1', icon: '' }] };

      comp.tree = { name: 'root', icon: '', expanded: true, children: [node] };
      comp.toogleNode.subscribe(responseFunction);
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = true;
      fixture.detectChanges();

      expect((comp as any)._tree.expanded).toBeTruthy();
      expect(responseFunction).not.toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(0);
   });

   it('should expand father nodes when its a deep node with expandFatherBranch false', () => {
      let responseFunction = jasmine.createSpy('response');
      let node: StNodeTree = { name: 'name', icon: '', expanded: false, children: [{ name: 'child1', icon: '', expanded: true }] };

      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.toogleNode.subscribe(responseFunction);
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = false;
      fixture.detectChanges();

      expect((comp as any)._tree.expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].children[0].expanded).toBeTruthy();
      expect(responseFunction).not.toHaveBeenCalled();
   });

   it('should expand father nodes when its a child of root node with expandFatherBranch false', () => {
      let responseFunction = jasmine.createSpy('response');
      let node: StNodeTree = { name: 'name', icon: '', expanded: true, children: [{ name: 'child1', icon: '' }] };

      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.toogleNode.subscribe(responseFunction);
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = false;
      fixture.detectChanges();

      expect((comp as any)._tree.expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].expanded).toBeTruthy();
      expect(responseFunction).not.toHaveBeenCalled();

   });

   it('should expand father nodes when its the root node with expandFatherBranch false', () => {
      let responseFunction = jasmine.createSpy('response');
      let node: StNodeTree = { name: 'name', icon: '', expanded: false, children: [{ name: 'child1', icon: '' }] };

      comp.tree = { name: 'root', icon: '', expanded: true, children: [node] };
      comp.toogleNode.subscribe(responseFunction);
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = false;
      fixture.detectChanges();

      expect((comp as any)._tree.expanded).toBeTruthy();
      expect(responseFunction).not.toHaveBeenCalled();
   });

   it('should expand father nodes when its a deep node with expandFatherBranch true and intermediate node expanded', () => {
      let responseFunction = jasmine.createSpy('response');
      let node: StNodeTree = {
         name: 'name', icon: '', expanded: true, children: [
            {
               name: 'child1', icon: '', expanded: false, children: [
                  {
                     name: 'child1.1', icon: '', expanded: false, children: [
                        { name: 'child1.1.1', icon: '', expanded: true }
                     ]
                  }
               ]
            }
         ]
      };

      comp.tree = { name: 'root', icon: '', children: [node] };
      comp.toogleNode.subscribe(responseFunction);
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = true;
      fixture.detectChanges();

      expect((comp as any)._tree.expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].children[0].expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].children[0].children[0].expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].children[0].children[0].children[0].expanded).toBeTruthy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(3);
   });

   it('should collapse deep node with two levels childs expanded and collapseChildsBranch true', () => {
      let node: StNodeTree = {
         name: 'name', icon: '', expanded: true, children: [
            {
               name: 'child1', icon: '', expanded: false, children: [
                  {
                     name: 'child1.1', icon: '', expanded: true, children: [
                        { name: 'child1.1.1', icon: '', expanded: false }
                     ]
                  }
               ]
            }
         ]
      };

      comp.tree = { name: 'root', icon: '', expanded: true, children: [node] };
      comp.collapseChildsBranch = true;
      fixture.detectChanges();

      let responseFunction = jasmine.createSpy('response');
      comp.toogleNode.subscribe(responseFunction);
      let nodeToSend: StNodeTree = (comp as any)._tree.children[0].children[0];
      nodeToSend.expanded = false;
      let change: StNodeTreeChange = { node: nodeToSend, path: 'children[0].children[0]' };

      comp.onToogleNode(change);

      expect((comp as any)._tree.expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].expanded).toBeTruthy();
      expect((comp as any)._tree.children[0].children[0].expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].children[0].children[0].expanded).toBeFalsy();
      expect((comp as any)._tree.children[0].children[0].children[0].children[0].expanded).toBeFalsy();
      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(2);

      comp.toogleNode.unsubscribe();
   });

   it('should update when internal node update event', () => {
      let node: StNodeTree = { name: 'name', icon: '', expanded: true };
      comp.tree = { name: 'root', icon: '', expanded: true, children: [node] };
      comp.collapseChildsBranch = false;
      comp.expandFatherBranch = false;
      fixture.detectChanges();

      let nodeToSend: StNodeTree = _cloneDeep((comp as any)._tree.children[0]);
      let newName: string = 'New node name';
      nodeToSend.name = newName;
      let change: StNodeTreeChange = { node: nodeToSend, path: 'children[0]' };

      expect((comp as any)._tree.children[0].name).toEqual(node.name);
      comp.onInternalNodeUpdate(change);

      expect((comp as any)._tree.children[0].name).toEqual(newName);
   });

   it('should emit a navigate previous event', () => {
      let el: DebugElement;
      let responseFunction = jasmine.createSpy('response');
      comp.tree = mockTree;
      comp.isRoot = false;
      comp.navigatePrevious.subscribe(responseFunction);
      fixture.detectChanges();

      el = fixture.debugElement.query(By.css('st-tree-node-expand'));
      el.nativeElement.dispatchEvent(new Event('click'));

      expect(responseFunction).toHaveBeenCalled();
      expect(responseFunction).toHaveBeenCalledTimes(1);

      comp.navigatePrevious.unsubscribe();
   });

});
