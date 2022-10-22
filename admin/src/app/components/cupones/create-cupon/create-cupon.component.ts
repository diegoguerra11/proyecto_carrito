import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CuponService } from '../../../services/cupon.service';
import { Router } from '@angular/router';
declare var iziToast;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

   public token;

  public cupon : any = {
    tipo : ''
  };
  public load_btn = false;

  constructor(
    private _cuponService : CuponService,
   // private _router: Router
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
  }

  registro(registroForm){
  if (registroForm.valid) {
    console.log(this.cupon);
      //this.load_btn = true;
      this._cuponService.registro_cupon_admin(this.cupon,this.token).subscribe(
        response=>{
        console.log(response);
        },
        error => {
        console.log(error);
        }
      );
         /*   iziToast.show({
              title:'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registro correctamente el nuevo cupon'
            });
    
              this.load_btn = false;

              this._router.navigate(['/panel/cupones']);
    
    
        },
        
          this.load_btn = false;
        }
      );*/
    
  } else {
      iziToast.show({
        title:'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
  }
  }

}
