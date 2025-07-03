import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { CardModule } from 'primeng/card'
import { User } from '@deskbird/interfaces'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient)
  users: User[] = []
  isLoading = true

  ngOnInit() {
    this.loadUsers()
  }

  private loadUsers() {
    this.http.get<User[]>('http://localhost:3000/api/users').subscribe({
      next: (users) => {
        this.users = users
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      },
    })
  }
}
