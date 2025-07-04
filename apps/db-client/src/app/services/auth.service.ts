import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false)

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  checkAuthentication(): Observable<boolean> {
    return this.http.head('http://localhost:3000/api/auth/check').pipe(
      map(() => {
        this.isAuthenticatedSubject.next(true)
        return true
      }),
      catchError(() => {
        this.isAuthenticatedSubject.next(false)
        return of(false)
      })
    )
  }

  signOut(): Observable<unknown> {
    return this.http.post('http://localhost:3000/api/auth/signout', {}).pipe(
      map((response) => {
        this.isAuthenticatedSubject.next(false)
        return response
      })
    )
  }

  setAuthenticated(status: boolean): void {
    this.isAuthenticatedSubject.next(status)
  }
}
