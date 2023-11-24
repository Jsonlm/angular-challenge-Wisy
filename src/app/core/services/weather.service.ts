import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) {}

  getWeatherForecast(zone: string): Observable<any> {
    const apiUrl = `https://api.weather.gov/gridpoints/${zone}/31,80/forecast`;
    return this.http.get(apiUrl);
  }
}
