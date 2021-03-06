var setPasswordCreated = false;
var setPasswordController = null;

function login(e) {

    if(setPasswordCreated) {
        setPasswordController.getView().open();
        return;
    }
    
    var rut = App.Utils.formatRut($.rut.getValue());
    $.rut.setValue(rut);    
    var password = $.password.getValue();
    var result = $.webView.evalJS(App.Utils.getFunctionString(validate, [
        rut,
        password,
        'persona_rut',
        'input_rut',
        'input_pass',
        'form_persona'
        ]));
    if(result === 'true') {
        Ti.API.info('true');
        $.webView.evalJS(App.Utils.getFunctionString(submitForm));
    } else {
        var rutError = "", passwordError = "";
        rutError = $.webView.evalJS(App.Utils.getFunctionString(function() {
            if($('#error_login_rut_pers').css('display') !== 'none')
                return $('#txt_mensaje_rut_pers').text().trim();
            else 
                return "";
        }));
        $.rutError.setText(rutError);

        var passwordError = $.webView.evalJS(App.Utils.getFunctionString(function() {
            if($('#error_login_pass_pers').css('display') !== 'none')
                return $('#txt_mensaje_pass_pers').text().trim();
            else
                return "";
        }));
        $.passwordError.setText(passwordError);
        if(rutError === "") {
            $.rutError.setHeight(0);
        } else {
            $.rutError.setHeight(Ti.UI.SIZE);
        }

        if(passwordError === "") {
            Ti.API.info('No pass error');
            $.passwordError.setHeight(0);
        } else {
            Ti.API.info('Pass error is ' + passwordError);
            $.passwordError.setHeight(Ti.UI.SIZE);
        }
    }
}




function onLoad(e) {
    Ti.API.info("onLoad");
    var regex = new RegExp("input_rut");
    var html = this.getHtml();
    if(regex.test(html)) {
        Ti.API.info('Has');
    } else {
        if(!setPasswordCreated) {
            setPasswordCreated = true;            
            setPasswordController = Alloy.createController('set_password', {
                webView: $.webView
            });  
            setPasswordController.getView().open();          
        }

    }
}

function submitForm(form_persona) {
    var formEl = document.getElementById('form_persona');
    formEl.submit();
}


function validate(rut, password, e, t, n, r) {

    $('#input_rut').val(rut);
    $('#input_rut').blur();
    $('#input_pass').val(password);
    $('#input_pass').blur();

    $("#error_login_rut_pers").hide();
    $("#error_login_pass_pers").hide();
    $("#error_login_rut_neg_mov").hide();
    $("#error_login_pass_neg_mov").hide();
    $("#error_login_rut_neg_fij").hide();
    $("#error_login_pass_neg_fij").hide();
    $("#error_login_rut_emp_mov").hide();
    $("#error_login_pass_emp_mov").hide();
    $("#error_login_rut2_emp_fij").hide();
    $("#error_login_rut3_emp_fij").hide();
    $("#error_login_pass_emp_fij").hide();
    $('#input_rut').removeClass("error");
    $('#input_pass').removeClass("error");
    $('#input_negocios_rut1').removeClass("error");
    $('#input_negocios_pass1').removeClass("error");
    $('#input_negocios_rut2').removeClass("error");
    $('#input_negocios_pass2').removeClass("error");
    $('#input_empresa_rut1').removeClass("error");
    $('#input_empresa_pass1').removeClass("error");
    $('#input_empresa_rut2').removeClass("error");
    $('#input_empresa_rut3').removeClass("error");
    $('#input_empresa_pass2').removeClass("error");
    $('#data_pers').css("height","106px");
    $('#data_neg_mov').css("height","106px");
    $('#data_neg_fij').css("height","106px");
    $('#data_emp_mov').css("height","106px");
    $('#data_emp_fij').css("height","136px");
    $('#data_pers_bot').css("height","84px");
    $('#data_neg_mov_bot').css("height","59px");
    $('#data_neg_fij_bot').css("height","59px");
    $('#data_emp_mov_bot').css("height","85px");
    $('#data_emp_fij_bot').css("height","29px");
    $("#alert_mensaje").hide();

    var a = $("#" + n).val();
    var f = $("#" + t).val();
    var l = $.Rut.validar(f);
    if (f == "" || f == "Tu RUT") {
        setShowErrMsjLogin("Ingresa tu RUT.", "rut", "pers");
        return false;
    }
    if (l == false) {
        setShowErrMsjLogin("Ingresa un RUT v&aacute;lido.", "rut", "pers");
        $("#input_rut").focus();
        return false;
    }
    if (a == "") {
        setShowErrMsjLogin("Ingresa tu clave.", "pass", "pers");
        $("#"+n).focus();
        return false;
    }
    if (jQuery("#" + n).val().length < 8) {
        setShowErrMsjLogin("Clave incorrecta.", "pass", "pers");
        $("#"+n).focus();
        return false;
    }

    if (quitarFormato(jQuery("#" + t).val().substring(0, jQuery("#" + t).val().length - 2)) > 5e7) {
        setShowErrMsjLogin("Ingresa RUT de persona.", "rut", "pers");
        $("#"+t).val("");
        $("#"+t).focus();
        return false;
    }

    var c = jQuery("#" + t).val().substring(jQuery("#" + t).val().length - 1, jQuery("#" + t).val().length);
    var h = jQuery("#" + t).val().substring(0, jQuery("#" + t).val().length - 1);
    if (isNaN(c) == true) {
        c = c.toUpperCase();
    }
    var p = h + c;
    var a = jQuery("#" + n).val();
    var d = document.getElementById(r);
    if (p.length < 8 || p == "Tu RUT") {
        setShowErrMsjLogin("Ingresa tu RUT.", "rut", "pers");
        return false;
    }
    if (a.length < 1) {
        setShowErrMsjLogin("Ingresa tu clave.", "pass", "pers");
        return false;
    }
    jQuery(".idRut").val(p);   
    jQuery("." + t).val(p.replace(".", "").replace(".", ""));
    jQuery(".parametro_pas1").val(a);
    var v = p.replace(".", "").replace(".", "");
    var m = v.split("-");
    var g = p.replace(".", "").replace(".", "");
    return true;
}
