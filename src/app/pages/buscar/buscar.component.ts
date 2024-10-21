import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Habilidades } from 'src/app/interfaces/habilidades.interface';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  // Propiedades para almacenar datos del Pokémon
  nombrePokemon: string = '';
  imgPokemon: any;
  habilidades: any;
  descripcion: any;
  especie?: Habilidades;
  noExiste = false; 
  textoBuscar = ''; 
  imgAnimated: any;

  // Constructor: inicializa el servicio y la ruta activa
  constructor(private pokemonSvc: PokemonService, private activatedRoute: ActivatedRoute) {
    // Suscripción a los parámetros de la ruta activa
    this.activatedRoute.params.subscribe(params => {
      this.noExiste = false; // Reinicia el estado de no existir
      this.textoBuscar = params['texto']; // Obtiene el texto de búsqueda

      console.log(this.textoBuscar); // Muestra el texto de búsqueda en consola

      // Llama al servicio para obtener los detalles del Pokémon
      this.pokemonSvc.getPokemonDetail(this.textoBuscar).subscribe({
        next: (pokemon) => {
          // Obtiene la imagen animada del Pokémon
          this.imgAnimated = pokemon.sprites.versions?.['generation-v']['black-white'].animated?.front_default;
          console.log(this.imgAnimated); // Muestra la imagen animada en consola

          // Asigna la imagen y nombre del Pokémon
          this.imgPokemon = pokemon.sprites.other?.['official-artwork'].front_default;
          this.nombrePokemon = pokemon.name;

          // Obtiene las habilidades del Pokémon
          this.habilidades = pokemon.species;

          // Llama al servicio para obtener detalles de las habilidades
          this.pokemonSvc.getHabildades(this.habilidades.url).subscribe((res: Habilidades) => {
            // Busca la categoría del Pokémon en español
            for (let i = 0; i < res.genera.length; i++) {
              const element1 = res.genera[i];
              if (element1.language.name == 'es') {
                this.especie = element1.genus; // Asigna la especie en español
              }
            }

            // Busca la descripción del Pokémon en español
            for (let i = 0; i < res.flavor_text_entries.length; i++) {
              const element = res.flavor_text_entries[i];
              if (element.language.name == 'es') {
                this.descripcion = element.flavor_text; // Asigna la descripción
              }
            }
          });
        },
        error: () => {
          this.noExiste = true; // Cambia el estado si no existe el Pokémon
        }
      });
    });
  }

  ngOnInit(): void {
    // Método del ciclo de vida del componente, se puede usar para inicializaciones adicionales
  }
}
