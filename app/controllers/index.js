
$.index.open();

function resetPassword(e) {
    Alloy.createController('reset_password').getView().open();
}

function login(e) {
    Alloy.createController('login').getView().open();
}

function register(e) {
    Alloy.createController('register').getView().open();
}
