import { Injectable } from '@angular/core';
import { ITentativeTransaction } from '../interfaces';
import { LoggerService } from './';
import { GetMessageFilterInput, MessageObject, MessageReader } from '@solimanware/capacitor-message-reader';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private loggerService: LoggerService, private androidPermissions: AndroidPermissions) { }

  async checkReadSmsPermission() {
    const READ_SMS = this.androidPermissions.PERMISSION.READ_SMS;

    const result = await this.androidPermissions.checkPermission(READ_SMS);
    if (!result?.hasPermission) {
      await this.requestReadSmsPermission();
    }
  }

  async requestReadSmsPermission() {
    const READ_SMS = this.androidPermissions.PERMISSION.READ_SMS;

    const result = await this.androidPermissions.requestPermission(READ_SMS)
  }


  async readMessages(): Promise<ITentativeTransaction[]> {
    const filter: GetMessageFilterInput = {
      minDate: Date.now() - 365 * 24 * 60 * 60 * 1000, // Optional: Messages from the last 365 days
      // limit: 2, // Optional: Limit the number of messages
    };

    try {

      await this.checkReadSmsPermission();

      const result = await MessageReader.getMessages(filter);

      const messages: MessageObject[] = result.messages || [];
      this.loggerService.log('total messages = ' + messages.length);

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

  private extractTransaction(msg: MessageObject): ITentativeTransaction | null {
    const content = msg.body;
  
    const amounts = this.extractCurrencyAmounts(content);
    if (amounts.length === 0) return null;
  
    const description = this.extractDescription(content);
  
    return {
      id: `tentative-${msg.id}`,
      date: new Date(msg.date).toString(),
      body: msg.body,
      possibleAmounts: amounts,
      possibleDescriptions: [description],
    };
  }
  
  private extractCurrencyAmounts(content: string): number[] {
    const currencyRegex = new RegExp(
      String.raw`(?:(?:₹|\$|€|£|¥|Rs\.?|INR|USD|EUR|GBP|JPY|CAD|AUD|rupees?|dollars?|euros?|pounds?)\s?([0-9,]+(?:\.\d{1,2})?))|(?:([0-9,]+(?:\.\d{1,2})?)\s?(?:₹|\$|€|£|¥|Rs\.?|INR|USD|EUR|GBP|JPY|CAD|AUD|rupees?|dollars?|euros?|pounds?))`,
      'gi'
    );
  
    const matches = [...content.matchAll(currencyRegex)];
    return matches.map(m => parseFloat((m[1] || m[2]).replace(/,/g, '')));
  }
  
  private extractDescription(content: string): string {
    const keywords = [
      'sent', 'received', 'credited', 'debited', 'paid',
      'withdrawn', 'deposited', 'transfer', 'transferred',
      'purchase', 'purchased', 'recharged', 'payment'
    ];
  
    const lowerContent = content.toLowerCase();
    const keyword = keywords.find(k => lowerContent.includes(k));
  
    if (!keyword) {
      return content.slice(0, 50);
    }
  
    const contextRegex = new RegExp(
      `(?:.{0,30})(${keyword}[^.!\n]{0,100})`,
      'i'
    );
    const match = content.match(contextRegex);
    return match?.[1]?.trim() || content.slice(0, 50);
  }
  
}
