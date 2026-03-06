import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  @ViewChildren('animItem') animItems!: QueryList<ElementRef>;

  achievements = [
    { number: '500+', label: 'Students Trained', icon: '👥' },
    { number: '15+', label: 'Years Excellence', icon: '🏆' },
    { number: '50+', label: 'Champions Created', icon: '🥇' },
    { number: '100%', label: 'Success Rate', icon: '⭐' }
  ];

  constructor() {}

  ngAfterViewInit() {
    this.initParallax();
    this.initScrollAnimations();
  }

  initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach((element: any) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    this.animItems.forEach((item) => {
      observer.observe(item.nativeElement);
    });
  }
}