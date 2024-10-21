import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { LoginComponent } from './auth/services/login/login.component';
import { AuthGuard } from './auth/services/guard/auth.guard';

const routes:Routes=[

  { path: 'login', component: LoginComponent },
  { path:'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path:'pokemon/:nombre', component: PokemonComponent, canActivate: [AuthGuard]},
  { path:'buscar/:texto', component: BuscarComponent, canActivate: [AuthGuard]},

  {path:'', pathMatch:'full', redirectTo:'/login'},
  {path:'**', pathMatch:'full', redirectTo:'/login'},
];

@NgModule({
  
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
