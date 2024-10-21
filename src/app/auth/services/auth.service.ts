import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.loginUrl;
  private userSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) { }

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  // Método para cerrar sesión (simplemente removemos el token)
  logout() {
    this.clearUser();
    this.router.navigate(['/login']);
  }

  // Guardar el token de autenticación
  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  // Recuperar el token guardado
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

    // Observable que expone los datos del usuario.
    public user$: Observable<Usuario | null> = this.userSubject.asObservable();

    // Método para establecer o actualizar el usuario y guardarlo en sesionStorage.
    setUser(user: Usuario): void {
      sessionStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    }
  
    // Método para cerrar sesión y limpiar los datos.
    clearUser(): void {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      this.userSubject.next(null);
    }

    // Recuperar el usuario desde sesionStorage.
  private getUserFromStorage(): Usuario | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
