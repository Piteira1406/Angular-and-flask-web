import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html'
})
export class ProductSearchComponent {
  searchTerm: string = '';
  results: any[] = [];

  constructor(private productService: ProductService) {}

  search() {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe(
        (data) => {
          this.results = data;
        },
        (error) => {
          console.error('Erro na pesquisa', error);
        }
      );
    }
  }
}
