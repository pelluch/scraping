
var webView = arguments[0].webView;


/*  Cuando se recarga el webview estando aquí, es porque
    ocurrió error de validación en server side (clave incorrecta)
    o bien hubo éxito */
webView.addEventListener('load', function(e) {
    Ti.API.info('Loaded in set password');
    var html = this.getHtml();
    var regex = new RegExp('Crear nueva clave');
    // Error de validación server side
    if(regex.test(html)) {
        alert('Error de validación, clave incorrecta');
    } else {
        // Expresión regular para obtener el correo del html
        var matches = html.match(/electrónico <span class="bold">(.*)<\/span>/);
        // Esta línea indica el correo al que se confirmó el cambio de clave
        var email = matches[matches.length - 1];
        alert('Cambio exitoso, confirmación a ' + email);
    }
});

/*  Transforma a string e inyecta la función submitForm para hacer cambio de clave
    Únicos posibles resultados son 'false' (en forma de string) u otro, lo que indica 
    éxito */
function setPassword(e) {
    var result = webView.evalJS(App.Utils.getFunctionString(submitForm, [
        $.tempPassword.getValue(),
        $.password.getValue(),
        $.passwordConfirmation.getValue()
    ]));
    Ti.API.info('Result is ' + result);
    if(result === 'false') {
        // Error de validación
    } else {

    }
    
}

/*  Función que se inyecta para insertar y enviar valores del formulario
    al webview */
function submitForm(tempPassword, password, passwordConfirmation) {
    $('#claveA').val(tempPassword);
    $('#newClave').val(password);
    $('#confNewClave').val(passwordConfirmation);

    return cambio_clave('persona_rut','claveA','newClave','confNewClave');
}
