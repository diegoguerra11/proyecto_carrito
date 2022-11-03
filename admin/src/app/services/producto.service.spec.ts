import { of } from 'rxjs';
import { ProductoService } from './producto.service';

describe('Prueba de Producto service', () => {
    let service: ProductoService;
    let httpClientSpy: {
        post: jasmine.Spy,
        put:  jasmine.Spy,
        get:  jasmine.Spy,
        delete: jasmine.Spy 
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpCliente', ['post', 'put', 'get', 'delete']);
        service = new ProductoService(httpClientSpy as any);
    });

    it('Debe crearse correctamente el servicio', () => {
        expect(service).toBeTruthy();
    });

    it('Fuciona correctamente registro_producto_admin', (done: DoneFn) => {
        const mockProducto = {
            data: {
                titulo:'Camisa Futbolera - fresa',
                stock:150,
                precio:150,
                descripcion:"undefined",
                contenido:"<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
                categoria:'Polo',
            },
            file:'5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg',
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": "61a444a8a57633446458fad8",
            "precio_antes_soles": 190,
            "precio_antes_dolares": 55,
            "nventas": 9,
            "stock": 5,
            "galeria": [
            {
                "imagen": "5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg",
                "_id": "681c165f-39b1-4335-b6a5-eaf3ddb33f60"
            },
            {
                "imagen": "cvmKCm10_p1TWYRQjJELFrka.png",
                "_id": "33cfd3a5-cb7f-4fda-ad59-4f0cfeb29564"
            },
            {
                "imagen": "FF66zdMmOs5w7-EP-9euRbMx.jpg",
                "_id": "632fc816-d719-4e47-ba38-eb2afadba55c"
            },
            {
                "imagen": "yOZ-pCoqJqOHgKd0oSlmARuH.JPG",
                "_id": "955ce972-deb6-4348-a0ee-0daa18a916cd"
            }
            ],
            "estado": "Publicado",
            "titulo": "Camisa Futbolera - fresa",
            "precio": 153,
            "precio_dolar": 49,
            "peso": "100GR",
            "sku": "ASD456AS4D65AS",
            "descripcion": "undefined",
            "contenido": "<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
            "categoria": "Polo",
            "visibilidad": "Todo el mundo",
            "slug": "camisa-futbolera---fresa",
            "portada": "iduxK4TtthLpmKX9goaqlJ4Q.jpg",
            "createdAt": {
            "$date": {
                "$numberLong": "1638155432049"
            }
            },
            "__v": 0,
            "titulo_variedad": "Talla"
        }

        const {data, file ,token} = mockProducto;

        httpClientSpy.post.and.returnValue(of(mockResult));

        service.registro_producto_admin(data, file, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente listar_producto_admin', (done: DoneFn) => {
        const mockData ={
            filtro:'+-Precio',
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = [
            {
                "_id": {
                  "$oid": "61a444a8a57633446458fad8"
                },
                "precio_antes_soles": 190,
                "precio_antes_dolares": 55,
                "nventas": 9,
                "stock": 5,
                "galeria": [
                  {
                    "imagen": "5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg",
                    "_id": "681c165f-39b1-4335-b6a5-eaf3ddb33f60"
                  },
                  {
                    "imagen": "cvmKCm10_p1TWYRQjJELFrka.png",
                    "_id": "33cfd3a5-cb7f-4fda-ad59-4f0cfeb29564"
                  },
                  {
                    "imagen": "FF66zdMmOs5w7-EP-9euRbMx.jpg",
                    "_id": "632fc816-d719-4e47-ba38-eb2afadba55c"
                  },
                  {
                    "imagen": "yOZ-pCoqJqOHgKd0oSlmARuH.JPG",
                    "_id": "955ce972-deb6-4348-a0ee-0daa18a916cd"
                  }
                ],
                "estado": "Publicado",
                "titulo": "Camisa Futbolera - fresa",
                "precio": 153,
                "precio_dolar": 49,
                "peso": "100GR",
                "sku": "ASD456AS4D65AS",
                "descripcion": "undefined",
                "contenido": "<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
                "categoria": "Polo",
                "visibilidad": "Todo el mundo",
                "slug": "camisa-futbolera---fresa",
                "portada": "iduxK4TtthLpmKX9goaqlJ4Q.jpg",
                "createdAt": {
                  "$date": {
                    "$numberLong": "1638155432049"
                  }
                },
                "__v": 0,
                "titulo_variedad": "Talla"
            }
        ]

        const {filtro, token} = mockData;

        httpClientSpy.get.and.returnValue(of(mockResult));

        service.listar_productos_admin(filtro, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente actualizar_producto_admin (con portada)', (done: DoneFn) => {
        const mockProducto = {
            id:'61a444a8a57633446458fad8',
            data: {
                titulo:'Camisa Futbolera - fresa',
                stock:150,
                precio:150,
                descripcion:"undefined",
                contenido:"<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
                categoria:'Polo',
                portada:'5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg'
            },
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult =   {
            "_id": {
              "$oid": "61a444a8a57633446458fad8"
            },
            "precio_antes_soles": 190,
            "precio_antes_dolares": 55,
            "nventas": 9,
            "stock": 5,
            "galeria": [
              {
                "imagen": "5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg",
                "_id": "681c165f-39b1-4335-b6a5-eaf3ddb33f60"
              },
              {
                "imagen": "cvmKCm10_p1TWYRQjJELFrka.png",
                "_id": "33cfd3a5-cb7f-4fda-ad59-4f0cfeb29564"
              },
              {
                "imagen": "FF66zdMmOs5w7-EP-9euRbMx.jpg",
                "_id": "632fc816-d719-4e47-ba38-eb2afadba55c"
              },
              {
                "imagen": "yOZ-pCoqJqOHgKd0oSlmARuH.JPG",
                "_id": "955ce972-deb6-4348-a0ee-0daa18a916cd"
              }
            ],
            "estado": "Publicado",
            "titulo": "Camisa Futbolera - fresa",
            "precio": 153,
            "precio_dolar": 49,
            "peso": "100GR",
            "sku": "ASD456AS4D65AS",
            "descripcion": "undefined",
            "contenido": "<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
            "categoria": "Polo",
            "visibilidad": "Todo el mundo",
            "slug": "camisa-futbolera---fresa",
            "portada": "iduxK4TtthLpmKX9goaqlJ4Q.jpg",
            "createdAt": {
              "$date": {
                "$numberLong": "1638155432049"
              }
            },
            "__v": 0,
            "titulo_variedad": "Talla"
        }

        const {id, data, token} = mockProducto;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.actualizar_producto_admin(data, id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente actualizar_producto_admin (sin portada)', (done: DoneFn) => {
        const mockProducto = {
            id:'61a444a8a57633446458fad8',
            data: {
                titulo:'Camisa Futbolera - fresa',
                stock:150,
                precio:150,
                descripcion:"undefined",
                contenido:"<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
                categoria:'Polo',
            },
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult =   {
            "_id": {
              "$oid": "61a444a8a57633446458fad8"
            },
            "precio_antes_soles": 190,
            "precio_antes_dolares": 55,
            "nventas": 9,
            "stock": 5,
            "galeria": [
              {
                "imagen": "5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg",
                "_id": "681c165f-39b1-4335-b6a5-eaf3ddb33f60"
              },
              {
                "imagen": "cvmKCm10_p1TWYRQjJELFrka.png",
                "_id": "33cfd3a5-cb7f-4fda-ad59-4f0cfeb29564"
              },
              {
                "imagen": "FF66zdMmOs5w7-EP-9euRbMx.jpg",
                "_id": "632fc816-d719-4e47-ba38-eb2afadba55c"
              },
              {
                "imagen": "yOZ-pCoqJqOHgKd0oSlmARuH.JPG",
                "_id": "955ce972-deb6-4348-a0ee-0daa18a916cd"
              }
            ],
            "estado": "Publicado",
            "titulo": "Camisa Futbolera - fresa",
            "precio": 153,
            "precio_dolar": 49,
            "peso": "100GR",
            "sku": "ASD456AS4D65AS",
            "descripcion": "undefined",
            "contenido": "<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
            "categoria": "Polo",
            "visibilidad": "Todo el mundo",
            "slug": "camisa-futbolera---fresa",
            "portada": "iduxK4TtthLpmKX9goaqlJ4Q.jpg",
            "createdAt": {
              "$date": {
                "$numberLong": "1638155432049"
              }
            },
            "__v": 0,
            "titulo_variedad": "Talla"
        }

        const {id, data, token} = mockProducto;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.actualizar_producto_admin(data, id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente eliminar_producto_admin', (done: DoneFn) => {
        const mockData = {
            id:'61a444a8a57633446458fad8',
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult =   {
            "_id": {
              "$oid": "61a444a8a57633446458fad8"
            },
            "precio_antes_soles": 190,
            "precio_antes_dolares": 55,
            "nventas": 9,
            "stock": 5,
            "galeria": [
              {
                "imagen": "5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg",
                "_id": "681c165f-39b1-4335-b6a5-eaf3ddb33f60"
              },
              {
                "imagen": "cvmKCm10_p1TWYRQjJELFrka.png",
                "_id": "33cfd3a5-cb7f-4fda-ad59-4f0cfeb29564"
              },
              {
                "imagen": "FF66zdMmOs5w7-EP-9euRbMx.jpg",
                "_id": "632fc816-d719-4e47-ba38-eb2afadba55c"
              },
              {
                "imagen": "yOZ-pCoqJqOHgKd0oSlmARuH.JPG",
                "_id": "955ce972-deb6-4348-a0ee-0daa18a916cd"
              }
            ],
            "estado": "Publicado",
            "titulo": "Camisa Futbolera - fresa",
            "precio": 153,
            "precio_dolar": 49,
            "peso": "100GR",
            "sku": "ASD456AS4D65AS",
            "descripcion": "undefined",
            "contenido": "<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
            "categoria": "Polo",
            "visibilidad": "Todo el mundo",
            "slug": "camisa-futbolera---fresa",
            "portada": "iduxK4TtthLpmKX9goaqlJ4Q.jpg",
            "createdAt": {
              "$date": {
                "$numberLong": "1638155432049"
              }
            },
            "__v": 0,
            "titulo_variedad": "Talla"
        }

        const {id, token} = mockData;

        httpClientSpy.delete.and.returnValue(of(mockResult));

        service.eliminar_producto_admin(id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        }); 
    });

    it('Funciona correctamente listar_inventario_producto_admin', (done: DoneFn) => {
        const mockData = {
            id:'61a444a8a57633446458fad8',
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult =  [
            {
                "_id": {
                  "$oid": "61a4d06770effd20a0ef6ee7"
                },
                "producto": {
                  "$oid": "61a444a8a57633446458fad8"
                },
                "variedad": {
                  "$oid": "61a4c16f0653dd4ad8570810"
                },
                "cantidad": 10,
                "createdAt": {
                  "$date": {
                    "$numberLong": "1638191207419"
                  }
                },
                "__v": 0
              }
        ]

        const {id, token} = mockData;

        httpClientSpy.get.and.returnValue(of(mockResult));

        service.listar_inventario_producto_admin(id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });

    });

    it('Funciona correctamente eliminar_inventario_producto_admin', (done: DoneFn) => {
        const mockData = {
            id:'61a444a8a57633446458fad8',
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": {
              "$oid": "61a4d06770effd20a0ef6ee7"
            },
            "producto": {
              "$oid": "61a444a8a57633446458fad8"
            },
            "variedad": {
              "$oid": "61a4c16f0653dd4ad8570810"
            },
            "cantidad": 10,
            "createdAt": {
              "$date": {
                "$numberLong": "1638191207419"
              }
            },
            "__v": 0
        }

        const {id, token} = mockData;

        httpClientSpy.delete.and.returnValue(of(mockResult));

        service.eliminar_inventario_producto_admin(id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente registro_inventario_producto_admin', (done: DoneFn) => {
        const mockData = {
            data: {
                admin:'61a2c220651be431516b2edf',
                cantidad:5,
                proveedor:'adidas'
            },
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": {
              "$oid": "61a4d06770effd20a0ef6ee7"
            },
            "producto": {
              "$oid": "61a444a8a57633446458fad8"
            },
            "variedad": {
              "$oid": "61a4c16f0653dd4ad8570810"
            },
            "cantidad": 10,
            "createdAt": {
              "$date": {
                "$numberLong": "1638191207419"
              }
            },
            "__v": 0
        }

        const {data, token} = mockData;

        httpClientSpy.post.and.returnValue(of(mockResult));

        service.registro_inventario_producto_admin(data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente actualizar_producto_variedades_admin', (done: DoneFn) => {
        const mockData = {
            id:'61a4c16f0653dd4ad8570810',
            data: {
                producto:'61a444a8a57633446458fad8',
                stock:5,
                valor:'S'
            },
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": {
                "$oid": "61a4c16f0653dd4ad8570810"
              },
              "stock": 3,
              "producto": {
                "$oid": "61a444a8a57633446458fad8"
              },
              "valor": "S",
              "createdAt": {
                "$date": {
                  "$numberLong": "1638187375769"
                }
              },
              "__v": 0
        }

        const {id, data, token} = mockData;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.actualizar_producto_variedades_admin(data, id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente agregar_imagen_galeria_admin', (done: DoneFn) => {
        const mockData = {
            id:'61a2c220651be431516b2edf',
            data:{
                _id:'61a444a8a57633446458fad8',
                imagen:'5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg'
            },
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult =   {
            "_id": {
              "$oid": "61a444a8a57633446458fad8"
            },
            "precio_antes_soles": 190,
            "precio_antes_dolares": 55,
            "nventas": 9,
            "stock": 5,
            "galeria": [
              {
                "imagen": "5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg",
                "_id": "681c165f-39b1-4335-b6a5-eaf3ddb33f60"
              },
              {
                "imagen": "cvmKCm10_p1TWYRQjJELFrka.png",
                "_id": "33cfd3a5-cb7f-4fda-ad59-4f0cfeb29564"
              },
              {
                "imagen": "FF66zdMmOs5w7-EP-9euRbMx.jpg",
                "_id": "632fc816-d719-4e47-ba38-eb2afadba55c"
              },
              {
                "imagen": "yOZ-pCoqJqOHgKd0oSlmARuH.JPG",
                "_id": "955ce972-deb6-4348-a0ee-0daa18a916cd"
              }
            ],
            "estado": "Publicado",
            "titulo": "Camisa Futbolera - fresa",
            "precio": 153,
            "precio_dolar": 49,
            "peso": "100GR",
            "sku": "ASD456AS4D65AS",
            "descripcion": "undefined",
            "contenido": "<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
            "categoria": "Polo",
            "visibilidad": "Todo el mundo",
            "slug": "camisa-futbolera---fresa",
            "portada": "iduxK4TtthLpmKX9goaqlJ4Q.jpg",
            "createdAt": {
              "$date": {
                "$numberLong": "1638155432049"
              }
            },
            "__v": 0,
            "titulo_variedad": "Talla"
        }

        const {id, data, token} = mockData;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.agregar_imagen_galeria_admin(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente eliminar_imagen_galeria_admin', (done:DoneFn) => {
        const mockData = {
            id:'61a2c220651be431516b2edf',
            data:'61a444a8a57633446458fad8',
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult =   {
            "_id": {
              "$oid": "61a444a8a57633446458fad8"
            },
            "precio_antes_soles": 190,
            "precio_antes_dolares": 55,
            "nventas": 9,
            "stock": 5,
            "galeria": [
              {
                "imagen": "5BJGGqdkTe-y5VUTIZ5Q-Sg2.jpg",
                "_id": "681c165f-39b1-4335-b6a5-eaf3ddb33f60"
              },
              {
                "imagen": "cvmKCm10_p1TWYRQjJELFrka.png",
                "_id": "33cfd3a5-cb7f-4fda-ad59-4f0cfeb29564"
              },
              {
                "imagen": "FF66zdMmOs5w7-EP-9euRbMx.jpg",
                "_id": "632fc816-d719-4e47-ba38-eb2afadba55c"
              },
              {
                "imagen": "yOZ-pCoqJqOHgKd0oSlmARuH.JPG",
                "_id": "955ce972-deb6-4348-a0ee-0daa18a916cd"
              }
            ],
            "estado": "Publicado",
            "titulo": "Camisa Futbolera - fresa",
            "precio": 153,
            "precio_dolar": 49,
            "peso": "100GR",
            "sku": "ASD456AS4D65AS",
            "descripcion": "undefined",
            "contenido": "<p><a class=\"cc-tabs__accordion__header\" style=\"box-sizing: border-box; overflow-anchor: none; background: 0px 0px #ffffff; text-decoration-line: none; transition: opacity 0.4s ease 0s; font-weight: 600; font-size: 16px; opacity: 1; border-top: none; padding: 22px 0px; display: block; position: relative; font-family: 'DIN Next', sans-serif;\" role=\"tab\" href=\"https://www.pragol.com/products/camisa-futbolera\" aria-selected=\"true\" aria-controls=\"product-tab-panel1_6699446698159\" data-cc-toggle-panel=\"1_6699446698159\">Descripci&oacute;n</a></p>\n<div id=\"product-tab-panel1_6699446698159\" class=\"cc-tabs__tab__panel rte\" style=\"box-sizing: border-box; overflow-anchor: none; zoom: 1; padding-bottom: 30px; color: #5e5c5c; font-family: 'DIN Next', sans-serif; font-size: 16px; background-color: #ffffff;\" role=\"tab\" aria-labelledby=\"product-tab-panel1_6699446698159\">\n<p style=\"box-sizing: border-box; overflow-anchor: none; line-height: 1.5em; margin-bottom: 0px; margin-top: 0px;\" data-mce-fragment=\"1\"><span style=\"font-weight: 400;\" data-mce-fragment=\"1\">Camisa casual en seda francesa, full print, manga corta con doblez, cuello cl&aacute;sico y botones frontales. Relax fit.</span></p>\n</div>",
            "categoria": "Polo",
            "visibilidad": "Todo el mundo",
            "slug": "camisa-futbolera---fresa",
            "portada": "iduxK4TtthLpmKX9goaqlJ4Q.jpg",
            "createdAt": {
              "$date": {
                "$numberLong": "1638155432049"
              }
            },
            "__v": 0,
            "titulo_variedad": "Talla"
        }

        const {id, data, token} = mockData;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.eliminar_imagen_galeria_admin(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });

    });
});