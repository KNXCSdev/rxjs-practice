import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { MockDataService } from './mock-data.service';

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

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.initLoadingState();
    this.initCharacterEvents();
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
