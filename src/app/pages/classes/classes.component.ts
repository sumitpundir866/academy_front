import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements AfterViewInit {
  @ViewChildren('animItem') animItems!: QueryList<ElementRef>;

  classPrograms = [
    {
      name: 'Excellent Kids',
      age: 'Ages 4-6',
      duration: '30 Mins',
      schedule: 'Mon, Wed, Fri',
      price: '₹1,500/mo',
      description: 'Fun introduction to martial arts focusing on basic movements, coordination, and listening skills in a playful environment.',
      benefits: ['Improved coordination', 'Basic motor skills', 'Social interaction', 'Fun learning']
    },
    {
      name: 'Kid\'s Karate',
      age: 'Ages 7-12',
      duration: '45 Mins',
      schedule: 'Mon, Wed, Fri',
      price: '₹2,000/mo',
      description: 'Structured karate training focusing on discipline, technique, belts, and physical fitness to build strong foundations.',
      benefits: ['Self-discipline', 'Physical fitness', 'Self-defense skills', 'Confidence building']
    },
    {
      name: 'Teens & Adults',
      age: 'Ages 13+',
      duration: '60 Mins',
      schedule: 'Tue, Thu, Sat',
      price: '₹2,500/mo',
      description: 'Comprehensive martial arts training for all skill levels. Covers advanced combat techniques, self-defense, and conditioning.',
      benefits: ['Stress relief', 'Physical conditioning', 'Advanced techniques', 'Mental focus']
    }
  ];

  constructor() {}

  ngAfterViewInit() {
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