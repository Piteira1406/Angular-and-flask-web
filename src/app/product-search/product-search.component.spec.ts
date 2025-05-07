import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements AfterViewInit {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  searchActive = false;
  results: any[] = [];

  constructor(private productService: ProductService) {}

  toggleSearch(): void {
    this.searchActive = !this.searchActive;
    this.results = [];
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((event: any) => {
          const value = event.target.value.trim();
          if (value.length >= 2) {
            return this.productService.searchProducts(value);
          } else {
            this.results = [];
            return [];
          }
        })
      )
      .subscribe((data: any[]) => {
        this.results = data;
      });
  }
}
