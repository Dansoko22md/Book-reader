// epub.service.ts
import { Injectable } from '@angular/core';
import ePub, { Book } from 'epubjs';

@Injectable({
  providedIn: 'root'
})
export class EpubService {
  constructor() {}

  async getBookContent(url: string): Promise<string[]> {
    const book: Book = ePub(url);
    await book.ready;

    const contents: string[] = [];

    await book.spine.each(async (item: any) => {
      const section = await item.load(book.load.bind(book));
      const content = await section.render();
      contents.push(content);
    });

    return contents;
  }
}
