import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderHistory } from '../common/order-history';
import { globalVariables } from '../config/globals';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private ordersUrl = `${globalVariables.REST_URL}/api/orders`;

  constructor(private httpClient: HttpClient) {}

  public getProductCategories(email: string): Observable<OrderHistory[]> {
    const orderHistoryUrl = `${this.ordersUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.httpClient
      .get<GetOrdersHistoryResponse>(orderHistoryUrl)
      .pipe(map((response) => response._embedded.orders));
  }
}

interface GetOrdersHistoryResponse {
  _embedded: {
    orders: OrderHistory[];
  };
}
