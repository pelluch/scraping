
var EXAMPLE_URL = 'https://sucursalvirtual.movistar.cl/login/img/carnet-ejemplo.png';
function register(e) {

}

function onLoad(e) {
    Ti.API.info('Register on load');
}

function submitForm(id){
    textoFocusOn('txt_rut', 'Ejemplo: 12.345.678-9');
    $('#msjErrorRutEnc').attr("style","display: none;");
    $('#msjErrorRutDet').attr("style","display: none;");
    $('#msjErrorSerieEnc').attr("style","display: none;");
    $('#msjErrorSerieDet').attr("style","display: none;");
    if(validaFormReg()){
        mostrarCargando();
        var form=document.getElementById(id);
        form.submit();
    }
    return false;
}