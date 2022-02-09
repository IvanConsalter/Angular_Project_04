import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { APIResponse, Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  getGameList(ordering: string, search?: string): Observable<APIResponse<Game>> {

    let params = new HttpParams().set('ordering', ordering);

    if(search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params
    });
  }

  findGameById(gameId: string): any {

    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${gameId}`);
    const gameTrailesrRequest = this.http.get(`${env.BASE_URL}/games/${gameId}/movies`);
    const gameScreenchotsRequest = this.http.get(`${env.BASE_URL}/games/${gameId}/screenshots`);
    
    return forkJoin({
      gameInfoRequest,
      gameTrailesrRequest,
      gameScreenchotsRequest
    })
      .pipe(
        map( (response: any) => {
          console.log(response);
          return {
            ...response.gameInfoRequest,
            screenshots: response.gameScreenchotsRequest?.results,
            trailers: response.gameTrailesrRequest?.results,
          }
        })
      )
    
    
    
  }
}
