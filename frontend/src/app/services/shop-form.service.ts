import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';
import { globalVariables } from '../config/globals';

@Injectable({
  providedIn: 'root',
})
export class ShopFormService {
  private countriesUrl = `${globalVariables.REST_URL}/api/countries`;
  private statesUrl = `${globalVariables.REST_URL}/api/states`;

  constructor(private httpClient: HttpClient) {}

  public getCreditCardMonths(startMonth: number): Observable<number[]> {
    function* gen() {
      while (startMonth <= 12) {
        yield startMonth++;
      }
    }

    return of([...gen()]);
  }

  public getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  public getStates(countryCode: string): Observable<State[]> {
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient
      .get<GetResponseStates>(searchUrl)
      .pipe(map((response) => response._embedded.states));
  }

  public getCreditCardYears(): Observable<number[]> {
    function* gen() {
      let startYear = new Date().getFullYear();
      const endYear = startYear + 10;

      while (startYear <= endYear) {
        yield startYear++;
      }
    }

    return of([...gen()]);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
