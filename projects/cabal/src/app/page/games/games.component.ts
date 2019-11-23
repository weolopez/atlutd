import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from '@firebase/util';
import { FireService } from '../../services/fire.service';
import { AuthService } from '../../services/auth.service';

export interface Item { name: string; }

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Item>;
  public items: Observable<any[]>;

  public seatPick: any;
  public Obj = Object;
  public id;
  public user;
  public gamez = [
    {
      "href": "/rosters/2019/atlanta-united",
      "name": "Atlanta United FC"
    },
    {
      "href": "/rosters/2019/chicago-fire",
      "name": "Chicago Fire"
    },
    {
      "href": "/rosters/2019/fc-cincinnati",
      "name": "FC Cincinnati"
    },
    {
      "href": "/rosters/2019/colorado-rapids",
      "name": "Colorado Rapids"
    },
    {
      "href": "/rosters/2019/columbus-crew-sc",
      "name": "Columbus Crew SC"
    },
    {
      "href": "/rosters/2019/fc-dallas",
      "name": "FC Dallas"
    },
    {
      "href": "/rosters/2019/dc-united",
      "name": "D.C. United"
    },
    {
      "href": "/rosters/2019/houston-dynamo",
      "name": "Houston Dynamo"
    },
    {
      "href": "/rosters/2019/lafc",
      "name": "Los Angeles Football Club"
    },
    {
      "href": "/rosters/2019/la-galaxy",
      "name": "LA Galaxy"
    },
    {
      "href": "/rosters/2019/minnesota-united",
      "name": "Minnesota United FC"
    },
    {
      "href": "/rosters/2019/montreal-impact",
      "name": "Montreal Impact"
    },
    {
      "href": "/rosters/2019/new-england-revolution",
      "name": "New England Revolution"
    },
    {
      "href": "/rosters/2019/new-york-city-fc",
      "name": "New York City FC"
    },
    {
      "href": "/rosters/2019/new-york-red-bulls",
      "name": "New York Red Bulls"
    },
    {
      "href": "/rosters/2019/orlando-city",
      "name": "Orlando City SC"
    },
    {
      "href": "/rosters/2019/philadelphia-union",
      "name": "Philadelphia Union"
    },
    {
      "href": "/rosters/2019/portland-timbers",
      "name": "Portland Timbers"
    },
    {
      "href": "/rosters/2019/real-salt-lake",
      "name": "Real Salt Lake"
    },
    {
      "href": "/rosters/2019/san-jose-earthquakes",
      "name": "San Jose Earthquakes"
    },
    {
      "href": "/rosters/2019/seattle-sounders",
      "name": "Seattle Sounders FC"
    },
    {
      "href": "/rosters/2019/sporting-kansas-city",
      "name": "Sporting Kansas City"
    },
    {
      "href": "/rosters/2019/toronto-fc",
      "name": "Toronto FC"
    },
    {
      "href": "/rosters/2019/vancouver-whitecaps",
      "name": "Vancouver Whitecaps FC"
    }
  ];
  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    fs: FireService
  ) {
    this.items = fs.deepGetCollection('games');
    this.getUser();
  }

  ngOnInit() {
  }

  select(seat) {
    const game = {};
    game[`seats.${seat}.owner`] = '_users$' + this.user.uid;
    this.db.collection('games').doc(this.id)
      .update(game);
  }
  async getUser() {
    this.user = await this.auth.getUser();
  }
  getGamez() {
    this.gamez.forEach(game => {
      //       const response = await fetch('http://example.com/movies.json');
      // const myJson = await response.json();
      // console.log(JSON.stringify(myJson));
    })
  }
  getImg(game) {

    this.gamez.map(async game => {
      return this.fetchGame(game) 
    });

console.log(JSON.stringify(this.gamez));
  }
  async fetchGame(g) {
    let game = await fetch("https://www.mlssoccer.com/" + g.href);
    let html = await game.text();
    let elem = document.createElement("div");
    elem.innerHTML = html;

    let images = elem.getElementsByTagName("img");
    g.images = [];   
    for (var i = 0; i < images.length; i++) {
      if (images[i].src.startsWith('https://league-mp7static')) 
        g.images.push(images[i].src);
    }
    return g;
  }
  //     const response = fetch("https://www.mlssoccer.com/"+src).then(response => {
  //       let str = response.text().then( str => {
  //         var elem= document.createElement("div");
  // elem.innerHTML = str;

  // var images = elem.getElementsByTagName("img");

  // for(var i=0; i < images.length; i++){
  //   if (images[i].src.startsWith('https://league-mp7static')) console.log(images[i].src);   
  // }
  //       });
  //     });
}
