import { Component, inject } from '@angular/core'
import { RouterModule, Router, NavigationEnd } from '@angular/router'
import { CommonModule } from '@angular/common'
import { filter, map, startWith } from 'rxjs/operators'

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'db-client'
  private router = inject(Router)
  
  showNavigation$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.url !== '/'),
    startWith(this.router.url !== '/')
  )
}
