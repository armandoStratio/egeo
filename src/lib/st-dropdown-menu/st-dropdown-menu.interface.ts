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
import { TranslateableElement } from '../utils/egeo-resolver/egeo-resolve-model';

export class StDropDownMenuItem {
   label: string;
   value: any;
   icon?: string;
   selected?: boolean;
}

export class StDropDownMenuGroup {
   title?: string;
   items: StDropDownMenuItem[];
}

export class StDropDownMenuItemSchema {
   label: TranslateableElement;
   value: any;
   icon?: string;
   selected?: boolean;
}

export class StDropDownMenuGroupSchema {
   title?: TranslateableElement;
   items: StDropDownMenuItemSchema[];
}
