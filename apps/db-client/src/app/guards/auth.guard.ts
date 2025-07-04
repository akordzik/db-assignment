import { inject } from '@angular/core'
import { Router, type CanActivateFn } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { map, catchError } from 'rxjs/operators'
import { of } from 'rxjs'

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)
  const authService = inject(AuthService)

  return authService.checkAuthentication().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/'])
        return false
      }
      return true
    }),
    catchError(() => {
      router.navigate(['/'])
      return of(false)
    })
  )
}
