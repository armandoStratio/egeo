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
export interface MenuOption {
   route: string;
   name: string;
}

export const OPTIONS: MenuOption[] = [
   { route: 'alerts-demo', name: 'Alerts' },
   { route: 'dropdown-demo', name: 'Dropdown' },
   { route: 'dropdown-menu-demo', name: 'Dropdown Menu' },
   { route: 'button-demo', name: 'Buttons' },
   { route: 'help-demo', name: 'help' },
   { route: 'info-box-demo', name: 'info-box' },
   { route: 'item-list-demo', name: 'item-list' },
   { route: 'main', name: 'main' },
   { route: 'search-demo', name: 'Search' },
   { route: 'select-demo', name: 'Select' },
   { route: 'switch-demo', name: 'Switch' },
   { route: 'tip-demo', name: 'tip' },
   { route: 'tooltip-demo', name: 'Tooltip' },
   { route: 'tree-demo', name: 'Tree' },
   { route: 'two-list-selection-demo', name: 'Two List Selection' },
   { route: 'breadcrumbs', name: 'Breadcrumbs' },
   { route: 'input', name: 'Input' }
];
