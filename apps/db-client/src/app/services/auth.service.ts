import { Injectable, inject, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, catchError, shareReplay } from 'rxjs/operators'
import { of } from 'rxjs'
import { isPlatformBrowser } from '@angular/common'
import { SignInResponse, UserRole } from '@deskbird/interfaces'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private platformId = inject(PLATFORM_ID)
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
          this.removeItemFromStorage('currentUser')
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
        this.removeItemFromStorage('currentUser')
        return response
      })
    )
  }

  setAuthenticated(status: boolean): void {
    this.isAuthenticatedSubject.next(status)
    this.clearAuthCache()
    if (!status) {
      this.removeItemFromStorage('currentUser')
    }
  }

  getCurrentUser(): Observable<{ id: string; email: string; name: string }> {
    return this.http.get<{ id: string; email: string; name: string }>(
      'http://localhost:3000/api/auth/me'
    )
  }

  getCurrentUserFromStorage(): SignInResponse['user'] | null {
    const userString = this.getItemFromStorage('currentUser')
    if (userString) {
      try {
        return JSON.parse(userString)
      } catch {
        return null
      }
    }
    return null
  }

  saveUserToStorage(user: SignInResponse['user']): void {
    this.setItemInStorage('currentUser', JSON.stringify(user))
  }

  private clearAuthCache(): void {
    this.authCheckCache = null
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId)
  }

  private setItemInStorage(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value)
    }
  }

  private getItemFromStorage(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key)
    }
    return null
  }

  private removeItemFromStorage(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key)
    }
  }
}
