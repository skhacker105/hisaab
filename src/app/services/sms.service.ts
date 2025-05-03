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
  
    if (!this.isTransactionMessage(content)) return null;
  
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
  

  private isTransactionMessage(content: string): boolean {
    const keywords = [
      'sent', 'received', 'credited', 'debited', 'deposited',
      'paid', 'withdrawn', 'payment', 'transfer', 'transferred',
      'purchase', 'purchased', 'successfully', 'transaction', 'added'
    ];
  
    const accountKeywords = [
      'a/c', 'account', 'bank', 'upi', 'imps', 'neft', 'rtgs', 'via', 'to', 'from'
    ];
  
    const lowerContent = content.toLowerCase();
    const hasKeyword = keywords.some(k => lowerContent.includes(k));
    const hasAccountContext = accountKeywords.some(k => lowerContent.includes(k));
  
    return hasKeyword && hasAccountContext;
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
      'purchase', 'purchased', 'recharged', 'added'
    ];
  
    const lowerContent = content.toLowerCase();
    const keyword = keywords.find(k => lowerContent.includes(k));
  
    // Look for phrases like 'to <person>', 'at <merchant>', 'for <purpose>'
    const postContextRegex = /\b(?:to|at|for)\s+([A-Za-z0-9 &.-]{2,40})/i;
    const postContextMatch = content.match(postContextRegex);
  
    if (postContextMatch) {
      return `${postContextMatch[0]}`.trim();
    }
  
    // Fallback: capture sentence starting from keyword
    if (keyword) {
      const keywordRegex = new RegExp(
        `(?:.{0,30})(${keyword}[^.!\n]{0,100})`,
        'i'
      );
      const keywordMatch = content.match(keywordRegex);
      if (keywordMatch?.[1]) {
        return keywordMatch[1].trim();
      }
    }
  
    // Fallback: first 50 characters
    return content.slice(0, 50).trim();
  }
  
  
}
