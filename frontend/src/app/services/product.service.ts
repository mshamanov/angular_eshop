import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { globalVariables } from '../config/globals';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${globalVariables.REST_URL}/api`;
  private productsUrl = `${this.baseUrl}/products`;
  private categoriesUrl = `${this.baseUrl}/product-category`;

  constructor(private httpClient: HttpClient) {}

  public getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetProductCategoryResponse>(this.categoriesUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  public searchProductListPaginate(
    page: number,
    pageSize: number,
    searchValue: string
  ): Observable<GetProductResponse> {
    const findByNamePaginateUrl: string = `${this.productsUrl}/search/findByNameContainingIgnoreCase?name=${searchValue}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetProductResponse>(findByNamePaginateUrl);
  }

  public getProductListPaginate(
    page: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetProductResponse> {
    const findByCategoryPaginateUrl: string = `${this.productsUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetProductResponse>(findByCategoryPaginateUrl);
  }

  public getProduct(productId: string): Observable<Product> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetProductResponse {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetProductCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
