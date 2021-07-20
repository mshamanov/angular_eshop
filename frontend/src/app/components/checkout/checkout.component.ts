import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = this.formBuilder.group({});

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prepareForm();

    this.fillUserIfAuthenticated();

    const currentMonth = new Date().getMonth() + 1;

    this.shopFormService
      .getCreditCardMonths(currentMonth)
      .subscribe((months) => {
        this.creditCardMonths = months;
      });

    this.shopFormService
      .getCreditCardYears()
      .subscribe((years) => (this.creditCardYears = years));

    this.shopFormService
      .getCountries()
      .subscribe((countries) => (this.countries = countries));

    this.reviewCartDetails();
  }

  private fillUserIfAuthenticated() {
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');

    if (userName) {
      const split = JSON.parse(userName).split(' ');
      const firstName = split[0] || '';
      const lastName = split[1] || '';
      const email = userEmail ? JSON.parse(userEmail) : '';

      const customerGroup = this.checkoutFormGroup.get('customer');
      customerGroup?.get('firstName')?.setValue(firstName);
      customerGroup?.get('lastName')?.setValue(lastName);
      customerGroup?.get('email')?.setValue(email);
    }
  }

  private prepareForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}$'
          ),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });
  }

  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe((price) => (this.totalPrice = price));

    this.cartService.totalQuantity.subscribe(
      (qty) => (this.totalQuantity = qty)
    );
  }

  public onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    const orderItems = cartItems.map((item) => new OrderItem(item));

    // set up purchase
    const purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;

    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      (response) => {
        alert(
          `Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`
        );
        // reset cart
        this.resetCart();
      },
      (err) => {
        alert(`There was an error: ${err.message}`);
      }
    );
  }

  public resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
  }

  public copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  public handleMonthsAndYears() {
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(
      this.checkoutFormGroup.get('creditCard')?.value.expirationYear
    );

    let currentMonth: number;
    if (selectedYear === currentYear) {
      currentMonth = new Date().getMonth() + 1;
    } else {
      currentMonth = 1;
    }

    this.shopFormService
      .getCreditCardMonths(currentMonth)
      .subscribe((months) => (this.creditCardMonths = months));
  }

  public getStates(groupName: string) {
    const formGroup = this.checkoutFormGroup.get(groupName);
    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe((states) => {
      if (groupName === 'shippingAddress') {
        this.shippingAddressStates = states;
      } else {
        this.billingAddressStates = states;
      }

      formGroup?.get('state')?.setValue(states[0]);
    });
  }

  public get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  public get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  public get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  public get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  public get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  public get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  public get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  public get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  public get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  public get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  public get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  public get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  public get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  public get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  public get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  public get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  public get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
}
