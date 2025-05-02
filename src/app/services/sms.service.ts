import { Injectable } from '@angular/core';
import { ITentativeTransaction } from '../interfaces';
import { LoggerService } from './';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private loggerService: LoggerService) { }

  async requestPermission(): Promise<boolean> {
    const result = await (window as any).PermissionsAndroid.request(
      (window as any).PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission',
        message: 'This app needs access to your SMS to extract transaction information.',
        buttonPositive: 'Allow',
      }
    );
    return result === (window as any).PermissionsAndroid.RESULTS.GRANTED;
  }

  async readMessages(): Promise<ITentativeTransaction[]> {
    try {
      const { SmsReader } = (window as any).Capacitor.Plugins;

      const result = await SmsReader.read();
      this.loggerService.log(result);
      this.loggerService.setShowLogs('123');

      const messages: any[] = result.messages || [];

      return messages.reduce((arr, msg: any) => {
        const data = this.extractTransaction(msg);
        if (!data) return arr;

        arr.push(data);
        return arr;
      }, [] as ITentativeTransaction[]);

    } catch (err) {

      this.loggerService.log(err);
      this.loggerService.setShowLogs('123');
      return [];
    }
  }

  private extractTransaction(msg: any): ITentativeTransaction | null {
    const content = msg.body;
    const regex = /(?:Rs\\.?|INR|₹)?\\s?([0-9,]+(?:\\.\\d{1,2})?)/gi;
    const matches = [...content.matchAll(regex)];

    if (matches.length === 0) return null;

    return {
      id: `tentative-${msg.id}`,
      receivedAt: msg.date,
      body: msg.body,
      possibleAmounts: matches.map(m => parseFloat(m[1].replace(/,/g, ''))),
      possibleDescriptions: [msg.body.slice(0, 50)],
    };
  }
}
