import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { MessageBox } from '../../utils/MessageBox';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any = '';
  
  constructor(
    private _adminService:AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
   }

  ngOnInit(): void {
    console.log(this.token);
    
    if(this.token){
      this._router.navigate(['/']); 
      return;
    }
  }


  login(loginForm){
    if(!loginForm.valid){MessageBox.messageError('Los datos del formulario no son validos'); return;}

    console.log(this.user)
    
    let data={
      email: this.user.email,
      password: this.user.password
    }

    this._adminService.login_admin(data).subscribe(
      response =>{
        if(response.data == undefined){MessageBox.messageError(response.message); return;}
        
        this.usuario = response.data;

        localStorage.setItem('token',response.token);
        localStorage.setItem('_id',response.data._id);

        this._router.navigate(['/']);

        console.log(response);
      },
      error=>{
        console.log(error);
      }
    );
  }
}
