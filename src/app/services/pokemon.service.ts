import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Habilidades } from '../interfaces/habilidades.interface';
import { PokemonDetails } from '../interfaces/pokemon.interface';
import { Pokemon, PokemonesResponse } from '../interfaces/pokemones.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseURL: string = environment.baseUrl; // URL base de la API
  private limitPage = 20; // Límite de Pokémon por página
  public offsetPage = 0; // Offset para la paginación

  private pokemonsDB: Pokemon[] = []; // Simula una base de datos de Pokémon

  constructor(private http: HttpClient) {}

  // Parámetros para la paginación
  get params() {
    return {
      limit: this.limitPage,
      offset: this.offsetPage
    }
  }

  // Obtener lista de Pokémon con paginación
  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<PokemonesResponse>(`${this.baseURL}/pokemon`, { params: this.params }).pipe(
      map(res => res.results), // Mapea los resultados a una lista de Pokémon
      catchError(error => {
        console.error('Error fetching Pokémon:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Obtener detalles de un Pokémon específico
  getPokemonDetail(nombre: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${this.baseURL}/pokemon/${nombre}`).pipe(
      catchError(error => {
        console.error(`Error fetching details for ${nombre}:`, error);
        return of({} as PokemonDetails); // Devuelve un objeto vacío en caso de error
      })
    );
  }

  // Obtener habilidades de un Pokémon
  getHabildades(url: string): Observable<Habilidades> {
    return this.http.get<Habilidades>(url).pipe(
      catchError(error => {
        console.error('Error fetching abilities:', error);
        return of({} as Habilidades); // Devuelve un objeto vacío en caso de error
      })
    );
  }

  // Agregar un nuevo Pokémon a la base de datos simulada
  agregarPokemon(pokemon: Pokemon): void {
    this.pokemonsDB.push(pokemon);
    console.log('Pokémon agregado a la base de datos:', pokemon);
  }

  // Editar información de un Pokémon existente en la "base de datos"
  editarPokemon(nombre: string, cambios: Partial<Pokemon>): void {
    const pokemonIndex = this.pokemonsDB.findIndex(p => p.name === nombre);
    if (pokemonIndex !== -1) {
      this.pokemonsDB[pokemonIndex] = {
        ...this.pokemonsDB[pokemonIndex],
        ...cambios // Aplica los cambios
      };
      console.log(`Pokémon ${nombre} editado con éxito:`, this.pokemonsDB[pokemonIndex]);
    } else {
      console.error('Pokémon no encontrado en la base de datos.');
    }
  }

  // Paginación - Siguiente
  getPaginacionNext(adelante: number): Observable<Pokemon[]> {
    this.offsetPage += adelante; // Incrementa el offset
    return this.http.get<PokemonesResponse>(`${this.baseURL}/pokemon`, { params: { limit: 20, offset: this.offsetPage } }).pipe(
      map(res => res.results), // Mapea los resultados
      catchError(error => {
        console.error('Error fetching next page:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Paginación - Anterior
  getPaginacionPrevious(atras: number): Observable<Pokemon[]> {
    this.offsetPage = Math.max(this.offsetPage - atras, 0); // Evita un offset negativo
    return this.http.get<PokemonesResponse>(`${this.baseURL}/pokemon`, { params: { limit: 20, offset: this.offsetPage } }).pipe(
      map(res => res.results), // Mapea los resultados
      catchError(error => {
        console.error('Error fetching previous page:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }
}
