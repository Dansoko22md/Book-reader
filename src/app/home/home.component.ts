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

    { id: 2, title: 'La Peste', author: 'Albert Camus', cover: 'assets/covers/book4.jpg' },

    
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
    this.router.navigate(['/cover', bookId]);
  }
}
