
function send(e) {
    // Success
    if(validateFields()) {
        return;
    } else {
        showErrors();
    }
}

/*  Extrae los errores del webview y los muestra a modo de prueba 
    Los errores tienen que ser al igual que en el login actual, es decir
    no que aparezcan como textos al lado de los formularios
    pero que aparezca el signo de exclamación rojo por ejemplo y el toast
    en android especificando el error en caso de */
function showErrors() {
    var rawHtml = $.webView.getHtml();
    var message = "";
    var header = "";
    $.header.setColor('red');

    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error) {
            Ti.API.info("Error: " + error);
        }
        else {
            headers = select(dom, '#mensajeError #encabezadoError');
                // Ti.API.info(JSON.stringify(headers));
                header = headers[0].children[0].raw.trim();
                Ti.API.info(header);

                var messageContainer = select(dom, '#mensajeError #detalleError')[0];
                if(messageContainer.children) {
                    message = messageContainer.children[0].raw.trim();
                }  
            }        
        });

    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rawHtml);
    $.header.setText(header);
    $.message.setText(message);
}


/*  Manda los valores en los forms nativos al HTML del webview
    El blur es importante porque si no no registra un cambio en el 
    campo del RUT
    la función recupera_clave retorna false si la validación falla,
    en caso contrario envía el formulario del webview */
function setWebviewValues(rut, captcha) {
    $('#idRut').val(rut);
    $('#idRut').blur();
    $('#recaptcha_response_field').val(captcha);
    return recuperar_clave('idRut', 'recaptcha_response_field');
}

/*  Inyecta y llama a la función anterior usando los valores que el usuario ingresó
    El resultado puede ser false (validación falla) u otro (se mandó el formulario del webview)
    En este último caso, puede que la validación client-side falle pero igual hayan errores
    server-side (captcha ingresado no es el correcto, rut no registrado, etc) */
function validateFields() {
    var rut = App.Utils.formatRut($.rut.getValue());
    $.rut.setValue(rut);
    var captcha = $.captcha.getValue().trim();
    $.captcha.setValue(captcha);
    var funcStr = App.Utils.getFunctionString(setWebviewValues, [
        rut,
        captcha
    ]);
    var valid = $.webView.evalJS(funcStr);
    return valid !== 'false';
}


/*  Esta función se inyecta en el webview
    Obtiene información de la imagen como un string codificado en base 64
    Ejemplo de retorno:
    data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAABBCAYAAAB4ko6YAAANbklEQ…mcREWsxwMUaOupK2opgQco0AROoiLW4wEKtPXUFbWUwAN/A9D1DKcw4nkcAAAAAElFTkSuQmCC"
    Lo que viene después del 'base64,' vendría siendo la imagen codificada */
function getImageData() {
    img = document.getElementById('imagen_captcha');
    canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    data = canvas.toDataURL('image/png');
    return data;
}

/* Obtiene imagen codificada del captcha y lo muestra en un ImageView de titanium */
function loadCaptcha() {
    $.captcha.setValue('');
    var funcStr = App.Utils.getFunctionString(getImageData);
    Ti.API.info(funcStr);
    var data = $.webView.evalJS(funcStr);
    var base64 = data.substring(data.indexOf(',') + 1);
    var blob = Ti.Utils.base64decode(base64);
    Ti.API.info(blob.width);
    Ti.API.info(blob.getMimeType());
    $.captchaImg.setImage(blob);
}

/* Llama función del webview para cargar nuevo captcha */
function reloadCaptcha(e) {
    $.webView.evalJS('cambiarCaptcha();');
    loadCaptcha();
}

/*  Se llama cada vez que se carga una página en el webview
    Inicialmente es la página de recupera tu clave,
    al mandar la info del RUT y captcha puede volver a la misma página
    (en caso de error) o bien mostrar la pantalla de éxito */
function onLoad(e) {
    Ti.API.info('Load ' + e.url);
    var html = this.getHtml();
    var regex = new RegExp("Recupera tu clave");
    if(regex.test(html)) {
        showErrors();
        loadCaptcha();
    } else {
        onSuccess();
    }
}

/*  Función que se llama cuando se pudo resetear la clave correctamente
    Lo que hace es extraer los mensajes de éxito del webview, no es necesario 
    que ocupes esto (porque hay librerías de parseo HTML entre medio),
    pero lo relevante es obtener la parte que dice algo como
    Correo electrónico: pab*****@gmail.com para que el usuario sepa dónde se le envío
    Para eso se puede aplicar una simple expresión regular o algo así */
function onSuccess() {
    var rawHtml = $.webView.getHtml();
    var message = "";
    var header = "";
    $.header.setColor('black');

    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error) {
            Ti.API.info("Error: " + error);
        }
        else {
            headers = select(dom, '#mensajeError #encabezadoError');
                // Ti.API.info(JSON.stringify(headers));
                header = headers[0].children[0].raw.trim();
                Ti.API.info(header);

                var messageContainer = select(dom, '#mensajeError #detalleError')[0];
                if(messageContainer.children) {
                    message = messageContainer.children[0].raw.trim();
                    select(messageContainer, 'strong').forEach(function(strong) {
                        $.messageDetail.setText(strong.children[0].raw);
                    });
                }  
            }        
        });

    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rawHtml);
    $.header.setText(header);
    $.message.setText(message);
}