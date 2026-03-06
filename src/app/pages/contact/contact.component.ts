import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements AfterViewInit {
  @ViewChildren('animItem') animItems!: QueryList<ElementRef>;

  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: '',
    classInterest: ''
  };

  isSubmitting = false;
  submitStatus = '';

  constructor() {}

  ngAfterViewInit() {
    // Scroll Animation Logic
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

  async onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = 'Sending...';

    const formData = new FormData();
    formData.append('access_key', environment.web3formsAccessKey);
    formData.append('subject', 'New contact form submission');
    formData.append('from_name', 'Sports Academy Website');
    formData.append('name', this.contactForm.name);
    formData.append('email', this.contactForm.email);
    formData.append('phone', this.contactForm.phone);
    formData.append('classInterest', this.contactForm.classInterest);
    formData.append('message', this.contactForm.message);
    formData.append('botcheck', '');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result?.success) {
        this.submitStatus = 'Thanks! Your message has been sent.';
        this.resetForm();
      } else {
        this.submitStatus = result?.message || 'Submission failed. Please try again.';
      }
    } catch (error) {
      this.submitStatus = 'Submission failed. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      message: '',
      classInterest: ''
    };
  }
}
