function _parse_formatting_code(str) {
    var cl_count = 0;
    var dec_count = 0;
    str = "<lgr-cl>" + str;
    for (var pat in ColorList) {
        var str_splited = str.split("\u00A7".concat(pat));
        cl_count += str_splited.length - 1;
        str = str_splited.join("<lgr-cl style=\"color: ".concat(ColorList[pat], "\">"));
    }
    for (var decoration in Dec) {
        var code = "\u00A7".concat(decoration);
        while (str.includes(code)) {
            var code = "\u00A7".concat(decoration);
            dec_count++;
            str = str.replace(code, "<lgr-dec ".concat(Dec[decoration], ">"));
            if (str.indexOf("§r") < str.indexOf(code) || str.indexOf(code) == -1) {
                var esc = "";
                for (var i = 0; i < cl_count; i++) {
                    esc += "</lgr-cl>";
                }
                for (var i = -2; i < dec_count; i++) {
                    esc += "</lgr-dec>";
                }
                str = str.replace("§r", esc);
                cl_count = 0;
                dec_count = 0;
            }
        }
    }
    for (var i = 0; i <= cl_count; i++) {
        str += "</lgr-cl>";
    }
    for (var i = 0; i < dec_count; i++) {
        str += "</lgr-dec>";
    }
    return str;
}
