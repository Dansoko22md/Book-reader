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
  private rendition1: any;
  private rendition2: any;
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
    this.rendition1 = this.book.renderTo('viewer-1', {
      width: '100%',
      height: '100%'
    });

    this.rendition2 = this.book.renderTo('viewer-2', {
      width: '100%',
      height: '100%'
    });

    this.rendition1.display().then(() => {
      this.syncViewers();
      console.log('Book displayed in viewer-1');
    }).catch((error: any) => {
      console.error('Error displaying book in viewer-1:', error);
    });

    this.rendition1.on('relocated', (location: any) => {
      this.currentLocation = location;
      this.updatePageCounter();
      this.syncViewers();
    });

    this.book.ready.then(() => {
      this.book.locations.generate(1000).then(() => {
        this.updatePageCounter();
      });
    });
  }

  syncViewers(): void {
    if (this.currentLocation) {
      const nextCfi = this.book.locations.cfiFromLocation(this.currentLocation.end.location);
      this.rendition2.display(nextCfi).then(() => {
        console.log('Next page displayed in viewer-2');
      }).catch((error: any) => {
        console.error('Error displaying next page in viewer-2:', error);
      });
    }
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
    this.rendition1.prev().then(() => {
      this.syncViewers();
      console.log('Previous page displayed in viewer-1');
    }).catch((error: any) => {
      console.error('Error displaying previous page in viewer-1:', error);
    });
  }

  nextPage(): void {
    this.rendition1.next().then(() => {
      this.syncViewers();
      console.log('Next page displayed in viewer-1');
    }).catch((error: any) => {
      console.error('Error displaying next page in viewer-1:', error);
    });
  }
}
