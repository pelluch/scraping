
function send(e) {
    // Success
    if(validateFields()) {
        return;
    } else {
        showErrors();
    }
}


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



function setWebviewValues(rut, captcha) {
    $('#idRut').val(rut);
    $('#idRut').blur();
    $('#recaptcha_response_field').val(captcha);
    return recuperar_clave('idRut', 'recaptcha_response_field');
}

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

function reloadCaptcha(e) {
    $.webView.evalJS('cambiarCaptcha();');
    loadCaptcha();
}

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