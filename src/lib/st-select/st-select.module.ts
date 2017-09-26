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
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StLabelModule } from '../st-label/st-label.module';
import { StDropdownModule } from '../st-dropdown/st-dropdown.module';
import { StSelectComponent } from './st-select.component';

@NgModule({
   imports: [CommonModule, FormsModule, ReactiveFormsModule, StLabelModule, StDropdownModule],
   declarations: [StSelectComponent],
   exports: [StSelectComponent]
})
export class StSelectModule { }
