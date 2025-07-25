import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface CountriesResponse {
  population: number;
  name: { common: string };
  region: string;
  capital: string;
  flags: { svg: string };
}

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private httpClient: HttpClient) {}

  getAllCountries() {
    return this.httpClient.get<CountriesResponse[]>(
      'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital'
    );
  }

  getCountriesByName(name: string) {
    return this.httpClient.get<CountriesResponse[]>(
      `https://restcountries.com/v3.1/name/${name}?fields=name,flags,population,region,capital`
    );
  }
}
