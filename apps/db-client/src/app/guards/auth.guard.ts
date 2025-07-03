import { inject } from '@angular/core'
import { Router, type CanActivateFn } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import { of } from 'rxjs'

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)
  const http = inject(HttpClient)

  return http.get('http://localhost:3000/api/auth/check').pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/'])
      return of(false)
    })
  )
}
