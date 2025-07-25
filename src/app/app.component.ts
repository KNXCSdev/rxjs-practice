import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { MockDataService } from './mock-data.service';
import { CountriesStoreService } from './services/countries-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  searchTermByCharacters = new Subject<string>();
  charactersResults$!: Observable<any>;
  planetAndCharactersResults$!: Observable<any>;
  isLoading: boolean = false;
  subscriptions: Subscription[] = [];
  title = 'experimentation';
  countries$: Observable<any[]> = this.countriesStoreService.countries$;
  isLoading$: Observable<boolean> = this.countriesStoreService.isLoading$;
  searchTerm$ = new BehaviorSubject('');
  private destroy$ = new Subject<void>();

  constructor(
    private countriesStoreService: CountriesStoreService,
    private mockDataService: MockDataService
  ) {}

  ngOnInit() {
    this.initLoadingState();
    this.initCharacterEvents();
    this.searchTerm$
      .pipe(
        debounceTime(300),
        map((term) => term.toLowerCase().trim()),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        if (term) {
          this.countriesStoreService.getCountriesByName(term);
        } else {
          this.countriesStoreService.getAllCountries();
        }
      });

    const test$ = of(1, 2, 3);
    const test2$ = of('a', 'b', 'c');
    test$
      .pipe(
        mergeMap((num: any) => {
          return test2$.pipe(map((letter) => `${num}${letter}`));
        })
      )
      .subscribe((value) => {
        console.log(value);
      });
  }

  onSearch(event: any) {
    this.searchTerm$.next(event.target.value);
  }

  changeCharactersInput(element: any): void {
    // 1.1. Add functionality to changeCharactersInput method. Changes searchTermByCharacters Subject value on input change.
    const inputValue: string = element.target.value;
    // YOUR CODE STARTS HERE

    this.searchTermByCharacters.next(inputValue);

    // YOUR CODE ENDS HERE
  }

  initCharacterEvents(): void {
    // YOUR CODE STARTS HERE
    this.charactersResults$ = this.searchTermByCharacters.pipe(
      debounceTime(500),
      filter((value) => value.length <= 3),
      switchMap((value) => value)
    );
    // YOUR CODE ENDS HERE
  }

  loadCharactersAndPlanet(): void {
    // YOUR CODE STARTS HERE
    this.planetAndCharactersResults$ = forkJoin([
      this.mockDataService.getCharacters(),
      this.mockDataService.getPlatents(),
    ]).pipe(map(([characters, planets]) => [characters, planets]));
    // YOUR CODE ENDS HERE
  }

  initLoadingState(): void {
    // YOUR CODE STARTS HERE
    const subscription = combineLatest([
      this.mockDataService.getCharactersLoader(),
      this.mockDataService.getPlanetLoader(),
    ]).subscribe((val) => {
      this.isLoading = this.areAllValuesTrue(val);
    });
    // YOUR CODE ENDS HERE
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    // 5.2 Unsubscribe from all subscriptions
    // YOUR CODE STARTS HERE
    this.subscriptions.forEach((val) => val.unsubscribe());
    // YOUR CODE ENDS HERE
  }

  areAllValuesTrue(elements: boolean[]): boolean {
    return elements.every((el) => el);
  }
}
