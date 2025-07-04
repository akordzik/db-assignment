import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { TooltipModule } from 'primeng/tooltip'
import { ConfirmationService } from 'primeng/api'
import { SignInResponse, User } from '@deskbird/interfaces'
import { UserModalComponent } from './user-modal/user-modal.component'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ConfirmDialogModule,
    TooltipModule,
    UserModalComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient)
  private authService = inject(AuthService)
  private confirmationService = inject(ConfirmationService)

  users: User[] = []
  currentUser: SignInResponse['user'] | null = null
  isLoading = true
  showUserModal = false
  editingUser: User | null = null

  ngOnInit() {
    this.loadCurrentUser()
    this.loadUsers()
  }

  private loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUserFromStorage()
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

  onCreateUser() {
    this.editingUser = null
    this.showUserModal = true
  }

  onEditUser(user: User) {
    this.editingUser = user
    this.showUserModal = true
  }

  onUserSaved(userData: { email: string; name: string }) {
    if (this.editingUser) {
      this.http
        .patch<User>(`http://localhost:3000/api/users/${this.editingUser.id}`, {
          name: userData.name,
        })
        .subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(
              (u) => u.id === this.editingUser?.id
            )
            if (index !== -1) {
              this.users[index] = updatedUser
            }
            this.showUserModal = false
            this.editingUser = null
          },
          error: (error) => {
            console.error('Error updating user:', error)
          },
        })
    } else {
      this.http
        .post<User>('http://localhost:3000/api/users', userData)
        .subscribe({
          next: (newUser) => {
            this.users.push(newUser)
            this.showUserModal = false
          },
          error: (error) => {
            console.error('Error creating user:', error)
          },
        })
    }
  }

  onDeleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Delete <strong>${user.name}</strong>? This action cannot be undone.`,
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        this.http
          .delete(`http://localhost:3000/api/users/${user.id}`)
          .subscribe({
            next: () => {
              this.users = this.users.filter((u) => u.id !== user.id)
            },
            error: (error) => {
              console.error('Error deleting user:', error)
            },
          })
      },
    })
  }

  canDeleteUser(user: User): boolean {
    return this.currentUser ? user.email !== this.currentUser.email : false
  }

  isCurrentUserAdmin(): boolean {
    return this.currentUser?.role === 'admin'
  }
}
