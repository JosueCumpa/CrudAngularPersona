import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PersonasCrudComponent } from './personas-crud.component';
import { PersonaService, Persona } from '../persona.service';

describe('PersonasCrudComponent', () => {
  let component: PersonasCrudComponent;
  let fixture: ComponentFixture<PersonasCrudComponent>;
  let personaService: PersonaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonasCrudComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), PersonaService],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonasCrudComponent);
    component = fixture.componentInstance;
    personaService = TestBed.inject(PersonaService);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debe llamar a listarPersonas en la inicializacion', () => {
      spyOn(component, 'listarPersonas');
      component.ngOnInit();
      expect(component.listarPersonas).toHaveBeenCalled();
    });
  });

  describe('listarPersonas', () => {
    it('debe cargar todas las personas paginadas', () => {
      const page = {
        content: [
          { id: 1, nombre: 'Juan', email: 'juan@example.com' },
          { id: 2, nombre: 'Maria', email: 'maria@example.com' },
        ],
        totalPages: 3,
        totalElements: 12,
        number: 0,
        size: 5,
      };

      spyOn(personaService, 'getPage').and.returnValue(of(page as any));

      component.listarPersonas();

      expect(component.persons).toEqual(page.content);
      expect(component.totalPages).toBe(3);
      expect(component.totalElements).toBe(12);
      expect(personaService.getPage).toHaveBeenCalledWith(component.pageIndex, component.pageSize);
    });

    it('debe manejar error al cargar personas', () => {
      const error = { error: { message: 'Error del servidor' }, message: 'Http Error' };
      spyOn(personaService, 'getPage').and.returnValue(throwError(() => error));

      component.listarPersonas();

      expect(component.apiMessage).toBe('Error del servidor');
    });
  });

  describe('agregarPersona', () => {
    it('no debe agregar persona si el nombre esta vacio', () => {
      component.newPersonName = '';
      component.newPersonEmail = 'test@example.com';

      component.agregarPersona();

      expect(component.apiMessage).toContain('Porfavor ingrese');
    });

    it('no debe agregar persona si el correo esta vacio', () => {
      component.newPersonName = 'Test';
      component.newPersonEmail = '';

      component.agregarPersona();

      expect(component.apiMessage).toContain('Porfavor ingrese');
    });

    it('no debe agregar persona si el correo es invalido', () => {
      component.newPersonName = 'Test';
      component.newPersonEmail = 'correo-invalido';

      component.agregarPersona();

      expect(component.apiMessage).toContain('email valido');
    });

    it('debe agregar persona con datos validos', (done) => {
      component.newPersonName = 'Carlos';
      component.newPersonEmail = 'carlos@example.com';

      const mockPersona: Persona = { nombre: 'Carlos', email: 'carlos@example.com' };
      const response: Persona = { id: 1, ...mockPersona };

      spyOn(personaService, 'create').and.returnValue(of(response));
      spyOn(component, 'listarPersonas');

      component.agregarPersona();

      expect(personaService.create).toHaveBeenCalledWith(mockPersona);
      expect(component.newPersonName).toBe('');
      expect(component.newPersonEmail).toBe('');

      setTimeout(() => {
        expect(component.listarPersonas).toHaveBeenCalled();
        done();
      }, 600);
    });

    it('debe manejar error al crear persona', () => {
      component.newPersonName = 'Carlos';
      component.newPersonEmail = 'carlos@example.com';

      const error = { error: 'El correo ya existe' };
      spyOn(personaService, 'create').and.returnValue(throwError(() => error));

      component.agregarPersona();

      expect(component.apiMessage).toBe('El correo ya existe');
    });
  });

  describe('iniciarEdicion', () => {
    it('debe establecer el estado de edicion', () => {
      const persona: Persona = { id: 1, nombre: 'Juan', email: 'juan@example.com' };

      component.iniciarEdicion(persona);

      expect(component.editingId).toBe(1);
      expect(component.editingName).toBe('Juan');
      expect(component.editingEmail).toBe('juan@example.com');
    });
  });

  describe('cancelarEdicion', () => {
    it('debe cancelar el estado de edicion', () => {
      component.editingId = 1;
      component.editingName = 'test';

      component.cancelarEdicion();

      expect(component.editingId).toBeNull();
      expect(component.editingName).toBe('');
    });
  });

  describe('guardarEdicion', () => {
    it('no debe guardar si el nombre esta vacio', () => {
      component.editingId = 1;
      component.editingName = '';
      component.editingEmail = 'test@example.com';

      component.guardarEdicion();

      expect(component.apiMessage).toContain('Ingrese un correo');
    });

    it('no debe guardar si el correo es invalido', () => {
      component.editingId = 1;
      component.editingName = 'Juan';
      component.editingEmail = 'invalid-email';

      component.guardarEdicion();

      expect(component.apiMessage).toContain('correo valido');
    });

    it('debe guardar con datos validos', (done) => {
      component.editingId = 1;
      component.editingName = 'Juan Actualizado';
      component.editingEmail = 'juan.updated@example.com';

      const updatedPersona: Persona = {
        id: 1,
        nombre: 'Juan Actualizado',
        email: 'juan.updated@example.com',
      };
      const response: Persona = updatedPersona;

      spyOn(personaService, 'update').and.returnValue(of(response));
      spyOn(component, 'listarPersonas');

      component.guardarEdicion();

      expect(personaService.update).toHaveBeenCalledWith(1, updatedPersona);
      expect(component.editingId).toBeNull();

      setTimeout(() => {
        expect(component.listarPersonas).toHaveBeenCalled();
        done();
      }, 600);
    });

    it('debe manejar error al guardar edicion', () => {
      component.editingId = 1;
      component.editingName = 'Juan';
      component.editingEmail = 'juan@example.com';

      const error = { error: 'Error al actualizar persona' };
      spyOn(personaService, 'update').and.returnValue(throwError(() => error));

      component.guardarEdicion();

      expect(component.apiMessage).toBe('Error al actualizar persona');
    });
  });

  describe('eliminarPersona', () => {
    it('no debe eliminar si el id es indefinido', () => {
      spyOn(personaService, 'delete');

      component.eliminarPersona(undefined);

      expect(personaService.delete).not.toHaveBeenCalled();
    });

    it('no debe eliminar si el usuario cancela la confirmacion', () => {
      spyOn(globalThis, 'confirm').and.returnValue(false);
      spyOn(personaService, 'delete');

      component.eliminarPersona(1);

      expect(personaService.delete).not.toHaveBeenCalled();
    });

    it('debe eliminar persona cuando se confirma', (done) => {
      spyOn(globalThis, 'confirm').and.returnValue(true);
      const response = 'Persona eliminada exitosamente';

      spyOn(personaService, 'delete').and.returnValue(of(response));
      spyOn(component, 'listarPersonas');

      component.eliminarPersona(1);

      expect(personaService.delete).toHaveBeenCalledWith(1);

      setTimeout(() => {
        expect(component.listarPersonas).toHaveBeenCalled();
        done();
      }, 600);
    });

    it('debe manejar error al eliminar persona', () => {
      spyOn(globalThis, 'confirm').and.returnValue(true);
      const error = { error: 'No se puede eliminar la persona' };

      spyOn(personaService, 'delete').and.returnValue(throwError(() => error));

      component.eliminarPersona(1);

      expect(component.apiMessage).toBe('No se puede eliminar la persona');
    });
  });

  describe('esEmailValido', () => {
    it('debe validar correos correctos', () => {
      expect((component as any).esEmailValido('test@example.com')).toBe(true);
      expect((component as any).esEmailValido('user.name@domain.co.uk')).toBe(true);
    });

    it('debe rechazar email vacio o ausente', () => {
      expect((component as any).esEmailValido('')).toBe(false);
    });

    it('debe rechazar correos invalidos basicos', () => {
      expect((component as any).esEmailValido('invalido')).toBe(false);
      expect((component as any).esEmailValido('invalido@')).toBe(false);
      expect((component as any).esEmailValido('@example.com')).toBe(false);
    });

    it('debe rechazar correos con espacios o mas de un @', () => {
      expect((component as any).esEmailValido('con espacio@domain.com')).toBe(false);
      expect((component as any).esEmailValido('uno@@dos.com')).toBe(false);
    });

    it('debe rechazar dominios sin punto, labels vacios o TLD corto', () => {
      expect((component as any).esEmailValido('user@dominio')).toBe(false);
      expect((component as any).esEmailValido('user@dominio..com')).toBe(false);
      expect((component as any).esEmailValido('user@dominio.c')).toBe(false);
    });

    it('debe rechazar cuando excede longitudes permitidas', () => {
      const localLargo = `${'a'.repeat(65)}@dominio.com`;
      const dominioLargo = `a@${'b'.repeat(191)}.com`;
      const demasiadoLargo = `a@${'b'.repeat(255)}.com`;

      expect((component as any).esEmailValido(localLargo)).toBe(false);
      expect((component as any).esEmailValido(dominioLargo)).toBe(false);
      expect((component as any).esEmailValido(demasiadoLargo)).toBe(false);
    });
  });

  describe('limpiarMensaje', () => {
    it('debe limpiar mensajes que no contienen "Error"', fakeAsync(() => {
      component.apiMessage = 'Operacion exitosa';
      (component as any).limpiarMensaje();
      tick(3100);
      expect(component.apiMessage).toBe('');
    }));

    it('no debe limpiar mensajes de error', fakeAsync(() => {
      component.apiMessage = 'Error al cargar';
      (component as any).limpiarMensaje();
      tick(3100);
      expect(component.apiMessage).toBe('Error al cargar');
    }));
  });

  describe('errorToMessage', () => {
    it('retorna el message directo si es string', () => {
      const result = (component as any).errorToMessage({ message: 'error directo' }, 'fallback');
      expect(result).toBe('error directo');
    });

    it('retorna message anidado en error', () => {
      const result = (component as any).errorToMessage({ error: { message: 'error anidado' } }, 'fallback');
      expect(result).toBe('error anidado');
    });

    it('retorna fallback si no hay mensaje', () => {
      const result = (component as any).errorToMessage({}, 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('paginacion', () => {
    it('no cambia de pagina si el indice es invalido', () => {
      component.totalPages = 3;
      component.pageIndex = 1;
      spyOn(component, 'listarPersonas');

      component.cambiarPagina(-1);
      component.cambiarPagina(5);

      expect(component.pageIndex).toBe(1);
      expect(component.listarPersonas).not.toHaveBeenCalled();
    });

    it('cambia a pagina valida y lista personas', () => {
      component.totalPages = 5;
      spyOn(component, 'listarPersonas');

      component.cambiarPagina(2);

      expect(component.pageIndex).toBe(2);
      expect(component.listarPersonas).toHaveBeenCalled();
    });

    it('avanza y retrocede pagina', () => {
      component.totalPages = 3;
      component.pageIndex = 1;
      spyOn(component, 'listarPersonas');

      component.siguiente();
      component.anterior();

      expect(component.pageIndex).toBe(1);
      expect(component.listarPersonas).toHaveBeenCalledTimes(2);
    });
  });
});
