import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
}

@Component({
  selector: 'app-book-cover',
  templateUrl: './book-cover.component.html',
  styleUrls: ['./book-cover.component.css']
})
export class BookCoverComponent implements OnInit {
  bookId?: number;
  bookTitle: string = '';
  bookCover: string = '';

  books: Book[] = [
    { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', cover: 'assets/covers/prince.jpg' },
    { id: 2, title: 'Les Misérables', author: 'Victor Hugo', cover: 'assets/covers/book2.jpeg' },
    { id: 3, title: 'L’Étranger', author: 'Albert Camus', cover: 'assets/covers/book3.jpeg' },
    { id: 4, title: 'La Peste', author: 'Albert Camus', cover: 'assets/covers/book4.jpg' },
    { id: 5, title: 'Alice', author: 'Lewis Carroll', cover: 'assets/covers/book.jpg' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = +params.get('id')!;
      this.loadBookDetails();
    });
  }

  loadBookDetails(): void {
    const book = this.books.find(b => b.id === this.bookId);
    if (book) {
      this.bookTitle = book.title;
      this.bookCover = book.cover;
    }
  }

  openBook(): void {
    this.router.navigate(['/book', this.bookId]);
  }
}
