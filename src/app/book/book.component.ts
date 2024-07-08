import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ePub from 'epubjs';

@Component({
  selector: 'app-book',
   standalone: true,
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, AfterViewInit {
  private book: any;
  private rendition: any;
  private currentLocation: any;
  bookId?: number;

  constructor(private route: ActivatedRoute) {} 

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.bookId = +id;
        console.log('BookComponent initialized with book ID:', this.bookId);
      } else {
        console.error('Book ID is missing');
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.bookId) {
      this.loadBook();
    }
  }

  loadBook(): void {
    console.log('Loading book...');
    this.book = ePub(`assets/books/book${this.bookId}.epub`); 
    this.rendition = this.book.renderTo('viewer', {
      width: '100%',
      height: '100%'
    });

    this.rendition.display().then(() => {
      console.log('Book displayed');
    }).catch((error: any) => {
      console.error('Error displaying book:', error);
    });

    this.rendition.on('relocated', (location: any) => {
      this.currentLocation = location;
      this.updatePageCounter();
    });

    this.book.ready.then(() => {
      this.book.locations.generate(1000).then(() => {
        this.updatePageCounter();
      });
    });
  }

  updatePageCounter(): void {
    const pageCounter = document.getElementById('page-counter');
    if (pageCounter && this.currentLocation) {
      const currentPage = this.book.locations.locationFromCfi(this.currentLocation.start.cfi) + 1;
      const totalPages = this.book.locations.total + 1;
      pageCounter.innerText = `Page ${currentPage} of ${totalPages}`;
    }
  }

  previousPage(): void {
    this.rendition.prev().then(() => {
      console.log('Previous page displayed');
    }).catch((error: any) => {
      console.error('Error displaying previous page:', error);
    });
  }

  nextPage(): void {
    this.rendition.next().then(() => {
      console.log('Next page displayed');
    }).catch((error: any) => {
      console.error('Error displaying next page:', error);
    });
  }
}
