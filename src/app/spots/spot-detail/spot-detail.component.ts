import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CyclingEstimatedTime,
  SpotDetail,
  SpotsService,
} from '../services/spots.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DateTimeFormatPipe } from '../../pipes/date-time.pipe';
import { TimeFormatPipe } from '../../pipes/time.pipe';
import { AuthService } from '../../auth/services/auth.service';

interface CalculateDistanceForm {
  cyclingSpeed: number;
  dailyCyclingHours: number;
}

@Component({
  selector: 'app-spot-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateTimeFormatPipe,
    TimeFormatPipe,
  ],
  templateUrl: './spot-detail.component.html',
})
export class SpotDetailComponent implements OnInit {
  private authService = inject(AuthService);
  private spotsService = inject(SpotsService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);

  protected isLoading: boolean = true;
  protected isCalculating: boolean = false;
  protected error?: string;
  protected calculateDistanceForm: FormGroup = this.formBuilder.group({
    cyclingSpeed: [10, [Validators.required, Validators.min(0)]],
    dailyCyclingHours: [
      10,
      [Validators.required, Validators.min(0), Validators.max(24)],
    ],
  });

  spot?: SpotDetail;

  slug: string = '';

  cyclingEstimatedTime?: CyclingEstimatedTime;

  goToSpotList() {
    this.router.navigate(['/spots']);
  }

  getSpotDetail() {
    const result = this.spotsService.getSpotDetail(this.slug);

    result.subscribe({
      next: (res) => {
        this.spot = res;

        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (err.status === 404) this.error = err.error.message;

        this.isLoading = false;
      },
    });
  }

  calculateDistance() {
    if (!this.calculateDistanceForm.valid) return;

    const calculateDistanceFormValue = this.calculateDistanceForm
      .value as CalculateDistanceForm;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const result = this.spotsService.calculateDistance(this.slug, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          cyclingSpeed: calculateDistanceFormValue.cyclingSpeed,
          dailyCyclingHours: calculateDistanceFormValue.dailyCyclingHours,
        });

        this.isCalculating = true;

        result.subscribe({
          next: (res) => {
            this.spot!.distanceInKilometers = res.distance;

            this.getCyclingEstimatedTime();

            this.isCalculating = false;
          },
          error: (err) => {
            if (err.status === 401) {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
            if (err.status === 400) window.alert(err.error.message);
            if (err.status === 404) this.error = err.error.message;

            this.isCalculating = false;
          },
        });
      },
      (error) => {
        window.alert(error.message);
      }
    );
  }

  getCyclingEstimatedTime() {
    const result = this.spotsService.getCyclingEstimatedTime(this.slug);

    this.isCalculating = true;

    result.subscribe({
      next: (res) => {
        this.cyclingEstimatedTime = res;

        this.isCalculating = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (err.status === 400) window.alert(err.error.message);
        if (err.status === 404) this.error = err.error.message;

        this.isCalculating = false;
      },
    });
  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe({
      next: (params) => {
        this.slug = params.get('spotNameSlug')!;

        this.getSpotDetail();
      },
    });
  }
}
