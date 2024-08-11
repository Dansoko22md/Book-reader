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
  private currentLocation1: any;
  private currentLocation2: any;
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

    this.book.ready.then(() => {
      this.book.locations.generate(1000).then(() => {
        this.rendition1.display().then(() => {
          this.currentLocation1 = this.rendition1.currentLocation()?.start.cfi;
          this.displayNextPageInViewer2();
          this.updatePageCounter();
          console.log('Page displayed in viewer-1');
        }).catch((error: any) => {
          console.error('Error displaying page in viewer-1:', error);
        });
      });
    });

    this.rendition1.on('relocated', (location: any) => {
      this.currentLocation1 = location?.start?.cfi;
      this.updatePageCounter();
    });

    this.rendition2.on('relocated', (location: any) => {
      this.currentLocation2 = location?.start?.cfi;
    });
  }

  displayNextPageInViewer2(): void {
    this.rendition2.display(this.currentLocation1).then(() => {
      this.rendition2.next().then(() => {
        this.currentLocation2 = this.rendition2.currentLocation()?.start.cfi;
        console.log('Next page displayed in viewer-2');
      }).catch((error: any) => {
        console.error('Error displaying next page in viewer-2:', error);
      });
    }).catch((error: any) => {
      console.error('Error displaying current page in viewer-2:', error);
    });
  }

  displayPreviousPageInViewer2(): void {
    if (this.currentLocation1 !== this.book.locations[0].start.cfi) {
      this.rendition2.prev().then(() => {
        this.currentLocation2 = this.rendition2.currentLocation()?.start.cfi;
        console.log('Previous page displayed in viewer-2');
      }).catch((error: any) => {
        console.error('Error displaying previous page in viewer-2:', error);
      });
    }
  }

  updatePageCounter(): void {
    const pageCounter = document.getElementById('page-counter');
    if (pageCounter && this.currentLocation1) {
      const currentPage = this.book.locations.locationFromCfi(this.currentLocation1) + 1;
      const totalPages = this.book.locations.total;
      pageCounter.innerText = `Page ${currentPage} of ${totalPages}`;
    }
  }

  previousPage(): void {
    if (this.book.locations.locationFromCfi(this.currentLocation1) > 0) {
      this.rendition2.prev().then(() => {
        this.currentLocation2 = this.rendition2.currentLocation()?.start.cfi;
        this.rendition1.prev().then(() => {
          this.currentLocation1 = this.rendition1.currentLocation()?.start.cfi;
          this.updatePageCounter();
          console.log('Previous pages displayed in both viewers');
        }).catch((error: any) => {
          console.error('Error displaying previous page in viewer-1:', error);
        });
      }).catch((error: any) => {
        console.error('Error displaying previous page in viewer-2:', error);
      });
    } else {
      console.log('Already at the first page, cannot go back further.');
    }
  }

  nextPage(): void {
    const totalPages = this.book.locations.total;

    if (this.book.locations.locationFromCfi(this.currentLocation1) < totalPages - 1) {
      this.rendition1.next().then(() => {
        this.currentLocation1 = this.rendition1.currentLocation()?.start.cfi;
        this.displayNextPageInViewer2();
        this.updatePageCounter();
        console.log('Next pages displayed in both viewers');
      }).catch((error: any) => {
        console.error('Error displaying next pages:', error);
      });
    } else {
      console.log('Already at the last page, cannot go forward.');
    }
  }
}
