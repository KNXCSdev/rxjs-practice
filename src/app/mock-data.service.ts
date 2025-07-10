import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  public charactersLoader$ = new BehaviorSubject<boolean>(false);
  public planetsLoader$ = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

  getCharacters(searchTerm?: string): Observable<any> {
    this.charactersLoader$.next(true);

    const queryParams: string = searchTerm
      ? `search?q=${searchTerm}`
      : 'get?artist_name=Borislav+Slavov&track_name=I+Want+to+Live&album_name=Baldur%27s+Gate+3+(Original+Game+Soundtrack)&duration=233';

    return this.httpClient
      .get<any>(`https://lrclib.net/api/${queryParams}`)
      .pipe(finalize(() => this.charactersLoader$.next(false)))
      .pipe(map((response) => response.results));
  }

  getPlatents(searchTerm?: string): Observable<any> {
    this.planetsLoader$.next(true);
    const queryParams: string = searchTerm
      ? `search?track_name=${searchTerm}`
      : 'get?artist_name=Jeremy+Soule&track_name=Dragonborn&album_name=The+Elder+Scrolls+V:+Skyrim:+Original+Game+Soundtrack&duration=236';
    return this.httpClient
      .get<any>(`https://lrclib.net/api/${queryParams}`)
      .pipe(finalize(() => this.planetsLoader$.next(false)))
      .pipe(map((response) => response.results));
  }

  getCharactersLoader(): Observable<boolean> {
    return this.charactersLoader$;
  }

  getPlanetLoader(): Observable<boolean> {
    return this.planetsLoader$;
  }
}
