import { inject } from '@angular/core'
import { Router, type CanActivateFn } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import { of } from 'rxjs'

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router)
  const http = inject(HttpClient)

  return http.head('http://localhost:3000/api/auth/check').pipe(
    map(() => {
      router.navigate(['/users'])
      return false
    }),
    catchError(() => {
      return of(true)
    })
  )
}
