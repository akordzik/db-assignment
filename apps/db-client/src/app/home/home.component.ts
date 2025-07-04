import { Component, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { ConfigService } from '../services/config.service'
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { SignInResponse, SignInDto } from '@deskbird/interfaces'

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
  private router = inject(Router)
  private authService = inject(AuthService)
  private configService = inject(ConfigService)

  signInForm: FormGroup<{
    [K in keyof SignInDto]: FormControl<SignInDto[K]>
  }>
  loading = false

  constructor() {
    this.signInForm = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
    })
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.loading = true
      const formData = this.signInForm.getRawValue()

      this.http
        .post<SignInResponse>(
          `${this.configService.apiBaseUrl}/auth/signin`,
          formData
        )
        .subscribe({
          next: (response) => {
            this.loading = false
            this.authService.saveUserToStorage(response.user)
            this.authService.setAuthenticated(true)
            this.router.navigate(['/users'])
          },
          error: () => {
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
