import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public sort: string;
  public games: Array<Game> = [];
  public currentPage: any = 1;
  public showLoading: boolean = true;
  private routeSub: Subscription;
  private gameSub: Subscription;

  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if(params['game-search']) {
        this.searchGames('metacrit', this.currentPage, params['game-search']);
      } else {
        this.searchGames('metacrit', this.currentPage);
      }
    });
  }

  searchGames(sort: string, currentPage?: string, search?: string): void { 
    this.gameSub = this.httpService
      .getGameList(this.sort, this.currentPage, search)
      .subscribe((gameList: APIResponse<Game>) => {
        if(gameList) {
          this.games = gameList.results;
          this.showLoading = false;
        }
        // console.log(gameList);
      });
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }

  changeToPreviousPage(): void {

    this.showLoading = true;

    if (this.currentPage === 1) {
      console.log('blocked button');
    } else {
      this.currentPage--;
      this.ngOnInit();
    }
  }

  changeToNextPage(): void {
    this.showLoading = true;
    this.currentPage++;
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    if(this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if(this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
