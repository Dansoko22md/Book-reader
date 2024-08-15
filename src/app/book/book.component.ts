import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ePub from 'epubjs';

@Component({
  selector: 'app-book',
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
      height: '100%',
      spread: 'auto' // Spread pages automatically to handle two pages view
    });

    this.rendition.display().then(() => {
      console.log('Book displayed');
      this.updatePageNumbers();
      this.updateNavigationButtons();
    }).catch((error: any) => {
      console.error('Error displaying book:', error);
    });

    this.rendition.on('relocated', (location: any) => {
      this.currentLocation = location;
      this.updatePageNumbers();
      this.updateNavigationButtons();
    });

    this.book.ready.then(() => {
      this.book.locations.generate(1000).then(() => {
        this.updatePageNumbers();
        this.updateNavigationButtons();
      });
    });
  }

  updatePageNumbers(): void {
    const leftPageNumber = document.querySelector('.left-page-number');
    const rightPageNumber = document.querySelector('.right-page-number');

    if (this.currentLocation && this.book.locations) {
      const currentPage = this.book.locations.locationFromCfi(this.currentLocation.start.cfi) + 1;
      const totalPages = this.book.locations.total;

      if (leftPageNumber) {
        leftPageNumber.textContent = `${currentPage}`;
      }

      if (rightPageNumber) {
        rightPageNumber.textContent = `${Math.min(currentPage + 1, totalPages)}`;
      }

      console.log(`Current pages: ${currentPage} and ${Math.min(currentPage + 1, totalPages)}`);
    }
  }

  updateNavigationButtons(): void {
    const leftButton = document.querySelector('.left-button') as HTMLElement;
    const rightButton = document.querySelector('.right-button') as HTMLElement;

    if (this.currentLocation && this.book.locations) {
      const currentPage = this.book.locations.locationFromCfi(this.currentLocation.start.cfi) + 1;
      const totalPages = this.book.locations.total;

      // Hide left button on the first page
      if (currentPage === 1) {
        leftButton.style.display = 'none';
         rightButton.style.marginLeft = '35px';
      } else {
        leftButton.style.display = 'block';
         rightButton.style.marginLeft = '0';
      }

      // Hide right button on the last page
      if (currentPage >= totalPages) {
        rightButton.style.display = 'none';
         leftButton.style.marginLeft = '-35px';
      } else {
        rightButton.style.display = 'block';
         leftButton.style.marginLeft = '0';
      }
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
