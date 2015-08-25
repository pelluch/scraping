
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
    var regex = new RegExp("input_rut");
    var html = this.getHtml();
    if(regex.test(html)) {
        Ti.API.info('Has');
        alert('Has input');
    } else {
        Ti.API.info('Has not');
        alert('Does not have input =(');
    }
}
