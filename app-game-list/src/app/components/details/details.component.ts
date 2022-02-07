import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  gameId: string;
  game: Game;
  routeSub: Subscription;
  gameSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe( (params: Params) => {
      this.gameId = params.id;      
      this.getGameDetails(this.gameId);
    });
  }

  getGameDetails(gameId: string): void {
    this.gameSub = this.httpService
      .findGameById(gameId)
      .subscribe( (gameResponse: Game) => {
        this.game = gameResponse;
        console.log(this.game);
        
      })
  }

}
