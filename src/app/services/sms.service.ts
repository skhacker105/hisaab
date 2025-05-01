import { Injectable } from '@angular/core';
import { ITentativeTransaction } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor() { }

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
    const { SmsReader } = (window as any).Capacitor.Plugins;

    const result = await SmsReader.read();
    console.log(result)
    const messages = result.messages || [];

    return messages.map((msg: any) => this.extractTransaction(msg));
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
