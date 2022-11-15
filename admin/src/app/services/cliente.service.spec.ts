import { of } from 'rxjs';
import { ClienteService } from './cliente.service';

describe('Prueba de Cliente service', () => {
    let service: ClienteService;
    let httpClientSpy: {
        post: jasmine.Spy,
        put:  jasmine.Spy,
        get:  jasmine.Spy,
        delete: jasmine.Spy 
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpCliente', ['post', 'put', 'get', 'delete']);
        service = new ClienteService(httpClientSpy as any);
    });

    it('Debe crearse correctamente el servicio', () => {
        expect(service).toBeTruthy();
    });

    it('Funciona correctamente registro_cliente_admin', (done: DoneFn) => {
        const mockCliente = {
            data: {
                genero: 'Masculino',
                nombres: 'Diego',
                apellidos: 'Guerra',
                f_nacimiento: '2001/05/12',
                telefono: '123456789',
                dni: '114555441',
                email: 'diego45@gmail.com'
            },
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": {
                "$oid": "63597a8dc7a94a78e37289a5"
              },
              "nombres": "Diego Gonzalo",
              "apellidos": "Guerra Ninataype",
              "email": "diego@gmail.com",
              "password": "$2a$10$5hGB./NvmzYIPUCybVOODOZZqNqjeJ/Ii1bPQXQhuWTM5GVOHFzrO",
              "perfil": "perfil.png",
              "createdAt": {
                "$date": {
                  "$numberLong": "1666808461111"
                }
              },
              "__v": 0,
              "f_nacimiento": "2004-11-02",
              "genero": "Masculino",
              "numeroDocumento": "12345678",
              "pais": "Perú",
              "telefono": "111111111",
              "tipoDocumento": "dni"
        }

        const {data, token} = mockCliente;

        httpClientSpy.post.and.returnValue(of(mockResult));

        service.registro_cliente_admin(data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente actualizar_cliente_admin', (done: DoneFn) => {
        const mockCliente = {
            id: '635c3f0a0d5cccd7d6322958',
            data: { 
                genero: 'Masculino',
                nombres: 'Diego',
                apellidos: 'Guerra',
                f_nacimiento: '2001/05/12',
                telefono: '123456789',
                dni: '114555441',
                email: 'diego45@gmail.com'
            },
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": {
                "$oid": "63597a8dc7a94a78e37289a5"
              },
              "nombres": "Diego Gonzalo",
              "apellidos": "Guerra Ninataype",
              "email": "diego@gmail.com",
              "password": "$2a$10$5hGB./NvmzYIPUCybVOODOZZqNqjeJ/Ii1bPQXQhuWTM5GVOHFzrO",
              "perfil": "perfil.png",
              "createdAt": {
                "$date": {
                  "$numberLong": "1666808461111"
                }
              },
              "__v": 0,
              "f_nacimiento": "2004-11-02",
              "genero": "Masculino",
              "numeroDocumento": "12345678",
              "pais": "Perú",
              "telefono": "111111111",
              "tipoDocumento": "dni"
        }

        const {id, data, token} = mockCliente;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.actualizar_cliente_admin(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        })
    });

    it('Funcionar correctamente eliminar_cliente_admin', (done: DoneFn) => {
        const mockCliente = {
            id: '635c3f0a0d5cccd7d6322958',
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": {
                "$oid": "63597a8dc7a94a78e37289a5"
              },
              "nombres": "Diego Gonzalo",
              "apellidos": "Guerra Ninataype",
              "email": "diego@gmail.com",
              "password": "$2a$10$5hGB./NvmzYIPUCybVOODOZZqNqjeJ/Ii1bPQXQhuWTM5GVOHFzrO",
              "perfil": "perfil.png",
              "createdAt": {
                "$date": {
                  "$numberLong": "1666808461111"
                }
              },
              "__v": 0,
              "f_nacimiento": "2004-11-02",
              "genero": "Masculino",
              "numeroDocumento": "12345678",
              "pais": "Perú",
              "telefono": "111111111",
              "tipoDocumento": "dni"
        }

        const {id, token} = mockCliente;

        httpClientSpy.delete.and.returnValue(of(mockResult));

        service.eliminar_cliente_admin(id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });
});