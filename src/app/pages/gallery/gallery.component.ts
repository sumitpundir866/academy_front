import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit {
  @ViewChildren('animItem') animItems!: QueryList<ElementRef>;
  
  currentFilter = 'all';
  visibleImages: any[] = [];
  
  // --- AUTH STATE ---
  isLoginOpen = false;
  isUploadOpen = false; // New Upload Modal State
  isLoading = false;
  currentUser: any = null;
  errorMessage = '';

  // Permissions Object (Default False)
  permissions = {
    edit: false,
    delete: false,
    upload: false
  };

  loginData = { user_name: '', password: '' };

  // --- UPLOAD FORM DATA ---
  uploadData = {
    type: 'image', // Default
    category: 'Training',
    title: '',
    description: ''
  };
  selectedFile: File | null = null;

  // Master List (Loaded from API - Images & Videos)
  allImages: any[] = [];
  allVideos: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private api: ApiService
  ) {
    // Initialize with empty arrays
    this.visibleImages = [];
    this.allImages = [];
    this.allVideos = [];
    
    // Restore session
    this.restoreSessionFromStorage();
    
    // Load gallery content for everyone
    this.loadGalleryContent();
  }

  ngAfterViewInit() {
    setTimeout(() => { this.initAnimations(); }, 100);
    this.animItems.changes.subscribe(() => { this.initAnimations(); });
  }

  // --- LOAD GALLERY IMAGES & VIDEOS FROM API ---
  loadGalleryContent() {
    console.log('Loading gallery content...');
    this.isLoading = true;
    
    // Load images and videos in parallel
    Promise.all([
      this.loadGalleryImages(),
      this.loadGalleryVideos()
    ]).then(() => {
      console.log('Gallery loaded successfully. Images:', this.allImages.length, 'Videos:', this.allVideos.length);
      this.isLoading = false;
      this.cdr.detectChanges();
    }).catch((error) => {
      console.error('Error loading gallery:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  loadGalleryImages(): Promise<void> {
    return new Promise((resolve) => {
      this.api.getGalleryImages().subscribe({
        next: (response) => {
          console.log('Gallery images response:', response);
          
          // Handle both array and object responses
          let images = [];
          if (Array.isArray(response)) {
            images = response;
          } else if (response.data && Array.isArray(response.data)) {
            images = response.data;
          } else {
            images = [];
          }

          // Process images to ensure proper image URL field
          this.allImages = images.map((img: any) => ({
            ...img,
            type: 'image',
            // Use image_url from backend or fallback to image field
            image: img.image_url ? this.getFullImageUrl(img.image_url) : (img.image || '')
          }));

          console.log('Processed images:', this.allImages);
          this.updateVisibleItems();
          resolve();
        },
        error: (error) => {
          console.error('Error loading gallery images:', error);
          this.allImages = [];
          this.updateVisibleItems();
          resolve();
        }
      });
    });
  }

  loadGalleryVideos(): Promise<void> {
    return new Promise((resolve) => {
      this.api.getGalleryVideos().subscribe({
        next: (response) => {
          console.log('Gallery videos response:', response);
          
          // Handle both array and object responses
          let videos = [];
          if (Array.isArray(response)) {
            videos = response;
          } else if (response.data && Array.isArray(response.data)) {
            videos = response.data;
          } else {
            videos = [];
          }

          // Process videos to ensure proper video URL field
          this.allVideos = videos.map((vid: any) => ({
            ...vid,
            type: 'video',
            // Use video_url from backend or fallback to video field
            image: vid.video_url ? this.getFullImageUrl(vid.video_url) : (vid.video || '')
          }));

          console.log('Processed videos:', this.allVideos);
          this.updateVisibleItems();
          resolve();
        },
        error: (error) => {
          console.error('Error loading gallery videos:', error);
          this.allVideos = [];
          this.updateVisibleItems();
          resolve();
        }
      });
    });
  }

  // Update visible items based on current filter
  updateVisibleItems() {
    const allItems = [...this.allImages, ...this.allVideos];
    
    if (this.currentFilter === 'all') {
      this.visibleImages = allItems;
    } else {
      this.visibleImages = allItems.filter(item => item.category === this.currentFilter);
    }
    
    this.cdr.detectChanges();
  }

  // --- HANDLE IMAGE URL FROM BACKEND ---
  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If it's a relative path, prepend the base URL (remove /api/academy part)
    // Backend URL: http://192.168.31.145:8000/api/academy
    // Image path: /app/uploads/gallery/images/...
    // We need: http://192.168.31.145:8000/app/uploads/gallery/images/...
    const baseWithoutApi = this.api.getBaseUrl().replace('/api/academy', '');
    return baseWithoutApi + imagePath;
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

  saveSessionToStorage() {
    if (this.currentUser) {
      localStorage.setItem('gallery_user', JSON.stringify(this.currentUser));
      localStorage.setItem('gallery_permissions', JSON.stringify(this.permissions));
    }
  }

  clearSessionFromStorage() {
    localStorage.removeItem('gallery_user');
    localStorage.removeItem('gallery_permissions');
  }

  // --- AUTH & PERMISSIONS ---

  onLoginSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.api.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login Success:', response);
        this.currentUser = response;
        
        // ✅ SET PERMISSIONS FROM RESPONSE
        if (response.user_data) {
          this.permissions = {
            edit: response.user_data.edit || false,
            delete: response.user_data.delete || false,
            upload: response.user_data.upload || false
          };
        }

        // ✅ SAVE TO LOCAL STORAGE
        this.saveSessionToStorage();

        this.closeLoginModal();
        this.isLoading = false;
        // Optionally fetch fresh images from server here if GET API exists
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials or server error.';
      }
    });
  }

  logout() {
    this.currentUser = null;
    this.permissions = { edit: false, delete: false, upload: false };
    this.visibleImages = [...this.allImages]; // Reset view
    
    // ✅ CLEAR FROM LOCAL STORAGE
    this.clearSessionFromStorage();
  }

  // --- UPLOAD LOGIC ---

  openUploadModal() { this.isUploadOpen = true; }
  closeUploadModal() { this.isUploadOpen = false; this.resetUploadForm(); }

  onUploadTypeChange() {
    // Reset form when type changes
    this.selectedFile = null;
    this.uploadData.title = '';
    this.uploadData.description = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  onUploadSubmit() {
    if (!this.selectedFile || !this.uploadData.title || !this.uploadData.category) {
      alert('Please fill all fields and select a file.');
      return;
    }

    this.isLoading = true;
    // Type casting specifically to 'image' | 'video'
    const type = this.uploadData.type as 'image' | 'video';

    this.api.uploadGalleryMedia(type, this.uploadData, this.selectedFile).subscribe({
      next: (response) => {
        alert('Upload Successful!');
        
        // ✅ Reload gallery content from API
        this.loadGalleryContent();
        
        this.closeUploadModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed. Check console.');
        this.isLoading = false;
      }
    });
  }

  resetUploadForm() {
    this.uploadData = { type: 'image', category: 'Training', title: '', description: '' };
    this.selectedFile = null;
  }

  // --- ACTIONS (Edit/Delete) ---
  editItem(index: number) { alert('Edit functionality coming soon for item ' + index); }
  deleteItem(index: number) { 
    if(confirm('Are you sure you want to delete?')) {
      const itemToDelete = this.visibleImages[index];
      
      // If item has an ID, delete from API
      if (itemToDelete.id) {
        this.isLoading = true;
        
        // Determine if it's image or video and call appropriate delete method
        const deleteRequest = itemToDelete.type === 'video' 
          ? this.api.deleteGalleryVideo(itemToDelete.id)
          : this.api.deleteGalleryImage(itemToDelete.id);
        
        deleteRequest.subscribe({
          next: () => {
            // Reload gallery from API
            this.loadGalleryContent();
            alert('Item deleted successfully!');
          },
          error: (err) => {
            console.error(err);
            alert('Failed to delete item.');
            this.isLoading = false;
          }
        });
      } else {
        // Fallback: remove locally
        if (itemToDelete.type === 'video') {
          this.allVideos = this.allVideos.filter(vid => vid !== itemToDelete);
        } else {
          this.allImages = this.allImages.filter(img => img !== itemToDelete);
        }
        this.updateVisibleItems();
      }
    }
  }

  // --- GALLERY HELPERS ---
  openLoginModal() { this.isLoginOpen = true; this.errorMessage = ''; }
  closeLoginModal() { this.isLoginOpen = false; }

  // --- REFRESH GALLERY ---
  refreshGallery() {
    this.loadGalleryContent();
  }

  filterImages(category: string) {
    this.currentFilter = category;
    this.updateVisibleItems();
  }

  initAnimations() {
    // ... existing animation logic
    if (this.animItems) {
      this.animItems.forEach((item) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        });
        observer.observe(item.nativeElement);
      });
    }
  }
}