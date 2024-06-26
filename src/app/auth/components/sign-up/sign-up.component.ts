import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormInputWithErrorComponent } from '../../../shared/components/form-input-with-error/form-input-with-error.component';
import { ButtonWithoutIconComponent } from '../../../shared/components/button-without-icon/button-without-icon.component';
import { CustomValidators } from '../../custom-validators';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    FormInputWithErrorComponent,
    ButtonWithoutIconComponent,
    RouterModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  public signupForm: FormGroup;
  public sending: boolean = false;
  public sendSuccessful = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, CustomValidators.emailValidator]],
        password: [
          '',
          [Validators.required, CustomValidators.passwordLengthValidator(8)],
        ],
        passwordRepeat: ['', Validators.required],
        privacyPolicy: [false, Validators.requiredTrue],
      },
      { validators: [CustomValidators.passwordMatchValidator] }
    );
  }

  /**
   * Getter method for the 'username' form control.
   *
   * @returns The 'username' form control.
   */
  get username() {
    return this.signupForm.get('username');
  }

  /**
   * Getter method for the 'email' form control.
   *
   * @returns The 'email' form control.
   */
  get email() {
    return this.signupForm.get('email');
  }

  /**
   * Getter method for the 'password' form control.
   *
   * @returns The 'password' form control.
   */
  get password() {
    return this.signupForm.get('password');
  }

  /**
   * Getter method for the 'passwordRepeat' form control.
   *
   * @returns The 'passwordRepeat' form control.
   */
  get passwordRepeat() {
    return this.signupForm.get('passwordRepeat');
  }

  /**
   * Getter method for the 'privacyPolicy' form control.
   *
   * @returns The 'privacyPolicy' form control.
   */
  get privacyPolicy() {
    return this.signupForm.get('privacyPolicy');
  }

  /**
   * Registers a new user.
   * If the signup form is valid, it sets 'sending' to true to indicate sending is in progress,
   * then tries to register a new user using the provided username, email, password, and password repeat.
   * If successful, it sets 'sending' to false and 'sendSuccessful' to true.
   * If an error occurs during the registration process, it logs the error to the console and sets 'sending' to false.
   * If the signup form is invalid, it marks all form controls as touched to display validation errors.
   */
  async signup() {
    if (this.signupForm.valid) {
      this.sending = true;
      try {
        this.authService.registerUser(
          this.username?.value,
          this.email?.value,
          this.password?.value,
          this.passwordRepeat?.value
        );
        this.sending = false;
        this.sendSuccessful = true;
      } catch (err) {
        console.error(err);
        this.sending = false;
      }
    } else this.signupForm.markAllAsTouched();
  }
}
