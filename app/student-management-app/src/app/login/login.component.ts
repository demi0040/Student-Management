import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LoginService } from '../services/login.service';
import { ProfileService } from '../services/profile.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private loginService: LoginService,
    private profileService: ProfileService,
    private snackbarService: SnackbarService,
    private userService: UserService
  ) {}

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (username && password) {
        this.loginService.login(username, password).subscribe(
          (result) => {
            if (
              result.data &&
              result.data.getUser &&
              result.data.getUser.password === password
            ) {
              // Login successful
              this.userService.setCurrentUser(username);
              this.userService.setUserType(result.data.getUser.userType);

              this.router.navigate(['/profile']);
              this.snackbarService.showSnackbar(
                `${result.data.getUser.username} loged in successfully`,
                'Success'
              );
            } else {
              // Login failed
              this.snackbarService.showSnackbar('Login failed', 'Error');
            }
          },
          (error) => {
            console.error('Error in login', error);
            this.snackbarService.showSnackbar(
              'Login failed! Invalid username or password',
              'Error'
            );
          }
        );
      }
    } else {
      console.log('Form is not valid');
    }
  }
}
