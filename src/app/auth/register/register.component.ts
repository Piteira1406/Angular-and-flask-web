import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

person = {
  name: '',
  email: '',
  password: '',
  repassword: ''
}

passwordMatch(){
  /*if(this.person.password !== this.person.repassword) {
    return 'As passwords não fazem match';
  }else{
  return 'As passwords fazem match';
  } */

  if(this.person.repassword=='' && this.person.password==''){
    return ''
  }else if(this.person.password == this.person.repassword){
    return 'As passwords fazem match'

  }else{
    return 'As passwords não fazem match'

  }

}

changePasswordColor(){
  return (this.person.password == this.person.repassword) ? 'positive' : 'negative'
}

logConsole(){
  console.log(this.person);
}


}
