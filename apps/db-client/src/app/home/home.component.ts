import { Component, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'

interface SignInResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
  }
  token?: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
})
export class HomeComponent {
  private fb = inject(FormBuilder)
  private http = inject(HttpClient)

  signInForm: FormGroup
  loading = false

  constructor() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.loading = true
      const formData = this.signInForm.value

      this.http
        .post<SignInResponse>('http://localhost:3000/api/auth/signin', formData)
        .subscribe({
          next: (response) => {
            console.log('Sign-in Response:', response)
            if (response.success) {
              console.log('Sign-in successful!', response.user)
            } else {
              console.log('Sign-in failed:', response.message)
            }
            this.loading = false
          },
          error: (error) => {
            console.error('API Error:', error)
            this.loading = false
          },
        })
    } else {
      this.markFormGroupTouched()
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.signInForm.controls).forEach((key) => {
      const control = this.signInForm.get(key)
      control?.markAsTouched()
    })
  }

  get email() {
    return this.signInForm.get('email')
  }
  get password() {
    return this.signInForm.get('password')
  }
}
