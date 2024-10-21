import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from 'src/app/interfaces/pokemones.interface';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Lista de Pokémon
  pokemones: Pokemon[] = [];
  adelante = 0; // Control para paginación
  atras = 0; // Control para paginación
  btnActive = true; // Estado del botón de paginación
  mostrarPokemon: boolean = false; // Control para mostrar detalles del Pokémon
  nombrePokemon: string = ''; // Almacena el nombre del Pokémon seleccionado

  // Constructor: inicializa el servicio de Pokémon y el router
  constructor(private pokemosnSvc: PokemonService, private router: Router) { }

  // Método del ciclo de vida que se ejecuta al iniciar el componente
  ngOnInit(): void {
    localStorage.removeItem('Valor'); // Limpia el valor almacenado en localStorage

    // Obtiene la lista de Pokémon al inicializar
    this.pokemosnSvc.getPokemons().subscribe(res => {
      this.pokemones = res; // Asigna la respuesta a la lista de Pokémon
    });
  }

  // Método para manejar el clic en un Pokémon
  onclickPokemon(nombre: string) {
    this.pokemosnSvc.getPokemonDetail(nombre).subscribe(pokemon => {
      this.router.navigate(['/pokemon', pokemon.name]); // Navega a la ruta del Pokémon
      console.log(pokemon.name); // Muestra el nombre del Pokémon en consola
    });
  }

  // Método para paginar hacia adelante
  paginarNext() {
    this.adelante = 20; // Ajusta el contador para la paginación
    this.pokemosnSvc.getPaginacionNext(this.adelante).subscribe(res => {
      this.pokemones = res; // Actualiza la lista de Pokémon
    });
    localStorage.removeItem('Valor'); // Limpia el valor almacenado
    this.btnActive = false; // Desactiva el botón de paginación
  }

  // Método para paginar hacia atrás
  paginarPreviuos() {
    this.atras = 20; // Ajusta el contador para la paginación
    this.pokemosnSvc.getPaginacionPrevious(this.atras).subscribe(res => {
      this.pokemones = res; // Actualiza la lista de Pokémon
      console.log(res); // Muestra la respuesta en consola
      // Controla el estado del botón en función de un valor en localStorage
      if (localStorage.getItem('Valor') === 'detener') {
        this.btnActive = true; // Activa el botón
      }
    });
  }
}
