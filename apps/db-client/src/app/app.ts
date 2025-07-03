import { Component, inject, OnInit } from '@angular/core'
import { RouterModule, Router, NavigationEnd } from '@angular/router'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { AuthService } from './services/auth.service'
import { filter, map, startWith } from 'rxjs/operators'

@Component({
  imports: [RouterModule, CommonModule, ButtonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'db-client'
  private router = inject(Router)
  private authService = inject(AuthService)

  showNavigation$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.url !== '/'),
    startWith(this.router.url !== '/')
  )

  isAuthenticated$ = this.authService.isAuthenticated$

  ngOnInit() {
    this.authService.checkAuthentication().subscribe()
  }

  logout() {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: () => {
        this.router.navigate(['/'])
      },
    })
  }
}
