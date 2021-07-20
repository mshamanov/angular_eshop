import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchMode: boolean = false;
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = 'Books';

  // pagination
  availablePageSizes: number[] = [10, 15, 20, 25, 30];
  pageNumber: number = 1;
  pageSize: number = this.availablePageSizes[0];
  totalElements: number = 0;
  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.listProducts());
  }

  public listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  private handleSearchProducts() {
    const paramKeyword = this.route.snapshot.paramMap.get('keyword') || '';

    if (this.previousKeyword != paramKeyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = paramKeyword;

    this.productService
      .searchProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        paramKeyword
      )
      .subscribe(this.getProductData());
  }

  private handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      const paramId = this.route.snapshot.paramMap.get('id');
      const paramName = this.route.snapshot.paramMap.get('name');

      if (paramId && paramName) {
        this.currentCategoryId = +paramId;
        this.currentCategoryName = paramName;
      }
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductListPaginate(
        this.pageNumber - 1,
        this.pageSize,
        this.currentCategoryId
      )
      .subscribe(this.getProductData());
  }

  public updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  private getProductData(): any {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  public addToCart(product: Product) {
    this.cartService.addToCart(new CartItem(product));
  }
}
