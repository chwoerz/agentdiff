import { Routes } from "@angular/router";
import { LandingComponent } from "./pages/landing.component";
import { CompareListComponent } from "./pages/compare-list.component";
import { FeatureDetailComponent } from "./pages/feature-detail.component";
import { HarnessProfileComponent } from "./pages/harness-profile.component";

export const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "compare", component: CompareListComponent },
  { path: "compare/:featureId", component: FeatureDetailComponent },
  { path: "harness/:harnessId", component: HarnessProfileComponent },
  { path: "harness/:harnessId/:platformId", component: HarnessProfileComponent },
  { path: "**", redirectTo: "" },
];
