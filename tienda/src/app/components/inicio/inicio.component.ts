import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { GuestService } from 'src/app/services/guest.service';
declare let tns: (arg0: { container: string; controlsText?: string[]; mode?: string; navContainer?: string; responsive: { 0: { controls: boolean; }; 991: { controls: boolean; }; } | { 0: { gutter: number; }; 400: { items: number; gutter: number; }; 520: { gutter: number; }; 768: { items: number; gutter: number; }; } | { 0: { items: number; gutter: number; }; 420: { items: number; gutter: number; }; 600: { items: number; gutter: number; }; 700: { items: number; gutter: number; }; 900: { items: number; gutter: number; }; 1200: { items: number; gutter: number; }; 1400: { items: number; gutter: number; }; } | { 0: { items: number; gutter: number; }; 480: { items: number; gutter: number; }; 700: { items: number; gutter: number; }; 1100: { items: number; gutter: number; }; } | { 0: { items: number; }; 380: { items: number; }; 550: { items: number; }; 750: { items: number; }; 1000: { items: number; }; 1250: { items: number; }; } | { 0: { items: number; }; 500: { items: number; }; 1200: { items: number; }; }; controls?: boolean; mouseDrag?: boolean; nav?: boolean; controlsContainer?: string; gutter?: number; }) => void;
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public url;
  public new_productos:Array<any>=[];
  public mas_vendidos:Array<any>=[];
  public categorias : Array<any>=[];

  constructor(
    private _clienteService: ClienteService,
    private _guestService:GuestService
  ) {
    this.url=GLOBAL.url;
    this._clienteService.obtener_config_publico().subscribe(
      response=>{
        response.data.categorias.forEach((element : any) => {
          if(element.titulo=='Smartphones'){
            this.categorias.push({
              titulo:element.titulo,
              portada:'https://img.freepik.com/premium-psd/chat-mockup-with-devices-arrangement_23-2149112957.jpg?w=1060'
            });
          }else if(element.titulo=='Headphones'){
            this.categorias.push({
              titulo:element.titulo,
              portada:'https://img.freepik.com/free-photo/carefree-happy-relieved-african-american-handsome-hipster-guy-listening-music-headphones-dancing-shaking-hands-into-rhythm-close-eyes-singing-along-earphones-orange-background_1258-73013.jpg?w=1380&t=st=1669077358~exp=1669077958~hmac=6f3af8a0c376900340988a511a4212cf620347e166e3a3037a119a2d020c1377'
            });
          }else if(element.titulo=='Oficina'){
            this.categorias.push({
              titulo:element.titulo,
              portada:'https://img.freepik.com/free-photo/young-business-people-office-working-with-tablet_23-2149206515.jpg?w=1380&t=st=1669077409~exp=1669078009~hmac=9569ab6c007439f325651fa85f0d58e98019f5c9113b59938a14efb28efee11c'
            });
          }else if(element.titulo=='Moda'){
            this.categorias.push({
              titulo:element.titulo,
              portada:'https://img.freepik.com/free-photo/close-up-bright-positve-portrait-trendy-blogger-influencer-blonde-woman-wearing-bright-outfit-sunglasses-posing-near-blue-wall_291049-2873.jpg?w=1380&t=st=1669077236~exp=1669077836~hmac=b94cad6e7114d4afa337f0eac2c5bd6f248907a5e1b2eb25d109f4167dc085f3'
            });
          }else if(element.titulo=='Alimentos'){
            this.categorias.push({
              titulo:element.titulo,
              portada:'https://img.freepik.com/free-photo/fast-food-dish-blue_155003-27518.jpg?w=1380&t=st=1669077448~exp=1669078048~hmac=f2a34f8ff036abf110381a11cd622e1cdfec6d47e5ec705465eb3c56bcf96e17'
            });
          }else if(element.titulo=='Hogar'){
            this.categorias.push({
              titulo:element.titulo,
              portada:'https://img.freepik.com/free-photo/crop-hand-holding-house-near-coins_23-2147797665.jpg?w=1380&t=st=1669077482~exp=1669078082~hmac=ad9de727bc9d4a90755008b074186cc31b03aebde019822c033a2aa70a8b6262'
            });
          }
        });
      }
    )
   }

  ngOnInit(): void {

    this._guestService.listar_productos_nuevos_publico().subscribe(
      response=>{
        this.new_productos=response.data;
      }
    );

    this._guestService.listar_productos_masvendidos_publico().subscribe(
      response=>{
        this.mas_vendidos=response.data;
      }
    );

    setTimeout(()=>{

      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true }
        }
      });

      tns({
        container: '.cs-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20
          },
          400: {
            items: 2,
            gutter: 20
          },
          520: {
            gutter: 30
          },
          768: {
            items: 3,
            gutter: 30
          }
        }

      });

      tns({
        container: '.cs-carousel-inner-three',
        controls: false,
        mouseDrag: !0,
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          420: {
            items: 2,
            gutter: 20
          },
          600: {
            items: 3,
            gutter: 20
          },
          700: {
            items: 3,
            gutter: 30
          },
          900: {
            items: 4,
            gutter: 30
          },
          1200: {
            items: 5,
            gutter: 30
          },
          1400: {
            items: 6,
            gutter: 30
          }
        }


      });

      tns({
        container: '.cs-carousel-inner-four',
        nav: false,
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        controlsContainer:'#custom-controls-trending',
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }

      });

      tns({
        container: '.cs-carousel-inner-five',
        controls: false,
        gutter: 30,
        responsive: {
          0: { items: 1 },
          380: { items: 2 },
          550: { items: 3 },
          750: { items: 4 },
          1000: { items: 5 },
          1250: { items: 6 }
        }

      });

      tns({
        container: '.cs-carousel-inner-six',
        controls: false,
        gutter: 15,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          1200: { items: 3 }
        }

      });

    },500);
  }

}
