import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  books: Book[] = [
    { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', cover: 'assets/covers/prince.jpg' },
    { id: 2, title: 'Les Misérables', author: 'Victor Hugo', cover: 'assets/covers/book2.jpeg' },
    { id: 3, title: 'L’Étranger', author: 'Albert Camus', cover: 'assets/covers/book3.jpeg' },
    { id: 4, title: 'La Peste', author: 'Albert Camus', cover: 'assets/covers/book4.jpg' },
    { id: 5, title: 'Alice', author: 'Lewis Carroll', cover: 'assets/covers/book.jpg' }
    
  ];
  filteredBooks: Book[] = this.books;

  constructor(private router: Router) {} // Inject Router

  ngOnInit(): void {}

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
    );
  }

  openBook(bookId: number): void {
    console.log('Open book with ID:', bookId);
    this.router.navigate(['/book', bookId]);
  }
}
