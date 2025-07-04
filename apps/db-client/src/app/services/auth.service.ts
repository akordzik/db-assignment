import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, catchError, shareReplay } from 'rxjs/operators'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false)
  private authCheckCache: Observable<boolean> | null = null

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  checkAuthentication(): Observable<boolean> {
    if (this.authCheckCache) {
      return this.authCheckCache
    }

    this.authCheckCache = this.http
      .head('http://localhost:3000/api/auth/check')
      .pipe(
        map(() => {
          this.isAuthenticatedSubject.next(true)
          return true
        }),
        catchError(() => {
          this.isAuthenticatedSubject.next(false)
          return of(false)
        }),
        shareReplay(1)
      )

    return this.authCheckCache
  }

  signOut(): Observable<unknown> {
    return this.http.post('http://localhost:3000/api/auth/signout', {}).pipe(
      map((response) => {
        this.isAuthenticatedSubject.next(false)
        this.clearAuthCache()
        return response
      })
    )
  }

  setAuthenticated(status: boolean): void {
    this.isAuthenticatedSubject.next(status)
    this.clearAuthCache()
  }

  private clearAuthCache(): void {
    this.authCheckCache = null
  }
}
