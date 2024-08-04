import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css']
})
export class FlipbookComponent implements OnInit, AfterViewInit {
  pages: string[] = [
    'Page content for Chapter 1',
    'Page content for Chapter 2',
    'Page content for Chapter 3',
    'Page content for Chapter 4',
    'Page content for Chapter 5',
    'Page content for Chapter 6',
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#flipbook').turn({
        width: 800,
        height: 600,
        autoCenter: true,
        elevation: 50,
        gradients: true,
        duration: 1000,
        when: {
          turning: (event: any, page: number, view: any) => {
            if (page === 1) {
              $('.front-cover').show();
            }
            if (page > 1) {
              $('.front-cover').hide();
            }
          },
          turned: (event: any, page: number, view: any) => {
            if (page === 1) {
              $('.front-cover').show();
            }
            if (page > 1) {
              $('.front-cover').hide();
            }
          }
        }
      });
    }, 1000); // Delay to ensure view is fully initialized
  }
}
