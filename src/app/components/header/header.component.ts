import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isScrolled = false;
  isDarkMode = false;

  private routerSub!: Subscription;
  private scrollContainer: HTMLElement | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    /* =========================
       THEME RESTORE
    ========================== */
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }

    /* =========================
       SCROLL CONTAINER
    ========================== */
    this.scrollContainer = document.querySelector('.main-content');

    if (this.scrollContainer) {
      this.scrollContainer.addEventListener('scroll', () => {
        this.isScrolled = this.scrollContainer!.scrollTop > 50;
      });
    }

    /* =========================
       ROUTE CHANGE → SCROLL TOP
    ========================== */
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.scrollContainer) {
        this.scrollContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        this.isScrolled = false;
        this.isMenuOpen = false;
      }
    });
  }

  /* =========================
     THEME TOGGLE
  ========================== */
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  /* =========================
     MOBILE MENU
  ========================== */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  /* =========================
     CLEANUP
  ========================== */
  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
