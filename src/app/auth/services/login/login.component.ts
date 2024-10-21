import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginUsuario } from 'src/app/interfaces/login.interface';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  loginData!: LoginUsuario;
  showError: boolean = false;

  constructor(private authService: AuthService,  private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(){
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.showError = false;
        console.log('res', response);
        this.loginData = response;

        this.authService.setUser(this.loginData.user);

        this.authService.setToken(response.accessToken);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.showError = true;
        console.log(error);
      },
      complete: () => {
        console.log('Proceso de login completado');
        this.showError = false;
      }
    });
    
    //this.router.navigate(['/home']);
  }

}
