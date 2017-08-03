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
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { MainComponent } from './main/main';

export const routes: Routes = [
   {
      path: '',
      component: LayoutComponent,
      children: [
         // Main redirection
         { path: '', redirectTo: 'main', pathMatch: 'full' },
         { path: 'alerts-demo', loadChildren: '@stratio/egeo-demo#StAlertsDemoModule' },
         { path: 'breadcrumbs', loadChildren: '@stratio/egeo-demo#StBreadcrumbsDemoModule' },
         { path: 'button-demo', loadChildren: '@stratio/egeo-demo#StButtonDemoModule' },
         { path: 'dropdown-demo', loadChildren: '@stratio/egeo-demo#StDropdownDemoModule' },
         { path: 'dropdown-menu-demo', loadChildren: '@stratio/egeo-demo#StDropdownMenuDemoModule' },
         { path: 'help-demo', loadChildren: '@stratio/egeo-demo#StHelpDemoModule' },
         { path: 'info-box-demo', loadChildren: '@stratio/egeo-demo#StInfoBoxDemoModule' },
         { path: 'input', loadChildren: '@stratio/egeo-demo#StInputDemoModule' },
         { path: 'item-list-demo', loadChildren: '@stratio/egeo-demo#StItemListDemoModule' },
         { path: 'main', component: MainComponent },
         { path: 'search-demo', loadChildren: '@stratio/egeo-demo#StSearchDemoModule' },
         { path: 'select-demo', loadChildren: '@stratio/egeo-demo#StSelectDemoModule' },
         { path: 'switch-demo', loadChildren: '@stratio/egeo-demo#StSwitchDemoModule' },
         { path: 'tip-demo', loadChildren: '@stratio/egeo-demo#StTipDemoModule' },
         { path: 'tooltip-demo', loadChildren: '@stratio/egeo-demo#StTooltipDemoModule' },
         { path: 'tree-demo', loadChildren: '@stratio/egeo-demo#StTreeDemoModule' },
         { path: 'two-list-selection-demo', loadChildren: '@stratio/egeo-demo#StTwoListSelectionDemoModule' }
      ]
   }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
