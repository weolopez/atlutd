import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectLoggedInToItems = redirectUnauthorizedTo(['home']);

const routes: Routes = [
  // { path: 'user',
  //   loadChildren: './page/user/user.module#UserModule',
  //   ...canActivate(redirectLoggedInToItems)
  // },
  { path: '', component: HomeComponent },
  { path: 'chats/:id', component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
