import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';

export interface Spots {
  id: string;
  name: string;
  slug: string;
  cyclingAccessibility: boolean;
}

export interface SpotDetail extends Spots {
  latitude: number;
  longitude: number;
  distanceInKilometers: number;
}

export interface CalculateDistanceRequest {
  longitude: number;
  latitude: number;
  cyclingSpeed: number;
  dailyCyclingHours: number;
}

export interface CalculatedDistance {
  distance: number;
}

export interface CyclingEstimatedTime {
  estimatedArrivalHours: number;
  estimatedArrivalTimestamp: number;
}

type SpotsAPIResponse = {
  spots: Spots[];
};

type SpotDetailAPIResponse = SpotDetail;

type CalculatedDistanceAPIResponse = CalculatedDistance;

type CyclingEstimatedTimeAPIResponse = CyclingEstimatedTime;

@Injectable({
  providedIn: 'root',
})
export class SpotsService {
  private http = inject(HttpClient);
  private spotsApi = 'https://cycle-around-the-world.vercel.app/api/v1/spots';
  private authService = inject(AuthService);

  getSpots(): Observable<SpotsAPIResponse> {
    return this.http.get<SpotsAPIResponse>(this.spotsApi, {
      headers: {
        Authorization: this.authService.getBearerToken(),
      },
    });
  }

  getSpotDetail(slug: string): Observable<SpotDetailAPIResponse> {
    return this.http.get<SpotDetailAPIResponse>(`${this.spotsApi}/${slug}`, {
      headers: {
        Authorization: this.authService.getBearerToken(),
      },
    });
  }

  calculateDistance(
    slug: string,
    data: CalculateDistanceRequest
  ): Observable<CalculatedDistanceAPIResponse> {
    return this.http.post<CalculatedDistanceAPIResponse>(
      `${this.spotsApi}/${slug}/calculate`,
      data,
      {
        headers: {
          Authorization: this.authService.getBearerToken(),
        },
      }
    );
  }

  getCyclingEstimatedTime(
    slug: string
  ): Observable<CyclingEstimatedTimeAPIResponse> {
    return this.http.get<CyclingEstimatedTimeAPIResponse>(
      `${this.spotsApi}/${slug}/estimate`,
      {
        headers: {
          Authorization: this.authService.getBearerToken(),
        },
      }
    );
  }
}
