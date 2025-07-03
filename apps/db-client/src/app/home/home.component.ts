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

      this.http.get('http://localhost:3000/api').subscribe({
        next: (response) => {
          console.log('API Response:', response)
          console.log('Sign in data:', formData)
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
