import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: 'seasons/:id',
    loadChildren: () => import('./page/season/season.module').then(m => m.SeasonModule),
    canActivate: [AuthGuard]
  },
  { path: 'poll',
    loadChildren: () => import('./page/poll/poll.module').then(m => m.PollModule),
    canActivate: [AuthGuard]
  },
  { path: 'edit',
    loadChildren: () => import('./page/edit/edit.module').then(m => m.EditModule),
    canActivate: [AuthGuard]
  },
  { path: 'hole',
    loadChildren: () => import('./page/hole/hole.module').then(m => m.HoleModule),
    canActivate: [AuthGuard]
  },
  { path: 'user',
    loadChildren: () => import('./page/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  { path: 'game',
    loadChildren: () => import('./page/game/game.module').then(m => m.GameModule),
    canActivate: [AuthGuard]
  },
  { path: 'games',
    loadChildren: () => import('./page/games/games.module').then(m => m.GamesModule),
    canActivate: [AuthGuard]
  },
  { path: '', component: HomeComponent },
  { path: 'chats/:id', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
