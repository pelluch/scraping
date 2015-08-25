
function login(e) {
    var rut = App.Utils.formatRut($.rut.getValue());
    $.rut.setValue(rut);    
    var password = $.password.getValue();
    if(password !== "") {
        Alloy.createController('set_password', {
            rut: rut,
            password: password
        }).getView().open();
    }
}


function onLoad(e) {
    Ti.API.info("onLoad");
    this.evalJS('login()');
    var regex = new RegExp("input_personas_rut");
    var html = this.getHtml();
    if(regex.test(html)) {
        alert('Has input');
    } else {
        alert('Does not have input =(');
    }
}
