import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  input$ = new BehaviorSubject('');

  liveSearch() {
    this.input$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) => this.mockSearch(query))
      )
      .subscribe((result) => console.log('Search result:', result));
  }

  changeCharactersInput(element: any): void {
    const inputValue: string = element.target.value;

    this.input$.next(inputValue);
  }

  mockSearch(query: string) {
    return of(`Results for "${query}"`).pipe();
  }
}
