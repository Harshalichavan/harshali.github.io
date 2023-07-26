import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://jocata.thinkoverit.com/api'; // Replace with your API base URL

  constructor(private http: HttpClient) { }

  sendOTP(payload: any): Observable<any> {
    const url = `${this.baseUrl}/getOTP.php`;
    return this.http.post(url, payload);
  }

  verifyOTP(payload: any): Observable<any> {
    const url = `${this.baseUrl}/verifyOTP.php`;
    return this.http.post(url, payload);
  }

  resendOTP(payload: any): Observable<any> {
    const url = `${this.baseUrl}/getOTP.php`; // Use the same endpoint for resendOTP as getOTP
    return this.http.post(url, payload);
  }
}
