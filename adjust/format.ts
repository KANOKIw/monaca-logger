function _parse_formatting_code(str: string): string{
    var dec_count: number = 0;
    str = "<span>" + str;
    for (var pat in ColorList){
        var str_splited: string[] = str.split(`§${pat}`);
        dec_count += str_splited.length -1;
        str = str_splited.join(`</span><span style="color: ${ColorList[pat]}">`);
    }
    for (var decoration in Dec){
        var code: string = `§${decoration}`;
        while (str.includes(code)){
            var code: string = `§${decoration}`;
            dec_count++;
            str = str.replace(code, `<span style="${Dec[decoration]}">`);
            if (str.indexOf("§r") < str.indexOf(code) || str.indexOf(code) == -1){
                var esc: string = "";
                for (var i: number = 0; i < dec_count; i++){
                    esc += "</span>";
                }
                str = str.replace("§r", esc);
                dec_count = 0;
            }
        }
    }
    for (var i: number = 0; i <= dec_count; i++){
        str += "</span>";
    }
    return str;
}
