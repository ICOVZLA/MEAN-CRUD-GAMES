import { Component, OnInit, HostBinding } from '@angular/core';
import { Game } from 'src/app/models/games';

import { GamesService } from 'src/app/services/games.service';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent implements OnInit {

  @HostBinding('class') clases = 'row';

  game: Game = {
    id: 0,
    title: '',
    description: '',
    image: '',
    created_at: new Date()
  };

  edit: boolean = false;

  constructor(private gameService: GamesService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if (params.id) {
      this.gameService.getGame(params.id)
        .subscribe(
          res => {
            console.log(res);
            this.game = res;
            this.edit = true;
          },
          err => console.log(err)
        )
    }
  }

  saveNewGame() {
    // delete this.game.created_at;
    delete this.game.id;
    this.gameService.saveGame(this.game)
      .subscribe(
        res => {
          console.log(res);
          Swal.fire({
              position: 'center',
              type: 'success',
              title: 'Juego Guardado Exitosamente!',
              showConfirmButton: true,
              timer: 1500
            })
          this.router.navigate(['/games']);
        },
        err => console.error(err)
      )
  }

  updateGame() {
       Swal.fire({
          title: 'Estas Seguro de Editar este Juego?',
          text: "No se puede Revertir Este proceso!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'green',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si,  Editar!'
        }).then((result) => {
          if (result.value) {
                delete this.game.created_at;
                 this.gameService.updateGame(this.game.id, this.game)
                  .subscribe(
                     res => { 
                       console.log(res);
                       this.router.navigate(['/games']);
                     },
                     err => console.error(err)
                   )
            Swal.fire(
              'Editado!',
              'Juego Editado Exitosamente!',
              'success'
            )
          }
        })
  }
}
