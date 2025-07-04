import { inject } from '@angular/core'
import { Router, type CanActivateFn } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { map, switchMap, take } from 'rxjs/operators'

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router)
  const authService = inject(AuthService)

  return authService.isAuthenticated$.pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['/users'])
        return [false]
      }
      return authService.checkAuthentication().pipe(
        map((authenticated) => {
          if (authenticated) {
            router.navigate(['/users'])
            return false
          }
          return true
        })
      )
    })
  )
}
