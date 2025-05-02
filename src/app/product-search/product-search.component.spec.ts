import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {ProductService } from '../service/product.service';


@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent implements OnInit {
  searchControl = new FormControl();
  products$!: Observable<any[]>;
  isLoading = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.liveSearch(
      this.searchControl.valueChanges
    );
  }
}