import { PollModule } from './page/poll/poll.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectLoggedInToItems = redirectUnauthorizedTo(['home']);

const routes: Routes = [
  { path: 'poll',
    loadChildren: () => import('./page/poll/poll.module').then(m => m.PollModule),
    ...canActivate(redirectLoggedInToItems)
  },
  { path: 'edit',
    loadChildren: () => import('./page/teams/teams.module').then(m => m.TeamsModule),
    ...canActivate(redirectLoggedInToItems)
  },
  { path: 'user',
    loadChildren: () => import('./page/user/user.module').then(m => m.UserModule),
    ...canActivate(redirectLoggedInToItems)
  },
  { path: 'games/:id',
    loadChildren: () => import('./page/game/game.module').then(m => m.GameModule),
    ...canActivate(redirectLoggedInToItems)
  },
  { path: 'games',
    loadChildren: () => import('./page/games/games.module').then(m => m.GamesModule),
    ...canActivate(redirectLoggedInToItems)
  },
  { path: '', component: HomeComponent },
  { path: 'chats/:id', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
