import { Routes } from '@angular/router';
import { GraphComponent } from './components/graph/graph.component';
import { SortComponent } from './components/sort.component';

export const routes = [
  { path: 'graphs', component: GraphComponent, label: 'Graphs' },
  { path: 'sorting', component: SortComponent, label: 'Sorting' },
] as const;

export type Route = (typeof routes)[number];

export const angularRoutes: Routes = [...routes];