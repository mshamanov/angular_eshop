package me.shamanov.ecommerce.service;

import me.shamanov.ecommerce.dto.Purchase;
import me.shamanov.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
