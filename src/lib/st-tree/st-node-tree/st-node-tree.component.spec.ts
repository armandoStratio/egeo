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
import { DebugElement, SimpleChanges, SimpleChange } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { cloneDeep as _cloneDeep } from 'lodash';
import { Subject } from 'rxjs/Subject';

import { StNodeTree, StNodeTreeChange } from '../st-tree.model';
import { StNodeTreeComponent } from './st-node-tree.component';
import { StTreeNodeExpandComponent } from '../st-tree-node-expand/st-tree-node-expand.component';


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

let fixture: ComponentFixture<StNodeTreeComponent>;

describe('StTreeComponent', () => {
   describe('StNodeTreeComponent', () => {

      let comp: StNodeTreeComponent;

      beforeEach(async(() => {
         TestBed.configureTestingModule({
            declarations: [StNodeTreeComponent, StTreeNodeExpandComponent]
         })
            .compileComponents();  // compile template and css
      }));

      beforeEach(() => {
         fixture = TestBed.createComponent(StNodeTreeComponent);
         comp = fixture.componentInstance;
      });


      it('should init correctly', () => {
         comp.father = [];
         comp.pos = 0;
         comp.node = mockTree;
         fixture.detectChanges();

         expect(comp.actualPath).toEqual([0]);
         expect(comp.getType()).toEqual('expanded');
         expect(comp.hasChildren()).toBeTruthy();
         expect(comp.isLevelOverflow()).toBeFalsy();
      });

      it('should react to changes', () => {
         comp.father = [0];
         comp.pos = 0;
         comp.node = mockTree;
         fixture.detectChanges();

         expect(comp.actualPath).toEqual([0, 0]);
         expect(comp.getType()).toEqual('expanded');
         expect(comp.hasChildren()).toBeTruthy();
         expect(comp.isLevelOverflow()).toBeFalsy();

         comp.ngOnChanges({ father: new SimpleChange([0], [1], true) });
         comp.father = [1];
         fixture.detectChanges();
         expect(comp.actualPath).toEqual([1, 0]);

         comp.ngOnChanges({ pos: new SimpleChange(0, 1, true) });
         comp.pos = 1;
         fixture.detectChanges();
         expect(comp.actualPath).toEqual([1, 1]);
      });

      it('should check if has children correctly', () => {
         comp.father = [0];
         comp.pos = 1;
         comp.node = mockTree;
         fixture.detectChanges();

         expect(comp.hasChildren()).toBeTruthy();

         let newNode: StNodeTree = { name: 'test1', icon: 'icon-folder' };
         comp.node = newNode;
         expect(comp.hasChildren()).toBeFalsy();

         newNode.children = [];
         comp.node = newNode;
         expect(comp.hasChildren()).toBeFalsy();
      });

      it('should check if if overflow the maximum level of the tree', () => {
         comp.father = [];
         comp.pos = 1;
         comp.node = mockTree;
         fixture.detectChanges();

         expect(comp.isLevelOverflow()).toBeFalsy();

         comp.maxLevel = 3;
         comp.father = [0, 1, 3, 4];
         expect(comp.isLevelOverflow()).toBeTruthy();

         comp.father = [0, 1];
         expect(comp.isLevelOverflow()).toBeFalsy();
      });

      it('should emit when click on expand a node for a internal node', () => {
         let responseFunction = jasmine.createSpy('response');
         comp.toogleNode.subscribe(responseFunction);
         comp.father = [0, 1];
         comp.pos = 4;
         comp.node = { name: 'testNode', icon: '', expanded: false };
         fixture.detectChanges();

         let expectedResult = { name: 'testNode', icon: '', expanded: true };

         comp.onToogleNode(new Event('click'));
         expect(responseFunction).toHaveBeenCalled();
         expect(responseFunction).toHaveBeenCalledTimes(1);
         expect(responseFunction).toHaveBeenCalledWith({ node: expectedResult, path: 'children[1].children[4]' });
      });

      it('should emit when click on expand a node for a child from root node', () => {
         let responseFunction = jasmine.createSpy('response');
         comp.toogleNode.subscribe(responseFunction);
         comp.father = [0];
         comp.pos = 4;
         comp.node = { name: 'testNode', icon: '', expanded: false };
         fixture.detectChanges();

         let expectedResult = { name: 'testNode', icon: '', expanded: true };

         comp.onToogleNode(new Event('click'));
         expect(responseFunction).toHaveBeenCalled();
         expect(responseFunction).toHaveBeenCalledTimes(1);
         expect(responseFunction).toHaveBeenCalledWith({ node: expectedResult, path: 'children[4]' });
      });

      it('should emit when click on expand a node for root node', () => {
         let responseFunction = jasmine.createSpy('response');
         comp.toogleNode.subscribe(responseFunction);
         comp.father = [];
         comp.pos = 0;
         comp.node = { name: 'testNode', icon: '', expanded: false };
         fixture.detectChanges();

         let expectedResult = { name: 'testNode', icon: '', expanded: true };

         comp.onToogleNode(new Event('click'));
         expect(responseFunction).toHaveBeenCalled();
         expect(responseFunction).toHaveBeenCalledTimes(1);
         expect(responseFunction).toHaveBeenCalledWith({ node: expectedResult, path: '' });
      });


      it('should emit when click on select a node for a internal node', () => {
         let onSelectFunction = jasmine.createSpy('response');
         comp.selectNode.subscribe(onSelectFunction);
         comp.father = [0, 1];
         comp.pos = 4;
         comp.node = { name: 'testNode', icon: '', expanded: false };
         fixture.detectChanges();

         let expectedResult = { name: 'testNode', icon: '', expanded: false, selected: true };

         comp.onClickForSelect(new Event('click'));
         expect(onSelectFunction).toHaveBeenCalled();
         expect(onSelectFunction).toHaveBeenCalledTimes(1);
         expect(onSelectFunction).toHaveBeenCalledWith({ node: expectedResult, path: 'children[1].children[4]' });
      });

      it('should emit when click on select a node for a child from root node', () => {
         let onSelectFunction = jasmine.createSpy('response');
         comp.selectNode.subscribe(onSelectFunction);
         comp.father = [0];
         comp.pos = 4;
         comp.node = { name: 'testNode', icon: '', expanded: false };
         fixture.detectChanges();

         let expectedResult = { name: 'testNode', icon: '', expanded: false, selected: true };

         comp.onClickForSelect(new Event('click'));
         expect(onSelectFunction).toHaveBeenCalled();
         expect(onSelectFunction).toHaveBeenCalledTimes(1);
         expect(onSelectFunction).toHaveBeenCalledWith({ node: expectedResult, path: 'children[4]' });
      });

      it('should emit when click on select a node for root node', () => {
         let onSelectFunction = jasmine.createSpy('response');
         comp.selectNode.subscribe(onSelectFunction);
         comp.father = [];
         comp.pos = 0;
         comp.node = { name: 'testNode', icon: '', expanded: false };
         fixture.detectChanges();

         let expectedResult = { name: 'testNode', icon: '', expanded: false, selected: true };

         comp.onClickForSelect(new Event('click'));
         expect(onSelectFunction).toHaveBeenCalled();
         expect(onSelectFunction).toHaveBeenCalledTimes(1);
         expect(onSelectFunction).toHaveBeenCalledWith({ node: expectedResult, path: '' });
      });

      it('should update single node when path is equal to own path', () => {
         let subject: Subject<StNodeTreeChange> = new Subject<StNodeTreeChange>();

         comp.father = [0];
         comp.pos = 1;
         comp.node = { name: 'test', icon: '' };
         comp.changeStreamNotification = subject.asObservable();
         fixture.detectChanges();

         expect(comp.node.name).toEqual('test');
         let newNode: StNodeTree = { name: 'new value', icon: '' };
         subject.next({ node: newNode, path: 'children[1]' });
         fixture.detectChanges();

         expect(comp.node.name).toEqual('new value');
      });

      it('should not update node when path is not equal to own path', () => {
         let subject: Subject<StNodeTreeChange> = new Subject<StNodeTreeChange>();

         comp.father = [0];
         comp.pos = 1;
         comp.node = { name: 'test', icon: '' };
         comp.changeStreamNotification = subject.asObservable();
         fixture.detectChanges();

         expect(comp.node.name).toEqual('test');
         let newNode: StNodeTree = { name: 'new value', icon: '' };
         subject.next({ node: newNode, path: 'children[5]' });
         fixture.detectChanges();

         expect(comp.node.name).toEqual('test');
      });

      it('should update subscription to node update', () => {
         let subject1: Subject<StNodeTreeChange> = new Subject<StNodeTreeChange>();
         let subject2: Subject<StNodeTreeChange> = new Subject<StNodeTreeChange>();

         comp.father = [0];
         comp.pos = 1;
         comp.node = { name: 'test', icon: '' };
         comp.changeStreamNotification = subject1.asObservable();
         fixture.detectChanges();

         expect(comp.node.name).toEqual('test');

         comp.changeStreamNotification = subject2;
         comp.ngOnChanges({ changeStreamNotification: new SimpleChange(subject1, subject2, true) });
         fixture.detectChanges();

         let newNode: StNodeTree = { name: 'new value', icon: '' };
         subject2.next({ node: newNode, path: 'children[1]' });
         fixture.detectChanges();

         expect(comp.node.name).toEqual('new value');
      });

      it('Select node changes selected property model', () => {
         comp.father = [0, 1];
         comp.pos = 4;
         comp.node = mockTree;
         comp.node.selected = true;
         fixture.detectChanges();
         expect(comp.isNodeSelected()).toBeTruthy();
      });

      it('Selected path is equal to received path', () => {
         comp.father = [0, 1];
         comp.pos = 4;
         comp.node = mockTree;
         comp.selectedPath = 'children[1].children[4]';
         fixture.detectChanges();
         expect(comp.isNodeSelected()).toBeTruthy();
      });
   });
});
