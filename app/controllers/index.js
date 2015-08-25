
$.index.open();

function send(e) {
    var call = '$.ajax({' +
    'url: \'https://sucursalvirtual.movistar.cl/login/solicitarClaveLogin\',' +
    'type: \'POST\',' +
    'data: { idRut: \'' + $.rut.getValue() + '\', recaptcha_response_field: \'' + $.captcha.getValue() + '\' },' +
    'success: function(a) {  },' +
    'async: false' +
    '}).responseText'
    var rawHtml = $.webView.evalJS(call);

    var success = false;
    var failure = false;
    var message = "";
    var header, message;

    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error) {
            Ti.API.info("Error: " + error);
        }
        else {
            Ti.API.info("Success");
            var forms = select(dom, 'form');
            headers = select(dom, '#mensajeError #encabezadoError');
            Ti.API.info(JSON.stringify(headers));
            header = headers[0].children[0].raw.trim();
            if(header === '') {
                header = 'Para continuar. Por favor ingresa tu RUT.';
            }
            Ti.API.info(header);

            var messageContainer = select(dom, '#mensajeError #detalleError')[0];

            if(forms.length > 0) {
                $.header.setColor('red');
                message = messageContainer.children[0].raw.trim();
            } else {
                $.header.setColor('black'); 
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
    Ti.API.info(message);
}

function onLoad(e) {
    Ti.API.info('Load');
    var funcStr = '(function() {' +
    'img=document.getElementById(\'imagen_captcha\');' +
    'canvas=document.createElement(\'canvas\');' +
    'canvas.width=img.width;' +
    'canvas.height=img.height;' +
    'ctx=canvas.getContext(\'2d\');' +
    'ctx.drawImage(img, 0, 0);' +
    'data=canvas.toDataURL(\'image/png\');' +
    'return data;' +
    '})();';
    var data = $.webView.evalJS(funcStr);
    var base64 = data.substring(data.indexOf(',') + 1);
    var blob = Ti.Utils.base64decode(base64);
    Ti.API.info(blob.width);
    Ti.API.info(blob.getMimeType());
    $.captchaImg.setImage(blob);

}

function getImageData() {
    var res = $.ajax({url: "ServletSimpleCaptcha", 
        async: false 
    });
    var data = res.responseText || "no data!";
    return data;
}
