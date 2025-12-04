// projects/personas/src/app/personas-crud/personas-crud.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import validator from 'validator';
import { PersonaService, Persona, PersonaPage } from '../persona.service';

@Component({
  selector: 'app-personas-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personas-crud.component.html',
  styleUrl: './personas-crud.component.scss'
})
export class PersonasCrudComponent implements OnInit {
  persons: Persona[] = [];
  pageSize = 5;
  pageIndex = 0;
  totalPages = 0;
  totalElements = 0;
  newPersonName = '';
  newPersonEmail = '';
  apiMessage = '';
  editingId: number | null = null;
  editingName = '';
  editingEmail = '';

  constructor(private readonly personaService: PersonaService) {}

  ngOnInit(): void {
    this.listarPersonas();
  }

  listarPersonas(): void {
    this.personaService.getPage(this.pageIndex, this.pageSize).subscribe({
      next: (page: PersonaPage) => {
        this.persons = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.limpiarMensaje();
      },
      error: (err) => {
        this.apiMessage = this.errorToMessage(err, 'Error loading persons');
        console.error('Error loading:', err);
      }
    });
  }

  agregarPersona(): void {
    if (!this.newPersonName.trim() || !this.newPersonEmail.trim()) {
      this.apiMessage = 'Porfavor ingrese un email.';
      return;
    }
    if (!this.esEmailValido(this.newPersonEmail)) {
      this.apiMessage = 'Ingrese un email valido.';
      return;
    }
    const newPerson: Persona = {
      nombre: this.newPersonName,
      email: this.newPersonEmail
    };
    this.personaService.create(newPerson).subscribe({
      next: () => {
        this.apiMessage = 'Persona creada correctamente';
        this.newPersonName = '';
        this.newPersonEmail = '';
        setTimeout(() => this.listarPersonas(), 500);
      },
      error: (err) => {
        this.apiMessage = this.errorToMessage(err, 'Error al crear persona');
        console.error('Error creating:', err);
      }
    });
  }

  iniciarEdicion(person: Persona): void {
    this.editingId = person.id ?? null;
    this.editingName = person.nombre;
    this.editingEmail = person.email;
  }

  cancelarEdicion(): void {
    this.editingId = null;
    this.editingName = '';
  }

  guardarEdicion(): void {
    if (!this.editingName.trim() || !this.editingEmail.trim() || this.editingId === null) {
      this.apiMessage = 'Ingrese un correo.';
      return;
    }
    if (!this.esEmailValido(this.editingEmail)) {
      this.apiMessage = 'Ingrese un correo valido.';
      return;
    }
    const updatedPerson: Persona = {
      id: this.editingId,
      nombre: this.editingName,
      email: this.editingEmail
    };
    this.personaService.update(this.editingId, updatedPerson).subscribe({
      next: () => {
        this.apiMessage = 'Persona actualizada correctamente';
        this.editingId = null;
        this.editingName = '';
        this.editingEmail = '';
        setTimeout(() => this.listarPersonas(), 500);
      },
      error: (err) => {
        this.apiMessage = this.errorToMessage(err, 'Error al actualizar persona');
        console.error('Error updating:', err);
      }
    });
  }

  eliminarPersona(id: number | undefined): void {
    if (!id || !confirm('¿Estás seguro de que deseas eliminar esta persona?')) return;
    this.personaService.delete(id).subscribe({
      next: () => {
        this.apiMessage = 'Persona eliminada correctamente';
        setTimeout(() => this.listarPersonas(), 500);
      },
      error: (err) => {
        this.apiMessage = this.errorToMessage(err, 'Error al eliminar persona');
        console.error('Error deleting:', err);
      }
    });
  }

  cambiarPagina(page: number): void {
    if (page < 0 || (this.totalPages && page >= this.totalPages)) {
      return;
    }
    this.pageIndex = page;
    this.listarPersonas();
  }

  siguiente(): void {
    this.cambiarPagina(this.pageIndex + 1);
  }

  anterior(): void {
    this.cambiarPagina(this.pageIndex - 1);
  }

  private limpiarMensaje(): void {
    setTimeout(() => {
      if (this.apiMessage && !this.apiMessage.includes('Error')) {
        this.apiMessage = '';
      }
    }, 3000);
  }

  private esEmailValido(email: string): boolean {
    if (!email) {
      return false;
    }

    if (email.length > 254) {
      return false;
    }

    if (/\s/.test(email)) {
      return false;
    }

    const atIndex = email.indexOf('@');
    if (atIndex <= 0 || atIndex !== email.lastIndexOf('@') || atIndex === email.length - 1) {
      return false;
    }

    const local = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1);

    if (!domain.includes('.')) {
      return false;
    }

    if (local.length > 64 || domain.length > 190) {
      return false;
    }

    const domainLabels = domain.split('.');
    if (domainLabels.some((label) => label.length === 0)) {
      return false;
    }

    const tld = domainLabels.at(-1) ?? '';
    if (tld.length < 2) {
      return false;
    }

    return validator.isEmail(email, { allow_utf8_local_part: false });
  }

  private errorToMessage(err: unknown, fallback: string): string {
    if (!err) return fallback;
    const error = err as { error?: unknown; message?: unknown };
    const candidates = [error?.error, error?.message];
    for (const candidate of candidates) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
      if (candidate && typeof candidate === 'object' && 'message' in candidate) {
        const msg = (candidate as { message?: unknown }).message;
        if (typeof msg === 'string' && msg.trim()) {
          return msg;
        }
      }
    }
    return fallback;
  }
}
