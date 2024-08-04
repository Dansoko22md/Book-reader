import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookComponent } from './book/book.component';
import { BookEditorComponent } from './book-editor/book-editor.component';
import { FlipbookComponent } from './flipbook/flipbook.component';




export const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'book/:id', component: BookComponent },
    { path: 'flipbook', component: FlipbookComponent },
  { path: 'editor', component: BookEditorComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
