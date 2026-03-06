import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren('animItem') animItems!: QueryList<ElementRef>;

  // Features data
  features = [
    {
      title: 'Expert Masters',
      description: 'Train under National level coaches. We focus on technique, power, and mental discipline.',
      emoji: '🥋'
    },
    {
      title: 'Global Standards',
      description: 'Our curriculum aligns with the World Taekwondo Federation (WTF) standards.',
      emoji: '🌍'
    },
    {
      title: 'Personal Growth',
      description: 'Small batch sizes ensure every student gets individual focus on stance and strikes.',
      emoji: '📈'
    }
  ];

  // Classes data with CORRECT PATHS
  classes = [
    {
      name: 'Future Champions',
      age: 'Kids (4-6 Yrs)',
      description: 'Building coordination, focus, and confidence through fun drills.',
      image: '../../../assets/class-kids.jpg'
    },
    {
      name: 'Junior Warriors',
      age: 'Youth (7-12 Yrs)',
      description: 'Structured training focusing on discipline, belts, and competition.',
      image: '../../../assets/class-karate.jpg'
    },
    {
      name: 'Elite Training',
      age: 'Adults (13+)',
      description: 'High-intensity combat training, self-defense, and peak fitness.',
      image: '../../../assets/class-adults.jpg'
    }
  ];

  constructor() {}

  ngAfterViewInit() {
    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 }); // 15% visible hote hi animate karega

    this.animItems.forEach((item) => {
      observer.observe(item.nativeElement);
    });
  }
}