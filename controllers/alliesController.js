const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

exports.ally_connect = function (req, res) {
    cookieJar = request.jar();
    var options = {
        method: 'GET',
        url: 'https://www.cremil.gov.co/index.php?idcategoria=11&cat_origen=367&archivo_origen=index.php&msg=5',
        jar: cookieJar
    };
    rp(options).then(function (response) {
        options = {
            method: 'POST',
            url: 'https://www.cremil.gov.co/index.php?idcategoria=11',
            form: {
                'usuario': '16282359',
                'password': 'Diofanor1967',
                'idcategoria': '11',
                'archivo_origen': 'index.php',
                'cat_origen': '367',
                'solicitud_id': '',
            },
            jar: cookieJar
        };
        rp(options).then(function (response) {
            options = {
                method: 'GET',
                url: `https://www.cremil.gov.co//?idcategoria=367&print&inf=0&hash1=03001212&fecha_consulta=10|2018`,
                jar: cookieJar,
            };
            rp(options).then(function (response) {
                var $ = cheerio.load(response);
                const tables = [];
                cheerioTableparser($);
                $('.tbl_comprobante').each(function (i, elem) {
                    tables[i] = $(this).parsetable(false, false, true);
                });
                data = {
                    'datos_personales': {
                        'nombre': tables[0][1][1],
                        'direccion': tables[0][1][2],
                        'unidad': tables[0][1][3],
                        'grado': tables[0][3][3],
                        'fecha_pago': tables[0][5][0],
                        'nro_cuenta': tables[0][5][3],
                    }
                };
                ingresos = [];
                ingresos_array = tables[1];
                ingresos_array[1].map(function (e, i) {
                    if (i > 1) {
                        ingresos.push({
                            'concepto': e,
                            'valor': ingresos_array[4][i]
                        })
                    }
                });
                data['ingresos'] = ingresos;
                egresos = [];
                egresos_array = tables[2];
                egresos_array[0].map(function (e, i) {
                    if (i > 1) {
                        egresos.push({
                            'codigo': e,
                            'descripcion': egresos_array[1][i],
                            'fecha_inicio': egresos_array[2][i],
                            'fecha_fin': egresos_array[3][i],
                            'valor': egresos_array[4][i],
                        });
                    }
                });
                data['egresos'] = egresos;
                console.log(data);
            });
        });
    }).catch(function (err) {
        console.log('error');
    })

};