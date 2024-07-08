import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

interface Book {
  title: string;
  author: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
   imports: [CommonModule,RouterOutlet,RouterLink]
})
export class AppComponent {
  title = 'app-reader';
    menuActive = false;
  books: Book[] = [
    { title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry' },
    { title: 'Les Misérables', author: 'Victor Hugo' },
    { title: 'L’Étranger', author: 'Albert Camus' },
    // Ajoutez d'autres livres ici
  ];
  filteredBooks: Book[] = this.books;

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
    );
  }
  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }
}
