// projects/personas/src/app/persona.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Persona {
  id?: number;
  nombre: string;
  email: string;
}

export interface PersonaPage {
  content: Persona[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class PersonaService {
  private readonly apiUrl = environment.apiPersonasUrl;
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  getPage(page: number, size: number): Observable<PersonaPage> {
    return this.http.get<PersonaPage>(`${this.apiUrl}/page`, {
      params: { page, size,sort:'id,asc' },
    });
  }
  
  getById(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`);
  }
  
  create(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }
  
  update(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, persona);
  }
  
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
