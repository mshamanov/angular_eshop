package me.shamanov.ecommerce.dto;

import lombok.Data;
import me.shamanov.ecommerce.entity.Address;
import me.shamanov.ecommerce.entity.Customer;
import me.shamanov.ecommerce.entity.Order;
import me.shamanov.ecommerce.entity.OrderItem;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
