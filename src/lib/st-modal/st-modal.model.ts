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

export enum StModalType { INFO, WARNING, NEUTRAL }
export enum StModalWidth { COMPACT, REGULAR, LARGE }
export enum StModalMainTextSize { BIG, MEDIUM }
export enum StModalResponse { YES, NO, CLOSE }

export class StModalButton {
   icon?: string;
   iconLeft?: boolean;
   primary?: boolean;
   label: string;
   response: StModalResponse;
}

export class StModalConfig {
   contextualTitle?: string;
   modalTitle?: string;
   message?: string;
   html?: string;
   mainText?: StModalMainTextSize;
   modalType?: StModalType;
   modalWidth?: StModalWidth;
   inputs?: Object;
   outputs?: Object;
   buttons?: StModalButton[];
   closeOnAccept?: boolean;
   qaTag: string;
}
