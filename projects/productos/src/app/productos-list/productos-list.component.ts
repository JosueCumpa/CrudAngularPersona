import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-list.component.html',
  styleUrl: './productos-list.component.scss'
})
export class ProductosListComponent implements OnInit {
  productos: any[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log('Componente de Productos cargado');
    this.listarProductos();
  }

  listarProductos(): void {
    console.log('Listando productos...');
  }
}
