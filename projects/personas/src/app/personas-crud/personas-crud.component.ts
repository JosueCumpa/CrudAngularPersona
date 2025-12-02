// projects/personas/src/app/personas-crud/personas-crud.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService, Persona } from '../persona.service';

@Component({
  selector: 'app-personas-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personas-crud.component.html',
  styleUrl: './personas-crud.component.scss'
})
export class PersonasCrudComponent implements OnInit {
  persons: Persona[] = [];
  newPersonName: string = '';
  newPersonEmail: string = '';
  apiMessage: string = '';
  editingId: number | null = null;
  editingName: string = '';
  editingEmail: string = '';

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void { 
    this.listarPersonas(); 
  }

  listarPersonas(): void {
    this.personaService.getAll().subscribe({
      next: (data) => {
        this.persons = data;
        this.limpiarMensaje();
      },
      error: (err) => { 
        this.apiMessage = 'Error loading persons: ' + (err.error?.message || err.message);
        console.error('Error loading:', err);
      }
    });
  }

  agregarPersona(): void {
    if (!this.newPersonName.trim() || !this.newPersonEmail.trim()) {
      this.apiMessage = 'Please fill in name and email.';
      return;
    }
    if (!this.esEmailValido(this.newPersonEmail)) {
      this.apiMessage = 'Please enter a valid email.';
      return;
    }
    const newPerson: Persona = { 
      nombre: this.newPersonName,
      email: this.newPersonEmail 
    };
    this.personaService.create(newPerson).subscribe({
      next: (response: string) => {
        this.apiMessage = response;
        this.newPersonName = '';
        this.newPersonEmail = '';
        setTimeout(() => this.listarPersonas(), 500);
      },
      error: (err) => { 
        this.apiMessage = err.error || 'Error al crear persona';
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
      this.apiMessage = 'Please fill in name and email.';
      return;
    }
    if (!this.esEmailValido(this.editingEmail)) {
      this.apiMessage = 'Please enter a valid email.';
      return;
    }
    const updatedPerson: Persona = { 
      id: this.editingId, 
      nombre: this.editingName,
      email: this.editingEmail 
    };
    this.personaService.update(this.editingId, updatedPerson).subscribe({
      next: (response: string) => {
        this.apiMessage = response;
        this.editingId = null;
        this.editingName = '';
        this.editingEmail = '';
        setTimeout(() => this.listarPersonas(), 500);
      },
      error: (err) => { 
        this.apiMessage = err.error || 'Error al actualizar persona';
        console.error('Error updating:', err);
      }
    });
  }

  eliminarPersona(id: number | undefined): void {
    if (!id || !confirm('¿Estás seguro de que deseas eliminar esta persona?')) return;
    this.personaService.delete(id).subscribe({
      next: (response: string) => {
        this.apiMessage = response;
        setTimeout(() => this.listarPersonas(), 500);
      },
      error: (err) => { 
        this.apiMessage = err.error || 'Error al eliminar persona';
        console.error('Error deleting:', err);
      }
    });
  }

  private limpiarMensaje(): void {
    setTimeout(() => {
      if (this.apiMessage && !this.apiMessage.includes('Error')) {
        this.apiMessage = '';
      }
    }, 3000);
  }

  private esEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
