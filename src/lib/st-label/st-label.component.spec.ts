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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

// Component
import { StLabelComponent } from './st-label.component';
import { StTooltipModule } from '../st-tooltip/st-tooltip.module';

@Component({
   template: `<label st-label></label>`
})
class TestStLabelComponent { }

let component: TestStLabelComponent;
let fixture: ComponentFixture<TestStLabelComponent>;
let labelContent: string = 'label content';
let labelId: string = 'label-id';
let nativeElement: any;
let tooltipText: string = 'Label tooltip text';

function createTestComponent(template?: string): Promise<ComponentFixture<TestStLabelComponent>> {
   if (template) {
      TestBed.overrideComponent(TestStLabelComponent, {
         set: {
            template: template
         }
      });
   }
   return TestBed.compileComponents();
}

describe('StLabel', () => {

   beforeEach(async(() => {
      TestBed
      .configureTestingModule({
         declarations: [
            StLabelComponent,
            TestStLabelComponent
         ],
         imports: [StTooltipModule]
      });
   }));

   it('Exist an element with class .content that contains label content', async(() => {
      let template = '<label st-label>' + labelContent + '</label>';
      createTestComponent(template).then(() => {
         fixture = TestBed.createComponent(TestStLabelComponent);
         fixture.detectChanges();
         nativeElement = fixture.nativeElement;
         expect(nativeElement.querySelector('.content').textContent).toContain(labelContent);
      });
   }));

   it('Label content does not have an id if original tag does not', async(() => {
      let template = '<label st-label>' + labelContent + '</label>';
      createTestComponent(template).then(() => {
         fixture = TestBed.createComponent(TestStLabelComponent);
         fixture.detectChanges();
         nativeElement = fixture.nativeElement;
         expect(nativeElement.querySelector('#' + labelId + '-text')).toBeNull();
      });
   }));

   it('Exist an element with same id as label plus sufix -text that contains label content', async(() => {
      let template = '<label st-label id="' + labelId + '">' + labelContent + '</label>';
      createTestComponent(template).then(() => {
         fixture = TestBed.createComponent(TestStLabelComponent);
         fixture.detectChanges();
         nativeElement = fixture.nativeElement;
         expect(nativeElement.querySelector('#' + labelId + '-text').textContent).toContain(labelContent);
      });
   }));

   it('Tooltip does not exists if property is not defined', async(() => {
      createTestComponent().then(() => {
         fixture = TestBed.createComponent(TestStLabelComponent);
         fixture.detectChanges();
         nativeElement = fixture.nativeElement;
         expect(nativeElement.querySelector('.st-tooltip-content-text')).toBe(null);
      });
   }));

   it('It has to display a text in its tooltip', () => {
      let template = '<label st-label id="' + labelId + '" tooltip="' + tooltipText + '">' + labelContent + '</label>';
      createTestComponent(template).then(() => {
         fixture = TestBed.createComponent(TestStLabelComponent);
         fixture.detectChanges();
         nativeElement = fixture.nativeElement;
         expect(nativeElement.querySelector('#' + labelId + '-tooltip .st-tooltip-content-text').textContent).toContain(tooltipText);
      });
   });
});
