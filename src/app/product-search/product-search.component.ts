import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from '../service/product.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  results: any[] = [];
  inputValue: string = '';
  isLoading: boolean = false;
  showModal: boolean = false;

  constructor(private productService: ProductService) {}

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((event: any) => {
          const value = event.target.value.trim();
          this.inputValue = value;

          if (value.length >= 2) {
            this.isLoading = true;
            return this.productService.searchProducts(value);
          } else {
            this.results = [];
            this.isLoading = false;
            return [];
          }
        })
      )
      .subscribe(
        (data) => {
          this.results = data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Erro:', error);
          this.isLoading = false;
        }
      );
  }

  openModal() {
    console.log('Abrir modal. Nº de resultados:', this.results.length);
    if (this.results.length > 0) {
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
