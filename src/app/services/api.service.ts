import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) { }

  // Get base URL for external use
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // --- AUTH ---
  login(credentials: { user_name: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // --- GALLERY IMAGES ---
  getGalleryImages(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gallery/images`);
  }

  getGalleryImageById(imageId: number | string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gallery/images/${imageId}`);
  }

  updateGalleryImage(imageId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/gallery/images/${imageId}`, data);
  }

  deleteGalleryImage(imageId: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/gallery/images/${imageId}`);
  }

  // --- GALLERY VIDEOS ---
  getGalleryVideos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gallery/videos`);
  }

  getGalleryVideoById(videoId: number | string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gallery/videos/${videoId}`);
  }

  updateGalleryVideo(videoId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/gallery/videos/${videoId}`, data);
  }

  deleteGalleryVideo(videoId: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/gallery/videos/${videoId}`);
  }

  // --- TEAM MEMBERS ---
  getAllTeamMembers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/team`);
  }

  getTeamMemberById(teamId: number | string): Observable<any> {
    return this.http.get(`${this.baseUrl}/team/${teamId}`);
  }

  createTeamMember(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/team`, data);
  }

  updateTeamMember(teamId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/team/${teamId}`, data);
  }

  deleteTeamMember(teamId: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/team/${teamId}`);
  }

  // Upload team member with image
  uploadTeamMember(data: { name: string, role: string, bio?: string }, file: File): Observable<any> {
    const endpoint = `${this.baseUrl}/team/upload`;
    
    const params = new HttpParams()
      .set('name', data.name)
      .set('role', data.role)
      .set('bio', data.bio || '');

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(endpoint, formData, { params: params });
  }

  // --- GENERAL GALLERY ---
  getGallery(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gallery`);
  }

  // --- GALLERY UPLOAD (Dynamic for Image/Video) ---
  uploadGalleryMedia(type: 'image' | 'video', data: any, file: File): Observable<any> {
    const endpoint = `${this.baseUrl}/gallery/upload/${type}`;
    
    // 1. Query Params (Title, Category, Description)
    const params = new HttpParams()
      .set('title', data.title)
      .set('category', data.category)
      .set('description', data.description || '');

    // 2. Form Data (File)
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(endpoint, formData, { params: params });
  }

  // (Optional: Agar future me Teacher upload bhi chahiye)
  uploadTeacher(data: any, file: File): Observable<any> {
    const params = new HttpParams()
      .set('name', data.name)
      .set('role', data.role)
      .set('bio', data.bio || '');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/team/upload`, formData, { params: params });
  }
}