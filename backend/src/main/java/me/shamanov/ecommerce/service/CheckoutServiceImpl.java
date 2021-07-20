package me.shamanov.ecommerce.service;

import me.shamanov.ecommerce.dao.CustomerRepository;
import me.shamanov.ecommerce.dto.Purchase;
import me.shamanov.ecommerce.dto.PurchaseResponse;
import me.shamanov.ecommerce.entity.Customer;
import me.shamanov.ecommerce.entity.Order;
import me.shamanov.ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {
    private final CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = this.generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::addOrderItem);

        // populate order with shippingAddress and billingAddress
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();
        String email = customer.getEmail();

        Optional<Customer> customerFromDatabase = this.customerRepository.findByEmail(email);

        if (customerFromDatabase.isPresent()) {
            customer = customerFromDatabase.get();
        }

        customer.addOrder(order);

        // save to the database
        this.customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID number
        return UUID.randomUUID().toString();
    }
}
