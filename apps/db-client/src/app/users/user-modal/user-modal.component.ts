import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { User } from '@deskbird/interfaces'

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent implements OnInit {
  @Input() visible = false
  @Input() user: User | null = null
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() userSaved = new EventEmitter<{ email: string; name: string }>()

  email = ''
  name = ''
  isEditMode = false

  ngOnInit() {
    this.isEditMode = !!this.user
    if (this.user) {
      this.email = this.user.email
      this.name = this.user.name
    }
  }

  onHide() {
    this.visible = false
    this.visibleChange.emit(false)
    this.resetForm()
  }

  onSave() {
    if (this.email.trim() && this.name.trim()) {
      this.userSaved.emit({
        email: this.email.trim(),
        name: this.name.trim(),
      })
      this.onHide()
    }
  }

  private resetForm() {
    this.email = ''
    this.name = ''
    this.isEditMode = false
  }
}
