import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  navOpen = false;

  ngOnInit() {
    this.setupNavigation();
  }

  toggleDropdown(event: Event) {
    const link = event.currentTarget as HTMLElement;
    const dropdown = link.nextElementSibling;
    
    if (dropdown?.classList.contains('nav-dropdown')) {
      dropdown.classList.toggle('active');
      this.closeOtherDropdowns(dropdown);
    }
    event.stopPropagation();
  }

  closeOtherDropdowns(current: Element) {
    document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
      if (dropdown !== current) {
        dropdown.classList.remove('active');
      }
    });
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  setupNavigation() {
    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    });
  }
}
