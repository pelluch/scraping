
var webView = arguments[0].webView;

function setPassword(e) {
    var result = webView.evalJS(App.Utils.getFunctionString(submitForm, [
        $.tempPassword.getValue(),
        $.password.getValue(),
        $.passwordConfirmation.getValue()
    ]));
    Ti.API.info('Result is ' + result);
    if(result === 'false') {

    } else {

    }
    
}

function submitForm(tempPassword, password, passwordConfirmation) {
    $('#claveA').val(tempPassword);
    $('#newClave').val(password);
    $('#confNewClave').val(passwordConfirmation);

    return cambio_clave('persona_rut','claveA','newClave','confNewClave');
}
