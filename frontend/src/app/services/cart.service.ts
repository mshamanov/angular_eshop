import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {
    // read data from storage

    const value = this.storage.getItem('cartItems');
    if (value) {
      const arr = JSON.parse(value);
      if (arr) {
        this.cartItems = arr;
        this.computeCartTotals();
      }
    }
  }

  public addToCart(cartItem: CartItem) {
    const foundItem = this.cartItems.find((item) => item.id === cartItem.id);

    if (foundItem) {
      foundItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  public incrementQuantity(cartItem: CartItem) {
    cartItem.quantity++;

    this.computeCartTotals();
  }

  public decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  public remove(cartItem: CartItem) {
    const foundIndex = this.cartItems.findIndex(
      (item) => item.id === cartItem.id
    );

    if (foundIndex > -1) {
      this.cartItems.splice(foundIndex, 1);
    }

    this.computeCartTotals();
  }

  public computeCartTotals() {
    const { totalPriceValue, totalQuantityValue } = this.cartItems.reduce(
      (acc, val) => {
        acc.totalPriceValue += val.unitPrice * val.quantity;
        acc.totalQuantityValue += val.quantity;
        return acc;
      },
      { totalPriceValue: 0, totalQuantityValue: 0 }
    );

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  public persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}
