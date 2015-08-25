
var REQUEST_PASSWORD_URL = 'https://sucursalvirtual.movistar.cl/login/solicitarClaveLogin';



exports.requestPassword = function(captcha) {
    var client = Ti.Network.createHTTPClient({
        onload: function(e) {
            var html = this.responseText;
            Ti.API.info(html);
        },
        onerror: function(e) {
            Ti.API.info('Error!');
        },
        timeout: 10000
    });

    client.open("POST", REQUEST_PASSWORD_URL, true);
    client.send({
        idRut: "17.085.953-7",
        recaptcha_response_field: captcha
    });
};

