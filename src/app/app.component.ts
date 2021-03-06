import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as _ from 'lodash';

import { ICardInfo } from './core/interfaces';
import { PaymentService } from './core/services';
import { chargeData } from './core/utils/chargeData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  publicKey: string;
  cardInfo: ICardInfo;
  charge: any;
  loading = false;
  isValid = false;

  constructor(
      private paymentService: PaymentService,
      private matSnackBar: MatSnackBar,
  ) {
    this.publicKey = '2TQdje-6MfPE8-NSUa5B-B44w5K';
  }

  loadCardInfo(card: ICardInfo): void {
    const zip = _.get(card, 'zipCode');
    this.cardInfo = _.omit(card, ['zipCode']);
    this.charge = chargeData;
    this.charge.card = this.cardInfo;
    this.charge.billingAddress.zipCode = zip;
  }

  submitPayment(): void {
    if (this.cardInfo && this.isValid) {
      this.loading = true;
      this.paymentService.submitPayment(this.charge).then(response => {
        if (_.hasIn(response, 'errors') && !_.isNil(response.errors)) {
          const message = response.errors[0].message;
          this.matSnackBar.open(`There was an error sending the query. ${message}`, 'OK', {
            verticalPosition: 'top',
            duration: 5000,
          });
          this.loading = false;
        } else {
          const transaction = _.get(response.data, 'transactionId');
          this.matSnackBar.open(`Transaction ${transaction} Success`, 'OK', {
            verticalPosition: 'top',
            duration: 5000,
          });
          this.loading = false;
        }
      });
    }
  }
}
