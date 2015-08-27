
var EXAMPLE_URL = 'https://sucursalvirtual.movistar.cl/login/img/carnet-ejemplo.png';


/*  Función que se llama al recargase el webview
    Se llama cuando hay error de validación server side o bien
    se envió exitosamente uno de los form */
function onLoad(e) {
    Ti.API.info('Register on load');
    // Aquí se pueden detectar errores que ocurren en la validación server side
    var html = this.getHtml();
    var matches = html.match('id="msjErrorRutEncSpan.*>(.*)</span>');
    if(matches && matches.length > 0) {
        var errorMsg = matches[matches.length - 1].trim();
        if(errorMsg !== "") {
            alert(errorMsg);
            return;
        }
    }

    var regex = new RegExp('Identificación validada');
    // Identificación validada, se puede continuar el proceso
    if(regex.test(html)) {
        // Se va a la parte de correos y teléfonos
        return;
    }

    regex = new RegExp('Hemos enviado una clave temporal');
    if(regex.test(html)) {
        // Estamos en al parte de creación de clave
        var matches = html.match('<strong>(.*)</strong>');
        if(matches) {
            // Correo del usuario al que se envió la clave temporal está aquí
            var email = matches[matches.length - 1].trim();
        }
        return;
    }

    regex = new RegExp('Clave creada exitosamente');
    if(regex.test(html)) {
        // Proceso finalizado
        var matches = html.match('<strong>(.*)</strong>');
        if(matches) {
            // Correo del usuario con la confirmación se encuentra aquí
            var email = matches[matches.length - 1].trim();
        }
        return;
    }    

}


/*  Función que se llama al hacer click sobre el PRIMER botón
    que está en el formulario del rut e identificador
    obtiene los valores de los form nativo e inyecta la función submitFirstForm
    para validar y enviar el formulario */
function register(e) {
    var rut = App.Utils.formatRut($.rut.getValue());
    $.rut.setValue(rut);
    var identifier = $.identifier.getValue().trim();
    var result = $.webView.evalJS(App.Utils.getFunctionString(submitFirstForm, [
       rut,
       identifier,
       'regForm'
       ]));
    if(result === 'false') {
        alert('Error de validación client-side');
    }
}

/* Función que se inyecta al webview para enviar el primer formulario */
function submitFirstForm(rut, identifier, id){
    $('#txt_rut').val(rut);
    $('#txt_rut').blur();
    $('#txt_serie').val(identifier);
    $('#txt_serie').blur();
    if(validaFormReg()) {
        var form=document.getElementById(id);
        form.submit();
    } else {
        return false;
    }
}

/*  Función que se llama al hacer click sobre el botón
    del segundo formulario con los correos y teléfonos
    Inyecta la función submitSecondForm para enviarlo al webview */
function sendEmail(e) {
    var email = $.email.getValue().trim();
    var emailConfirmation = $.emailConfirmation.getValue().trim();
    var phone = $.phone.getValue().trim();
    var phoneConfirmation = $.phoneConfirmation.getValue().trim();

    var result = $.webView.evalJS(App.Utils.getFunctionString(submitSecondForm, [
       email,
       emailConfirmation,
       phone,
       phoneConfirmation,
       'regFormC'
       ]));
    if(result === 'false') {
        alert('Error de validación client-side');
    }

}

/* Función inyectada al webview para enviar el segundo formulario */
function submitSecondForm(email, emailConfirmation, phone, phoneConfirmation, id) {

    $('#txt_email').val(email);
    $('#txt_email').blur();
    $('#txt_email_re').val(emailConfirmation);
    $('#txt_email_re').blur();
    $('#txt_numMovil').val(phone);
    $('#txt_numMovil').blur();
    $('#txt_numMovil_re').val(phoneConfirmation);
    $('#txt_numMovil_re').blur();

    if(validaFormRegC()){
        var form=document.getElementById(id);
        form.submit();
    } else {
        return false;
    }
}


/*  Función que se llama al hacer click sobre el botón
    del tercer formulario con las claves
    Inyecta la función submitThirdForm para enviarlo al webview */
function setPassword(e) {
    var result = webView.evalJS(App.Utils.getFunctionString(submitForm, [
        $.tempPassword.getValue(),
        $.password.getValue(),
        $.passwordConfirmation.getValue(),
        'regFormCC'
    ]));
    if(result === 'false') {
        alert('Error de validación client-side');
    }
}

function submitThirdForm(tempPassword, password, passwordConfirmation) {

    $('#claveTemporal').val(tempPassword);
    $('#claveTemporal').blur();
    $('#nuevaClave').val(password);
    $('#nuevaClave').blur();
    $('#nuevaClaveRe').val(passwordConfirmation);
    $('#nuevaClaveRe').blur();

    if(validaFormCC()){
        valueToUpper('claveTemporal');
        var form = document.getElementById(id);
        form.submit();
    } else {
        return false;
    }
}