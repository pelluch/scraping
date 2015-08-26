
exports.formatRut = function(unformatted) {
    unformatted = unformatted || "";
    unformatted = unformatted.toUpperCase().replace(/[\.-]/g, '').trim();
    var formatted = "";
    var counter = null;
    var dot = false;

    for(var i = unformatted.length - 1; i >= 0; --i) {
        if((counter - 1) % 3 === 0 && counter > 0) {
            if(!dot) dot = true;
            else formatted = "." + formatted;
        }
        formatted = unformatted[i] + formatted;
        if(i === unformatted.length - 1) {
            formatted = "-" + formatted;
            counter = 0;
        }
        counter++;
    }
    return formatted;
};

exports.getFunctionString = function(func, params) {
    var funcStr = '(' + func + ')(';
    var paramStr = '';
    var delimiter = '';
    params = params || [];
    _.each(params, function(param) {
        paramStr = paramStr + delimiter + JSON.stringify(param);
        delimiter = ','; 
    });
    paramStr += ');'
    funcStr += paramStr;
    return funcStr;
};
