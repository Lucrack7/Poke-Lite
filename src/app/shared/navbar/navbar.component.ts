import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginUsuario } from 'src/app/interfaces/login.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ViewChild('txtBuscar') buscarInput!: ElementRef


  usuario: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Suscribirse al observable del servicio para obtener los datos del usuario.
    this.authService.user$.subscribe((user) => {
      this.usuario = user;
    });
  }

  regresar() {
    location.href = 'home';
  }

  buscar(texto: string) {
    texto = texto.trim().toLocaleLowerCase();
    console.log(texto);

    if (texto.length === 0) {
      return;
    } else {
      this.router.navigate(['buscar', texto]);
      this.buscarInput.nativeElement.value = '';
    }
  }

  cerrarSesion() {
    console.log('Cerrando sesión');
    this.authService.logout();
  }

}
