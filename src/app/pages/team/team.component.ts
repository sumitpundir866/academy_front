import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements AfterViewInit, OnDestroy {
  // ViewChildren 'animItem' ko track karega
  @ViewChildren('animItem') animItems!: QueryList<ElementRef>;
  
  private viewChangesSub!: Subscription;
  private observer!: IntersectionObserver;

  // Team data
  teamMembers: any[] = [];
  
  // Auth & Upload state
  currentUser: any = null;
  permissions = { edit: false, delete: false, upload: false };
  isUploadOpen = false;
  isLoading = false;
  errorMessage = '';

  // Upload form data
  uploadData = {
    name: '',
    role: '',
    bio: ''
  };
  selectedFile: File | null = null;

  // Dummy data fallback
  dummyTeamMembers = [
    {
      id: 1,
      name: 'Satendra Kumar',
      role: 'General Secretary',
      experience: '20+ Years',
      specialization: 'Administration',
      image: 'assets/hero-bg.jpg', 
      bio: 'Visionary leader dedicated to promoting sports and welfare across the nation.'
    },
    {
      id: 2,
      name: 'Raj Kumar',
      role: 'Chief Instructor',
      experience: '18+ Years',
      specialization: 'Shotokan Karate',
      image: 'assets/class-karate.jpg',
      bio: 'National level gold medalist specializing in traditional Kata and Kumite techniques.'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private api: ApiService
  ) {
    this.restoreSessionFromStorage();
    this.loadTeamMembers();
  }

  ngAfterViewInit() {
    // 1. Observer Setup
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: Performance ke liye observe stop kar sakte ho ek baar dikhne ke baad
          // this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // 2. Initial check (agar pehle se items hain)
    this.observeItems();

    // 3. CRITICAL FIX: Jab API se data aaye aur list change ho, tab observer dubara run kare
    this.viewChangesSub = this.animItems.changes.subscribe(() => {
      this.observeItems();
    });
  }

  // Helper to observe current list items
  observeItems() {
    if (this.animItems) {
      this.animItems.forEach((item) => {
        this.observer.observe(item.nativeElement);
      });
    }
  }

  ngOnDestroy() {
    if (this.viewChangesSub) {
      this.viewChangesSub.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // --- SESSION PERSISTENCE ---
  restoreSessionFromStorage() {
    const storedUser = localStorage.getItem('gallery_user');
    const storedPermissions = localStorage.getItem('gallery_permissions');
    
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      if (storedPermissions) {
        this.permissions = JSON.parse(storedPermissions);
      }
    }
  }

  // --- LOAD TEAM MEMBERS FROM API ---
  loadTeamMembers() {
    this.isLoading = true;
    this.api.getAllTeamMembers().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        
        let members = [];
        if (Array.isArray(response)) {
          members = response;
        } else if (response.data && Array.isArray(response.data)) {
          members = response.data;
        }

        // Process images
        this.teamMembers = members.map((member: any) => {
          return {
            ...member,
            // Priority: Backend URL > Local Asset fallback
            image: member.image_url ? this.getFullImageUrl(member.image_url) : 'assets/hero-bg.jpg'
          };
        });

        // Fallback to dummy if empty
        if (this.teamMembers.length === 0) {
          this.teamMembers = this.dummyTeamMembers;
        }

        this.isLoading = false;
        // Detect changes manually to update view immediately
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading team:', error);
        this.teamMembers = this.dummyTeamMembers;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- HANDLE IMAGE URL FIX ---
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    // Agar full URL hai (http se start ho raha hai), toh wahi return karo
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Backend domain nikalna (Example: http://192.168.31.145:8000)
    // Humara API URL /api/academy se end hota hai, usse hata denge
    const apiUrl = this.api.getBaseUrl(); // e.g. http://192.168.31.145:8000/api/academy
    
    // Base Domain nikalne ka logic
    let baseDomain = '';
    try {
        const urlObj = new URL(apiUrl);
        baseDomain = urlObj.origin; // Ye dega: http://192.168.31.145:8000
    } catch (e) {
        // Fallback agar URL object fail ho jaye
        baseDomain = 'http://192.168.31.145:8000';
    }

    // Final URL construct karo
    // Note: Agar backend '/app/uploads' serve nahi karta, toh yahan replace logic lagana padega
    // Example: return baseDomain + imagePath.replace('/app/uploads', '/static');
    
    return baseDomain + imagePath;
  }
  
  // --- UPLOAD FORM ---
  openUploadModal() { 
    this.isUploadOpen = true; 
    this.errorMessage = '';
  }
  
  closeUploadModal() { 
    this.isUploadOpen = false; 
    this.resetUploadForm();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  resetUploadForm() {
    this.uploadData = { name: '', role: '', bio: '' };
    this.selectedFile = null;
  }

  onUploadSubmit() {
    if (!this.selectedFile || !this.uploadData.name || !this.uploadData.role) {
      alert('Please fill all required fields and select a file.');
      return;
    }

    this.isLoading = true;
    this.api.uploadTeamMember(this.uploadData, this.selectedFile).subscribe({
      next: (response) => {
        alert('Team member added successfully!');
        this.loadTeamMembers();
        this.closeUploadModal();
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed. Check console.');
        this.isLoading = false;
      }
    });
  }

  // --- DELETE TEAM MEMBER ---
  deleteTeamMember(memberId: number, memberName: string) {
    if (confirm(`Are you sure you want to delete ${memberName}?`)) {
      this.isLoading = true;
      this.api.deleteTeamMember(memberId).subscribe({
        next: () => {
          alert('Deleted successfully!');
          this.loadTeamMembers();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete.');
          this.isLoading = false;
        }
      });
    }
  }
}