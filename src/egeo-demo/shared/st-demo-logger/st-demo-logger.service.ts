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
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StDemoLogger, StDemoLoggerSeverity } from './st-demo-loger.model';

@Injectable()
export class StDemoLoggerService {
   private _logList: StDemoLogger[] = [];
   private _logStream: BehaviorSubject<StDemoLogger[]> = new BehaviorSubject<StDemoLogger[]>([]);
   private _maxMessages: number = 20;

   get logStream(): Observable<StDemoLogger[]> {
      return this._logStream.asObservable();
   }

   public log(...messages: any[]): void {
      const strMessages: string[] = messages.map(message => message.toString());
      this.notifyAlert(new StDemoLogger(strMessages.join(' ')));
   }

   public notifyAlert(log: StDemoLogger): void;
   public notifyAlert(severity: StDemoLoggerSeverity, message: string): void;
   public notifyAlert(severityOrLog: StDemoLogger | StDemoLoggerSeverity, message?: string): void {
      if (severityOrLog instanceof StDemoLogger) {
         this._logList.unshift(severityOrLog);
      } else {
         this._logList.unshift({ severity: severityOrLog, message });
      }
      // First check if its over limit
      this.checkLogListCapacity();
      // Then notify new elements to observers
      this._logStream.next(this._logList);
   }

   public set maxMessages(maxMessages: number) {
      this._maxMessages = maxMessages;
   }

   private checkLogListCapacity(): void {
      this._logList = this._logList.length > this._maxMessages ? this._logList.slice(0, this._maxMessages) : this._logList;
   }
}
