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
import { Component } from '@angular/core';

@Component({
   selector: 'st-button-demo',
   templateUrl: './st-button-demo.component.html'
})

export class StButtonDemoComponent {

   public test1(): void {
      console.log('You clicked the button 1!');
   }

   public test2(): void {
      console.log('You clicked the button 2!');
   }
}
