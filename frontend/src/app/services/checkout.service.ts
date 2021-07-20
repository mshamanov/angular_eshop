import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { globalVariables } from '../config/globals';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = `${globalVariables.REST_URL}/api/checkout/purchase`;

  constructor(private httpClient: HttpClient) {}

  public placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post(this.purchaseUrl, purchase);
  }
}
