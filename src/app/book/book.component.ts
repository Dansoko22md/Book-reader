import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-book',
  standalone: true,
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, AfterViewInit {
  private currentChapter: number = 1;
  private currentPage: number = 1;
  private totalPages: number = 0;

  constructor() { }

  ngOnInit(): void {
    console.log('BookComponent initialized');
  }

  ngAfterViewInit(): void {
    this.loadChapter();
  }

  loadChapter(): void {
    this.totalPages = this.getLastPageNumber(this.currentChapter);
    this.loadPages();
  }

  loadPages(): void {
    const leftPagePath = `assets/books/alice/chapter${this.currentChapter}/page${this.currentPage}.xhtml`;
    const rightPagePath = this.currentPage + 1 <= this.totalPages
      ? `assets/books/alice/chapter${this.currentChapter}/page${this.currentPage + 1}.xhtml`
      : '';

    this.loadPageContent('left-page', leftPagePath);
    if (rightPagePath) {
      this.loadPageContent('right-page', rightPagePath);
    } else {
      this.clearPageContent('right-page');
    }
  }

  loadPageContent(containerId: string, pagePath: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      fetch(pagePath)
        .then(response => response.text())
        .then(html => {
          container.innerHTML = html;
          this.updateImagesPaths(container);
        })
        .catch(error => {
          console.error('Error loading page content:', error);
          container.innerHTML = '<p>Page not found.</p>';
        });
    }
  }

  clearPageContent(containerId: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  }

  updateImagesPaths(container: HTMLElement): void {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('assets/')) {
        img.src = `assets/books/alice/chapter${this.currentChapter}/images/${src}`;
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 2) {
      this.currentPage -= 2;
    } else if (this.currentChapter > 1) {
      this.currentChapter -= 1;
      this.currentPage = this.getLastPageNumber(this.currentChapter) - 1;
    } else {
      this.currentPage = 1;
    }
    this.loadChapter();
  }

  nextPage(): void {
    if (this.currentPage + 2 <= this.totalPages) {
      this.currentPage += 2;
    } else if (this.hasNextChapter()) {
      this.currentChapter += 1;
      this.currentPage = 1;
    }
    this.loadChapter();
  }

  pageExists(pagePath: string): boolean {
    const http = new XMLHttpRequest();
    http.open('HEAD', pagePath, false);
    http.send();
    return http.status !== 404;
  }

  getLastPageNumber(chapter: number): number {
    let lastPage = 1;
    while (this.pageExists(`assets/books/alice/chapter${chapter}/page${lastPage}.xhtml`)) {
      lastPage += 1;
    }
    return lastPage - 1;
  }

  hasNextChapter(): boolean {
    const nextChapterPath = `assets/books/alice/chapter${this.currentChapter + 1}/page1.xhtml`;
    return this.pageExists(nextChapterPath);
  }
}
