import { Route } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { UsersComponent } from './users/users.component'
import { authGuard } from './guards/auth.guard'
import { guestGuard } from './guards/guest.guard'

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
]
