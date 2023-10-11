var ColorList: {[key: string]: string} = {};
var Dec: {[key: string]: string} = {};


function _parse_formatting_code(str: string): string{
    var cl_count: number = 0;
    var dec_count: number = 0;
    str = "<lgr-cl>§p" + str;
    for (var pat in ColorList){
        var str_splited: string[] = str.split(`§${pat}`);
        cl_count += str_splited.length -1;
        str = str_splited.join(`<lgr-cl style="color: ${ColorList[pat]}">`);
    }
    for (var decoration in Dec){
        var code: string = `§${decoration}`;
        while (str.includes(code)){
            var code: string = `§${decoration}`;
            dec_count++;
            str = str.replace(code, `<lgr-dec ${Dec[decoration]}>`);
            if (str.indexOf("§r") < str.indexOf(code) || str.indexOf(code) == -1){
                var esc: string = "";
                for (var i: number = 0; i < cl_count; i++) {
                    esc += "</lgr-cl>";
                }
                for (var i: number = -2; i < dec_count; i++){
                    esc += "</lgr-dec>";
                }
                str = str.replace("§r", esc);
                cl_count = 0;
                dec_count = 0;
            }
        }
    }
    for (var i: number = 0; i <= cl_count; i++){
        str += "</lgr-cl>";
    }
    for (var i: number = 0; i < dec_count; i++){
        str += "</lgr-dec>";
    }
    return str;
}
