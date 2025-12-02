// projects/personas/src/app/persona.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Persona {
  id?: number;
  nombre: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private apiUrl = 'http://localhost:8080/api/personas'; 
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Persona[]> { 
    return this.http.get<Persona[]>(this.apiUrl); 
  }
  
  getById(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`);
  }
  
  create(persona: Persona): Observable<string> {
    return this.http.post(this.apiUrl, persona, { responseType: 'text' });
  }
  
  update(id: number, persona: Persona): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, persona, { responseType: 'text' });
  }
  
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
