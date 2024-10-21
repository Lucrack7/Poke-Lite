import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Habilidades } from 'src/app/interfaces/habilidades.interface';
import { PokemonDetails } from 'src/app/interfaces/pokemon.interface';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  // Propiedades del componente
  nombrePokemon: string = ''; // Nombre del Pokémon
  imgPokemon: any; // Imagen del Pokémon
  habilidades: string[] = []; // Habilidades del Pokémon
  evoluciones: { name: string, types: string[], level: number }[] = []; // Evoluciones del Pokémon
  tipos: string[] = []; // Tipos del Pokémon
  nivel: number = 0; // Nivel del Pokémon
  descripcion: any; // Descripción del Pokémon
  especie?: Habilidades; // Especie del Pokémon
  loading: boolean = true; // Estado de carga
  mostrarEvolucion: boolean = false; // Control para mostrar evoluciones
  editar: boolean = false; // Control para el modo de edición
  nuevoTipo: string = ''; // Nuevo tipo a agregar
  nuevaEvolucion: string = ''; // Nueva evolución a agregar
  base_experience: number = 0;

  // Constructor: inyecta el servicio de Pokémon y la ruta activa
  constructor(private pokemonSvc: PokemonService, private activatedRoute: ActivatedRoute) { }

  // Método del ciclo de vida que se ejecuta al iniciar el componente
  ngOnInit(): void {
    const { nombre } = this.activatedRoute.snapshot.params; // Obtiene el nombre del Pokémon de los parámetros de la ruta

    // Obtiene los detalles del Pokémon
    this.pokemonSvc.getPokemonDetail(nombre).subscribe((pokemon: PokemonDetails) => {
      this.nombrePokemon = pokemon.name; // Asigna el nombre del Pokémon
      this.imgPokemon = pokemon.sprites.other?.['official-artwork'].front_default; // Asigna la imagen del Pokémon
      this.base_experience = pokemon.base_experience;

      // Obtener habilidades
      this.pokemonSvc.getHabildades(pokemon.species.url).subscribe((res: Habilidades) => {
        this.habilidades = [];
          
        this.descripcion = res.flavor_text_entries.find(entry => entry.language.name === 'es')?.flavor_text || ''; // Obtiene la descripción en español
        this.especie = res.genera.find(gen => gen.language.name === 'es')?.genus || ''; // Obtiene la especie en español

        // Obtener tipos del Pokémon
        this.tipos = pokemon.types.map(type => type.type.name); // Mapea los tipos del Pokémon
        this.loading = false; // Cambia el estado de carga
      });
    });
  }

  // Método para alternar la visualización de evoluciones
  toggleEvolucion(): void {
    this.mostrarEvolucion = !this.mostrarEvolucion;
  }

  // Método para alternar el modo de edición
  toggleEdicion(): void {
    this.editar = !this.editar;
  }

  // Método para agregar un nuevo tipo
  agregarTipo(): void {
    if (this.nuevoTipo.trim() && !this.tipos.includes(this.nuevoTipo)) {
      this.tipos.push(this.nuevoTipo); // Agrega el nuevo tipo a la lista
      this.nuevoTipo = ''; // Limpia el campo
    }
  }

  // Método para eliminar un tipo
  eliminarTipo(tipo: string): void {
    this.tipos = this.tipos.filter(t => t !== tipo); // Filtra el tipo a eliminar
  }

  // Método para agregar una nueva evolución
  agregarEvolucion(): void {
    if (this.nuevaEvolucion.trim()) {
      this.evoluciones.push({ name: this.nuevaEvolucion, types: [], level: 0 }); // Agrega la nueva evolución
      this.nuevaEvolucion = ''; // Limpia el campo
    }
  }

  // Método para agregar un nuevo Pokémon a la base de datos
  agregarPokemonNuevo(): void {
    const nuevoPokemon = {
      name: this.nombrePokemon,
      url: '', // La URL puede ser opcional
    };
    this.pokemonSvc.agregarPokemon(nuevoPokemon); // Llama al servicio para agregar el Pokémon
  }

  // Método para editar un Pokémon existente
  editarPokemon(): void {
    const cambios = {
      name: this.nombrePokemon,
      types: this.tipos, // Tipos actualizados
      evoluciones: this.evoluciones, // Evoluciones actualizadas
    };
    this.pokemonSvc.editarPokemon(this.nombrePokemon, cambios); // Llama al servicio para editar el Pokémon
  }
}
