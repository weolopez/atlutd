import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AuthService } from '../../services/auth.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap, timeout } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { ViewChild } from '@angular/core';

declare const Chess:any;
declare const $:any;

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements AfterViewInit{
  whiteSquareGrey = '#a9a9a9'
  blackSquareGrey = '#696969'
  position;
  // @ViewChild('board') board: ChessboardComponent; 
  game
  constructor() {
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{this.init()}, 5000);
  }
  init() {
    this.game = new Chess();

    var config = {
      draggable: true,
      position: 'start',
      onDragStart: this.onDragStart,
      onDrop: this.onDrop,
      onMouseoutSquare: this.onMouseoutSquare,
      onMouseoverSquare: this.onMouseoverSquare,
      onSnapEnd: this.onSnapEnd
    }
    // game.load(config.position)
    this.game.load('4r3/8/2p2PPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45')
    this.onSnapEnd()

  }

  removeGreySquares() {
    $('#myBoard .square-55d63').css('background', '')
  }

  greySquare(square) {
    var $square = $('#myBoard .square-' + square)

    var background = this.whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
      background = this.blackSquareGrey
    }

    $square.css('background', background)
  }

  onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (this.game.game_over()) return false

    // or if it's not that side's turn
    if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

  onDrop(source, target) {
    this.removeGreySquares()

    // see if the move is legal
    var move = this.game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
    else {
      this.highlightForSquare(null)
    }
  }
  highlightForSquare(turn) {
    if (turn) this.game.turn = turn;
    let pieces = this.position;
      Object.keys(pieces).forEach(square => {
        this.onMouseoverSquare(square, "queen");
      })
  }

  onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    var moves = this.game.moves({
      square: square,
      verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    this.greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      this.greySquare(moves[i].to)
    }
  }

  onMouseoutSquare(square, piece) {
    this.removeGreySquares()
  }

  onSnapEnd() {
    this.position(this.game.fen())
  }

}