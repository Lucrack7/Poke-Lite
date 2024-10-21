import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { BuscarComponent } from './buscar/buscar.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { PipesModule } from '../pipes/pipes.module';
import { LoginComponent } from '../auth/services/login/login.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    BuscarComponent,
    PokemonComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule
  ]
})
export class PagesModule { }
