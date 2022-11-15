import { of } from 'rxjs';
import { AdminService } from './admin.service';
describe('Prueba de Admin service', () => {
    let service: AdminService;
    let httpClientSpy: {
        post: jasmine.Spy,
        put:  jasmine.Spy,
        get:  jasmine.Spy,
        delete: jasmine.Spy 
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpCliente', ['post', 'put', 'get', 'delete']);
        service = new AdminService(httpClientSpy as any);
    });

    it('Debe crearse correctamente el servicio', () => {
        expect(service).toBeTruthy();
    });

    it('Funciona correctamente login_admin', (done: DoneFn) => {
        const mockUserCredentials = {
            email: 'admin@gmail.com',
            password: '123'
        }

        const mockResultLogin = {
            "data": {
                "_id": "6359828288e51ab89aecbf03",
                "nombres": "Diego",
                "apellidos": "Guerra",
                "email": "admin@gmail.com",
                "password": "$2a$10$uPafoZ7YhrpSxEyoWSfQ2.sg0LCOGVrKAsEPaS9FG/h5qJv49rHOe",
                "telefono": "123456789",
                "rol": "admin",
                "dni": "123456771",
                "__v": 0
            },
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5ODI4Mjg4ZTUxYWI4OWFlY2JmMDMiLCJub21icmVzIjoiRGllZ28iLCJhcGVsbGlkb3MiOiJHdWVycmEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NzQzNTE2MSwiZXhwIjoxNjY4MDM5OTYxfQ.sKR-CMJseTDTcHyG11xoMwj235Z_9Pxur6D1VmLgNco"
        }

        httpClientSpy.post.and.returnValue(of(mockResultLogin));

        service.login_admin(mockUserCredentials).subscribe(res => {
            expect(res).toEqual(mockResultLogin);
            done();
        });
    });

    it('Funciona correctamente actualizar_config_admin con logo', (done: DoneFn) => {
        const mockDatos = {
            id: '61abe55d2dce63583086f108',
            data: {
                titulo: 'Naly',
                serie: '',
                correlativo: '',
                categorias: [
                    {
                        titulo: "Polo",
                        icono: "cxi-bag"
                    }
                ],
                logo: "R8BKCCArSAWpu4VTN1miFQSk.jpg"
            },
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5ODI4Mjg4ZTUxYWI4OWFlY2JmMDMiLCJub21icmVzIjoiRGllZ28iLCJhcGVsbGlkb3MiOiJHdWVycmEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NzQzNTE2MSwiZXhwIjoxNjY4MDM5OTYxfQ.sKR-CMJseTDTcHyG11xoMwj235Z_9Pxur6D1VmLgNco"
        }

        const mockResultActualizacion = {
            "_id": "61abe55d2dce63583086f108",
            "envio_activacion": "Todo el mundo",
            "monto_min_soles": 500,
            "monto_min_dolares": 150,
            "categorias": [
                {
                    "titulo": "Polo",
                    "icono": "cxi-bag",
                    "_id": "f27fba60-3f8a-443a-9f18-71118b24b9fd"
                },
                {
                    "titulo": "Camisa",
                    "icono": "cxi-bag",
                    "_id": "3f7b9052-c89f-4af9-9887-f2c57f066e24"
                },
                {
                    "titulo": "Color",
                    "icono": "cxi-bag",
                    "_id": "59c71684-b6db-443d-9b4e-2e704a73b98f"
                }
            ],
            "titulo": "Naly",
            "logo": "R8BKCCArSAWpu4VTN1miFQSk.jpg"
        }

        const {id, data, token} = mockDatos;

        httpClientSpy.put.and.returnValue(of(mockResultActualizacion));

        service.actualizar_config_admin(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResultActualizacion);
            done();
        });
        
    });

    it('Funciona correctamente actualizar_config_admin sin logo', (done: DoneFn) => {
        const mockDatos = {
            id: '61abe55d2dce63583086f108',
            data: {
                titulo: 'Naly',
                serie: '',
                correlativo: '',
                categorias: [
                    {
                        titulo: "Polo",
                        icono: "cxi-bag"
                    }
                ],
            },
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5ODI4Mjg4ZTUxYWI4OWFlY2JmMDMiLCJub21icmVzIjoiRGllZ28iLCJhcGVsbGlkb3MiOiJHdWVycmEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NzQzNTE2MSwiZXhwIjoxNjY4MDM5OTYxfQ.sKR-CMJseTDTcHyG11xoMwj235Z_9Pxur6D1VmLgNco"
        }

        const mockResultActualizacion = {
            "_id": "61abe55d2dce63583086f108",
            "envio_activacion": "Todo el mundo",
            "monto_min_soles": 500,
            "monto_min_dolares": 150,
            "categorias": [
                {
                    "titulo": "Polo",
                    "icono": "cxi-bag",
                    "_id": "f27fba60-3f8a-443a-9f18-71118b24b9fd"
                },
                {
                    "titulo": "Camisa",
                    "icono": "cxi-bag",
                    "_id": "3f7b9052-c89f-4af9-9887-f2c57f066e24"
                },
                {
                    "titulo": "Color",
                    "icono": "cxi-bag",
                    "_id": "59c71684-b6db-443d-9b4e-2e704a73b98f"
                }
            ],
            "titulo": "Naly",
            "logo": "R8BKCCArSAWpu4VTN1miFQSk.jpg"
        }

        const {id, data, token} = mockDatos;

        httpClientSpy.put.and.returnValue(of(mockResultActualizacion));

        service.actualizar_config_admin(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResultActualizacion);
            done();
        }); 
    });

    it('Funciona correctamente obtener_config_admin', (done: DoneFn) => {
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5ODI4Mjg4ZTUxYWI4OWFlY2JmMDMiLCJub21icmVzIjoiRGllZ28iLCJhcGVsbGlkb3MiOiJHdWVycmEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NzQzNTE2MSwiZXhwIjoxNjY4MDM5OTYxfQ.sKR-CMJseTDTcHyG11xoMwj235Z_9Pxur6D1VmLgNco";
        const mockResultConfig = {
            "_id": "61abe55d2dce63583086f108",
            "envio_activacion": "Todo el mundo",
            "monto_min_soles": 500,
            "monto_min_dolares": 150,
            "categorias": [
                {
                    "titulo": "Polo",
                    "icono": "cxi-bag",
                    "_id": "f27fba60-3f8a-443a-9f18-71118b24b9fd"
                },
                {
                    "titulo": "Camisa",
                    "icono": "cxi-bag",
                    "_id": "3f7b9052-c89f-4af9-9887-f2c57f066e24"
                },
                {
                    "titulo": "Color",
                    "icono": "cxi-bag",
                    "_id": "59c71684-b6db-443d-9b4e-2e704a73b98f"
                }
            ],
            "titulo": "Naly",
            "logo": "R8BKCCArSAWpu4VTN1miFQSk.jpg"
        }

        httpClientSpy.get.and.returnValue(of(mockResultConfig));

        service.obtener_config_admin(token).subscribe(res => {
            expect(res).toEqual(mockResultConfig);
            done();
        }); 
    });

    it('Funcionar correctamente obtener_direccion_todos_cliente', (done: DoneFn) => {
        const mockUser = {
            id: "63597a8dc7a94a78e37289a5",
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY"
        }

        const mockDirecciones = [
            {
                "_id": "63615163e224cf5421f8c9d3",
                "cliente": {
                    "_id": "63597a8dc7a94a78e37289a5",
                    "nombres": "Diego Gonzalo",
                    "apellidos": "Guerra Ninataype",
                    "email": "diego@gmail.com",
                    "password": "$2a$10$5hGB./NvmzYIPUCybVOODOZZqNqjeJ/Ii1bPQXQhuWTM5GVOHFzrO",
                    "perfil": "perfil.png",
                    "createdAt": "2022-10-26T18:21:01.111Z",
                    "__v": 0,
                    "f_nacimiento": "2004-11-02",
                    "genero": "Masculino",
                    "numeroDocumento": "12345678",
                    "pais": "Perú",
                    "telefono": "111111111",
                    "tipoDocumento": "dni"
                },
                "destinatario": "Diego 05",
                "numeroDocumento": "12346578",
                "tipoDocumento": "dni",
                "zip": "0125",
                "direccion": "Av.peru 1215",
                "pais": "Perú",
                "region": "La Libertad",
                "provincia": "Pataz",
                "distrito": "Parcoy",
                "telefono": "123456789",
                "principal": true,
                "createdAt": "2022-11-01T17:03:31.403Z",
                "__v": 0
            },
            {
                "_id": "635996efad752fe72af52931",
                "cliente": {
                    "_id": "63597a8dc7a94a78e37289a5",
                    "nombres": "Diego Gonzalo",
                    "apellidos": "Guerra Ninataype",
                    "email": "diego@gmail.com",
                    "password": "$2a$10$5hGB./NvmzYIPUCybVOODOZZqNqjeJ/Ii1bPQXQhuWTM5GVOHFzrO",
                    "perfil": "perfil.png",
                    "createdAt": "2022-10-26T18:21:01.111Z",
                    "__v": 0,
                    "f_nacimiento": "2004-11-02",
                    "genero": "Masculino",
                    "numeroDocumento": "12345678",
                    "pais": "Perú",
                    "telefono": "111111111",
                    "tipoDocumento": "dni"
                },
                "destinatario": "Diego",
                "numeroDocumento": "76353684",
                "tipoDocumento": "dni",
                "zip": "051",
                "direccion": "Av. Peru 152",
                "pais": "Perú",
                "region": "Lima",
                "provincia": "Lima",
                "distrito": "Ate",
                "telefono": "690498151",
                "principal": false,
                "createdAt": "2022-10-26T20:22:07.111Z",
                "__v": 0
            }
        ];

        const {id, token} = mockUser;

        httpClientSpy.get.and.returnValue(of(mockDirecciones));

        service.obtener_direccion_todos_cliente(id, token).subscribe(res => {
            expect(res).toEqual(mockDirecciones);
            done();
        });
    });

    it('Funciona correctamente obtener_pago', (done: DoneFn) => {
        const id = "1309990029";

        const mockMercadoPago = {
            "additional_info": {
                "authentication_code": null,
                "available_balance": null,
                "ip_address": "190.234.75.205",
                "items": [
                    {
                        "category_id": null,
                        "description": "undefined",
                        "id": null,
                        "picture_url": null,
                        "quantity": "1",
                        "title": "Polera Loveislove - hueso",
                        "unit_price": "150.0"
                    },
                    {
                        "category_id": null,
                        "description": "Concepto de transporte y logistica",
                        "id": null,
                        "picture_url": null,
                        "quantity": "1",
                        "title": "Envio",
                        "unit_price": "0.0"
                    }
                ],
                "nsu_processadora": null
            },
            "authorization_code": null,
            "binary_mode": false,
            "brand_id": null,
            "build_version": "2.116.1",
            "call_for_authorize_id": null,
            "captured": true,
            "card": {
                "cardholder": {
                    "identification": {
                        "number": "12345678",
                        "type": "DNI"
                    },
                    "name": "Comprador"
                },
                "date_created": "2022-10-30T18:49:41.000-04:00",
                "date_last_updated": "2022-10-30T18:49:41.000-04:00",
                "expiration_month": 11,
                "expiration_year": 2025,
                "first_six_digits": "503175",
                "id": null,
                "last_four_digits": "0604"
            },
            "charges_details": [],
            "collector_id": 612621626,
            "corporation_id": null,
            "counter_currency": null,
            "coupon_amount": 0,
            "currency_id": "PEN",
            "date_approved": "2022-10-30T18:49:41.267-04:00",
            "date_created": "2022-10-30T18:49:41.081-04:00",
            "date_last_updated": "2022-10-30T18:49:41.267-04:00",
            "date_of_expiration": null,
            "deduction_schema": null,
            "description": "Polera Loveislove - hueso",
            "differential_pricing_id": null,
            "external_reference": null,
            "fee_details": [
                {
                    "amount": 8.25,
                    "fee_payer": "collector",
                    "type": "mercadopago_fee"
                }
            ],
            "id": 1309414925,
            "installments": 1,
            "integrator_id": null,
            "issuer_id": "12347",
            "live_mode": false,
            "marketplace_owner": 612621626,
            "merchant_account_id": null,
            "merchant_number": null,
            "metadata": {},
            "money_release_date": "2022-10-30T18:49:41.267-04:00",
            "money_release_schema": null,
            "money_release_status": null,
            "notification_url": "https://hookb.in/6JlGBe8MYbsoRnwwRd1Z",
            "operation_type": "regular_payment",
            "order": {
                "id": "6323927282",
                "type": "mercadopago"
            },
            "payer": {
                "first_name": null,
                "last_name": null,
                "email": "test_user_80507629@testuser.com",
                "identification": {
                    "number": "32659430",
                    "type": "DNI"
                },
                "phone": {
                    "area_code": null,
                    "number": null,
                    "extension": null
                },
                "type": null,
                "entity_type": null,
                "id": "1222754588"
            },
            "payment_method_id": "master",
            "payment_type_id": "credit_card",
            "platform_id": null,
            "point_of_interaction": {
                "business_info": {
                    "sub_unit": "checkout_pro",
                    "unit": "online_payments"
                },
                "type": "UNSPECIFIED"
            },
            "pos_id": null,
            "processing_mode": "aggregator",
            "refunds": [],
            "shipping_amount": 0,
            "sponsor_id": null,
            "statement_descriptor": "ARDI5878429",
            "status": "approved",
            "status_detail": "accredited",
            "store_id": null,
            "taxes_amount": 0,
            "transaction_amount": 150,
            "transaction_amount_refunded": 0,
            "transaction_details": {
                "acquirer_reference": null,
                "external_resource_url": null,
                "financial_institution": null,
                "installment_amount": 150,
                "net_received_amount": 141.75,
                "overpaid_amount": 0,
                "payable_deferral_period": null,
                "payment_method_reference_id": null,
                "total_paid_amount": 150
            }
        }

        httpClientSpy.get.and.returnValue(of(mockMercadoPago));

        service.obtenerPago(id).subscribe(res => {
            expect(res).toEqual(mockMercadoPago);
            done();
        })
    });

    it('Funciona correctamente marcar_finalizado_orden', (done:DoneFn) => {
        const mockOrden = {
            id: '61ae0ef499c405531cf98c13',
            data: {
                "_id":"61ae0ef499c405531cf98c13",
                "tracking": "",
                "transaccion": "Venta pedido",
                "currency": "PEN",
                "subtotal": 695,
                "total_pagar": 710,
                "envio_precio": 15,
                "metodo_pago": "Yape o Plin",
                "nota": "",
                "tipo_descuento": "0",
                "valor_descuento": "0",
                "cliente": {
                  "$oid": "61a2c14f2c659a0d747825d0"
                },
                "estado": "En espera",
                "createdAt": {
                  "$date": {
                    "$numberLong": "1638797044561"
                  }
                },
                "__v": 0
              },
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id":"61ae0ef499c405531cf98c13",
            "tracking": "",
            "transaccion": "Venta pedido",
            "currency": "PEN",
            "subtotal": 695,
            "total_pagar": 710,
            "envio_precio": 15,
            "metodo_pago": "Yape o Plin",
            "nota": "",
            "tipo_descuento": "0",
            "valor_descuento": "0",
            "cliente": "61a2c14f2c659a0d747825d0",
            "estado": "En espera",
            "createdAt": {
                "$date": {
                "$numberLong": "1638797044561"
                }
            },
            "__v": 0
        }
        
        const {id, data, token} = mockOrden;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.marcar_finalizado_orden(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        })
    });

    it('Funciona correctamente eliminar_orden_admin', (done: DoneFn) => {
        const mockOrden = {
            id:'61ae0ef499c405531cf98c13',
            token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY"
        }

        const mockResult = {
            "_id":"61ae0ef499c405531cf98c13",
            "tracking": "",
            "transaccion": "Venta pedido",
            "currency": "PEN",
            "subtotal": 695,
            "total_pagar": 710,
            "envio_precio": 15,
            "metodo_pago": "Yape o Plin",
            "nota": "",
            "tipo_descuento": "0",
            "valor_descuento": "0",
            "cliente": "61a2c14f2c659a0d747825d0",
            "estado": "En espera",
            "createdAt": {
                "$date": {
                "$numberLong": "1638797044561"
                }
            },
            "__v": 0
        }

        const {id, token} = mockOrden;

        httpClientSpy.delete.and.returnValue(of(mockResult));

        service.eliminar_orden_admin(id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente marcar_envio_orden', (done: DoneFn) => {
        const mockOrden = {
            id: '61ae0ef499c405531cf98c13',
            data: {
                "_id":"61ae0ef499c405531cf98c13",
                "tracking": "",
                "transaccion": "Venta pedido",
                "currency": "PEN",
                "subtotal": 695,
                "total_pagar": 710,
                "envio_precio": 15,
                "metodo_pago": "Yape o Plin",
                "nota": "",
                "tipo_descuento": "0",
                "valor_descuento": "0",
                "cliente": {
                  "$oid": "61a2c14f2c659a0d747825d0"
                },
                "estado": "En espera",
                "createdAt": {
                  "$date": {
                    "$numberLong": "1638797044561"
                  }
                },
                "__v": 0
              },
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id":"61ae0ef499c405531cf98c13",
            "tracking": "",
            "transaccion": "Venta pedido",
            "currency": "PEN",
            "subtotal": 695,
            "total_pagar": 710,
            "envio_precio": 15,
            "metodo_pago": "Yape o Plin",
            "nota": "",
            "tipo_descuento": "0",
            "valor_descuento": "0",
            "cliente": "61a2c14f2c659a0d747825d0",
            "estado": "En espera",
            "createdAt": {
                "$date": {
                "$numberLong": "1638797044561"
                }
            },
            "__v": 0
        }

        const {id, data, token} = mockOrden;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.marcar_envio_orden(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente confirmar_pago_orden', (done: DoneFn) => {
        const mockOrden = {
            id: '61ae0ef499c405531cf98c13',
            data: {
                "_id":"61ae0ef499c405531cf98c13",
                "tracking": "",
                "transaccion": "Venta pedido",
                "currency": "PEN",
                "subtotal": 695,
                "total_pagar": 710,
                "envio_precio": 15,
                "metodo_pago": "Yape o Plin",
                "nota": "",
                "tipo_descuento": "0",
                "valor_descuento": "0",
                "cliente": {
                  "$oid": "61a2c14f2c659a0d747825d0"
                },
                "estado": "En espera",
                "createdAt": {
                  "$date": {
                    "$numberLong": "1638797044561"
                  }
                },
                "__v": 0
              },
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id":"61ae0ef499c405531cf98c13",
            "tracking": "",
            "transaccion": "Venta pedido",
            "currency": "PEN",
            "subtotal": 695,
            "total_pagar": 710,
            "envio_precio": 15,
            "metodo_pago": "Yape o Plin",
            "nota": "",
            "tipo_descuento": "0",
            "valor_descuento": "0",
            "cliente": "61a2c14f2c659a0d747825d0",
            "estado": "En espera",
            "createdAt": {
                "$date": {
                "$numberLong": "1638797044561"
                }
            },
            "__v": 0
        }

        const {id, data, token} = mockOrden;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.confirmar_pago_orden(id, data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente actualizar_producto_variedades_admin', (done: DoneFn) => {
        const mockProducto = {
            id: '61a444a8a57633446458fad8',
            data:{
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
            },
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id":"61ae0ef499c405531cf98c13",
            "tracking": "",
            "transaccion": "Venta pedido",
            "currency": "PEN",
            "subtotal": 695,
            "total_pagar": 710,
            "envio_precio": 15,
            "metodo_pago": "Yape o Plin",
            "nota": "",
            "tipo_descuento": "0",
            "valor_descuento": "0",
            "cliente": "61a2c14f2c659a0d747825d0",
            "estado": "En espera",
            "createdAt": {
                "$date": {
                "$numberLong": "1638797044561"
                }
            },
            "__v": 0
        }

        const {id, data, token} = mockProducto;

        httpClientSpy.put.and.returnValue(of(mockResult));

        service.actualizar_producto_variedades_admin(data, id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente eliminar_variedad_admin', (done: DoneFn) => {
        const mockVariedad = {
            id:"61a4c16f0653dd4ad8570810",
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY",
        }

        const mockResult = {
            "_id": "61a4c16f0653dd4ad8570810",
            "stock": 3,
            "producto": "61a444a8a57633446458fad8",
            "valor": "S",
            "createdAt": {
              "$date": {
                "$numberLong": "1638187375769"
              }
            },
            "__v": 0
        }

        const {id, token} = mockVariedad;

        httpClientSpy.delete.and.returnValue(of(mockResult));

        service.eliminar_variedad_admin(id, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });

    it('Funciona correctamente agregar_variedad_admin', (done: DoneFn) => {
        const mockVariedad = {
            data: {
                "stock": 3,
                "producto": "61a444a8a57633446458fad8",
                "valor": "S",
            },
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY",
        }

        const mockResult = {
            "_id": "61a4c16f0653dd4ad8570810",
            "stock": 3,
            "producto": "61a444a8a57633446458fad8",
            "valor": "S",
            "createdAt": {
              "$date": {
                "$numberLong": "1638187375769"
              }
            },
            "__v": 0
        }

        const {data, token} = mockVariedad;

        httpClientSpy.post.and.returnValue(of(mockResult));

        service.agregar_nueva_variedad_admin(data, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        })
    });

    it('Funciona correctamente cambiar_vs_producto', (done: DoneFn) => {
        const mockVariedad = {
            id:'61a4c16f0653dd4ad8570810',
            estado: true,
            token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MzU5N2E4ZGM3YTk0YTc4ZTM3Mjg5YTUiLCJub21icmVzIjoiRGllZ28gR29uemFsbyIsImFwZWxsaWRvcyI6Ikd1ZXJyYSBOaW5hdGF5cGUiLCJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY2NzQzNzc0MSwiZXhwIjoxNjY4MDQyNTQxfQ.2vuOGjIox3UUdYrtq4PQrVShs6l6LqJ8fI7betF2MgY'
        }

        const mockResult = {
            "_id": "61a4c16f0653dd4ad8570810",
            "stock": 3,
            "producto": "61a444a8a57633446458fad8",
            "valor": "S",
            "createdAt": {
              "$date": {
                "$numberLong": "1638187375769"
              }
            },
            "__v": 0
        }
        
        const {id, estado, token} = mockVariedad;

        httpClientSpy.get.and.returnValue(of(mockResult));

        service.cambiar_vs_producto_admin(id, estado, token).subscribe(res => {
            expect(res).toEqual(mockResult);
            done();
        });
    });
});