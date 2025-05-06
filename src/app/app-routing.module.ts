import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ProductListComponent } from './ecommerce/product-list/product-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductSingleComponent } from './ecommerce/product-single/product-single.component';
import { ProductSearchComponent } from './product-search/product-search.component';

const routes: Routes = [
  {path:'', component:ProductListComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'product-single', component:ProductSingleComponent},
  {path:'search', component:ProductSearchComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
