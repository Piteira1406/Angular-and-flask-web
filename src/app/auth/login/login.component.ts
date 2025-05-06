// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Login failed';
          this.loading = false;
        }
      });
    }
  }

  // login(credentials: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
  //     tap(response => {

  //       localStorage.setItem('currentUser', JSON.stringify(response));
  //     })
  //   );
  // }


}