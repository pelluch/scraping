
$.index.open();

function send(e) {
    var call = '$.ajax({' +
    'url: \'https://sucursalvirtual.movistar.cl/login/solicitarClaveLogin\',' +
    'type: \'POST\',' +
    'data: { idRut: \'17.085.953-7\', recaptcha_response_field: \'' + $.captcha.getValue() + '\' },' +
    'success: function(a) {  },' +
    'async: false' +
    '}).responseText'
    var resp = $.webView.evalJS(call);

    var success = false;
    var failure = false;
    var message = "";

    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            if(attribs.id === "mensajeError"){
                if(attribs.class === "bg") success = true;
                else if(attribs.class === "error-rojo") failure = true;
            }
        },
        ontext: function(text){
            if(success || failure )chemessage = message + text.trim() + "\n";
        },
        onclosetag: function(tagname){
            if(tagname === "div" && success) success = false;
            else if(tagname === "div" && failure) failure = false;
        }
    }, {decodeEntities: true});
    parser.write(resp);
    parser.end();
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
