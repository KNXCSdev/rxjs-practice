import { Injectable } from '@angular/core';
import { CountriesService } from './countries.service';
import { BehaviorSubject, finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesStoreService {
  countries$$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  countries$ = this.countries$$.asObservable();

  isLoading$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  constructor(private countriesService: CountriesService) {}

  getAllCountries() {
    this.isLoading$$.next(true);
    this.countriesService
      .getAllCountries()
      .pipe(
        tap((countries) => {
          this.countries$$.next(countries);
        }),
        finalize(() => {
          this.isLoading$$.next(false);
        })
      )
      .subscribe();
  }

  getCountriesByName(name: string) {
    this.isLoading$$.next(true);
    this.countriesService
      .getCountriesByName(name)
      .pipe(
        tap((countries) => {
          this.countries$$.next(countries);
        }),
        finalize(() => {
          this.isLoading$$.next(false);
        })
      )
      .subscribe();
  }
}
