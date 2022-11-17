import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public token;
  public total_ganancia = 0;
  public total_mes = 0;
  public cont_ventas= 0;
  public total_mes_anterior =0;
  
  constructor( private _adminService:AdminService, ) {
    this.token = localStorage.getItem("token");
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe(
      response => {
        this.total_ganancia = response.total_ganancia;
        this.total_mes = response.total_mes;
        this.cont_ventas = response.cont_ventas;
        this.total_mes_anterior = response.total_mes_anterior;
        let canvas = <HTMLCanvasElement> document.getElementById("myChart");
    let ctx = canvas.getContext("2d")!;

    let myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [{
          label: 'Meses',
          data: [response.enero, response.febrero, response.marzo, response.abril, response.mayo, response.junio, response.julio, response.agosto, response.septiembre, response.octubre, response.noviembre, response.diciembre
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
      }
    );
  }
}
