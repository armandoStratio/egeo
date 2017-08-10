/*
 * Copyright (C) 2016 Stratio (http://stratio.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component } from '@angular/core';
import { StHorizontalTab } from '@stratio/egeo';

@Component({
   selector: 'st-button-demo',
   templateUrl: './st-button-demo.component.html',
   styleUrls: ['./st-button-demo.component.scss']
})

export class StButtonDemoComponent {
   public options: StHorizontalTab[] = [
      { text: 'NEW WAY', isDisabled: false },
      { text: 'OLD WAY', isDisabled: false }
   ];

   public active: string = 'NEW WAY';

   public onChangeOption(option: string): void {
      this.active = option;
   }

   public test1(): void {
      console.log('You clicked the button 1!');
   }

   public test2(): void {
      console.log('You clicked the button 2!');
   }
}
