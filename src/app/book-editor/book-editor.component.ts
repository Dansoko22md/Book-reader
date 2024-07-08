import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Book {
  id: number;
  title: string;
  cover: string;
}

@Component({
  selector: 'app-book-editor',
  templateUrl: './book-editor.component.html',
  styleUrls: ['./book-editor.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookEditorComponent {
  books: Book[] = [
    { id: 1, title: 'Le Petit Prince', cover: 'assets/covers/book1.jpg' },
    { id: 2, title: 'Les Misérables', cover: 'assets/covers/book2.jpg' },
    { id: 3, title: 'L’Étranger', cover: 'assets/covers/book3.jpg' },
    { id: 4, title: 'La Peste', cover: 'assets/covers/book4.jpg' }
  ];

  constructor(private router: Router) {}

  editBook(bookId: number): void {
    console.log('Edit book with ID:', bookId);
    // Naviguer vers une page d'édition de livre spécifique
  }
}
