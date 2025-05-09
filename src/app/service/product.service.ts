import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000'; // URL da API

  constructor(private http: HttpClient) { } // HttpClient continua sendo injetado da mesma forma

  // Restante do código permanece igual
  searchProducts(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/items/search/${name}`);
  }

  // ... outros métodos


  liveSearch(terms: Observable<string>){
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => term.length < 2 ? [] : this.searchProducts(term))
    );
  }
}