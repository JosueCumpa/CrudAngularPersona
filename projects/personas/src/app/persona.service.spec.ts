import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PersonaService, Persona } from './persona.service';
import { environment } from '../environments/environment';

describe('PersonaService', () => {
  let service: PersonaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PersonaService
      ]
    });
    service = TestBed.inject(PersonaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('debe obtener todas las personas', () => {
      const mockPersonas: Persona[] = [
        { id: 1, nombre: 'Juan', email: 'juan@example.com' },
        { id: 2, nombre: 'Maria', email: 'maria@example.com' }
      ];

      service.getAll().subscribe({
        next: (personas) => {
          expect(personas.length).toBe(2);
          expect(personas).toEqual(mockPersonas);
        }
      });

      const req = httpMock.expectOne(environment.apiPersonasUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonas);
    });

    it('debe manejar error al obtener personas', () => {
      service.getAll().subscribe({
        next: () => fail('debe fallar con error 500'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(environment.apiPersonasUrl);
      req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getById', () => {
    it('debe obtener persona por id', () => {
      const mockPersona: Persona = { id: 1, nombre: 'Juan', email: 'juan@example.com' };

      service.getById(1).subscribe({
        next: (persona) => {
          expect(persona).toEqual(mockPersona);
        }
      });

      const req = httpMock.expectOne(`${environment.apiPersonasUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPersona);
    });
  });

  describe('create', () => {
    it('debe crear una nueva persona', () => {
      const newPersona: Persona = { nombre: 'Carlos', email: 'carlos@example.com' };
      const response: Persona = { id: 1, ...newPersona };

      service.create(newPersona).subscribe({
        next: (result) => {
          expect(result).toBe(response);
        }
      });

      const req = httpMock.expectOne(environment.apiPersonasUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPersona);
      req.flush(response);
    });

    it('debe manejar error al crear persona', () => {
      const newPersona: Persona = { nombre: 'Carlos', email: 'carlos@example.com' };

      service.create(newPersona).subscribe({
        next: () => fail('debe fallar'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(environment.apiPersonasUrl);
      req.flush('Solicitud incorrecta', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('debe actualizar una persona', () => {
      const updatedPersona: Persona = { id: 1, nombre: 'Juan Actualizado', email: 'juan.new@example.com' };
      const response: Persona = updatedPersona;

      service.update(1, updatedPersona).subscribe({
        next: (result) => {
          expect(result).toBe(response);
        }
      });

      const req = httpMock.expectOne(`${environment.apiPersonasUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPersona);
      req.flush(response);
    });
  });

  describe('delete', () => {
    it('debe eliminar una persona', () => {
      const response = 'Persona eliminada exitosamente';

      service.delete(1).subscribe({
        next: (result) => {
          expect(result).toBe(response);
        }
      });

      const req = httpMock.expectOne(`${environment.apiPersonasUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(response);
    });
  });
});
