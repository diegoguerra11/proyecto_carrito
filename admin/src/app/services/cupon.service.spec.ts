import { of } from 'rxjs';
import { CuponService } from './cupon.service';

describe('Prueba de Cupon service', () => {
    let service: CuponService;
    let httpClientSpy: {
        post: jasmine.Spy,
        put:  jasmine.Spy,
        get:  jasmine.Spy,
        delete: jasmine.Spy 
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpCliente', ['post', 'put', 'get', 'delete']);
        service = new CuponService(httpClientSpy as any);
    });

    it('Debe crearse correctamente el servicio', () => {
        expect(service).toBeTruthy();
    });

    it('Funciona correctamente registro_cupon_admin', (done: DoneFn) => {
        const mockCupon = {
            data:{
                codigo: 'MEDIOPRECIO',
                tipo: 'Porcentaje',
                valor: 50,
                limite: 10,
            },
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": "61aeadb6706589635890a747",
            "disponibilidad": "Peru",
            "tipo": "Porcentaje",
            "codigo": "MEDIOPRECIO",
            "valor": 50,
            "limite": 10,
            "createdAt": {
                "$date": {
                "$numberLong": "1638837686492"
                }
            },
            "__v": 0
        }

        const {data, token} = mockCupon;

        httpClientSpy.post.and.returnValue(of(mockResult));

        service.registro_cupon_admin(data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente actualizar_cupon_admin', (done: DoneFn) => {
        const mockCupon = {
            id:'61aeadb6706589635890a747',
            data:{
                codigo: 'MEDIOPRECIO',
                tipo: 'Porcentaje',
                valor: 50,
                limite: 10,
            },
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": "61aeadb6706589635890a747",
            "disponibilidad": "Peru",
            "tipo": "Porcentaje",
            "codigo": "MEDIOPRECIO",
            "valor": 50,
            "limite": 10,
            "createdAt": {
                "$date": {
                "$numberLong": "1638837686492"
                }
            },
            "__v": 0
        }

        const {id, data, token} = mockCupon;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.actualizar_cupon_admin(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente eliminar_cupon_admin', (done: DoneFn) => {
        const mockData = {
            id:'61aeadb6706589635890a747',
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'      
        }
        
        const mockResult = {
            "_id": "61aeadb6706589635890a747",
            "disponibilidad": "Peru",
            "tipo": "Porcentaje",
            "codigo": "MEDIOPRECIO",
            "valor": 50,
            "limite": 10,
            "createdAt": {
                "$date": {
                "$numberLong": "1638837686492"
                }
            },
            "__v": 0
        }

        const {id, token} = mockData;

        httpClientSpy.delete.and.returnValue(of(mockResult));

        service.eliminar_cupon_admin(id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamnete validar_cupon_admin', (done: DoneFn) => {
        const mockCupon = {
            cupon:'MEDIOPRECIO',
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": "61aeadb6706589635890a747",
            "disponibilidad": "Peru",
            "tipo": "Porcentaje",
            "codigo": "MEDIOPRECIO",
            "valor": 50,
            "limite": 10,
            "createdAt": {
                "$date": {
                "$numberLong": "1638837686492"
                }
            },
            "__v": 0
        }

        const {cupon, token} = mockCupon;

        httpClientSpy.get.and.returnValue(of(mockResult));

        service.validar_cupon_admin(cupon, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });
});