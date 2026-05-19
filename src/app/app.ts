import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FeatureCategoryNavComponent } from './components/feature-category-nav.component';
import { SearchComponent } from './components/search.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FeatureCategoryNavComponent, SearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  sidebarOpen = false;
}
