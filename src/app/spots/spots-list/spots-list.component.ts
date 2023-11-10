import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Spots, SpotsService } from '../services/spots.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-spots-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spots-list.component.html',
})
export class SpotsListComponent implements OnInit {
  private authService = inject(AuthService);
  private spotsService = inject(SpotsService);
  private router = inject(Router);

  protected isLoading: boolean = true;

  spots: Spots[] = [];

  getSpots() {
    const result = this.spotsService.getSpots();

    result.subscribe({
      next: (res) => {
        this.spots = res.spots;

        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 401) this.router.parseUrl('/login');

        this.isLoading = false;
      },
    });
  }

  selectSpot(slug: string) {
    this.router.navigate([`/spots/${slug}`]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.getSpots();
  }
}
