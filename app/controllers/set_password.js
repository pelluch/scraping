
var webView = arguments[0].webView;

function setPassword(e) {
    var result = webView.evalJS(App.Utils.getFunctionString(submitForm));
    Ti.API.info('Result is ' + result);
}

function submitForm() {
    cambio_clave('persona_rut','claveA','newClave','confNewClave');
}
