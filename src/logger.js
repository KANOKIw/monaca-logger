var LINED = false;
var PENDING_LOGS = [];
var CURRENT_BUTTON_WIDTH = 15;
var EV_QUADRANT = 1;
var LOG_ICON = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSoguY19n3ex7GN9IA6A0K_L2aB7Kd-zEDnA&usqp=CAU";
var IMG_LOADING_ICON = "https://cdn3.emoji.gg/emojis/1792-loading.gif";
var STOPED = false;


class console{
    /**
     * 
     * @param  {...any} __log
     * @returns boolean
     *  success or failure
     */
    static log(...__log){
        var location = this._getLocation();
        var clses = document.getElementsByClassName("--log-message-ol");
        var log_ = `
            <li class="--log-message-element">
                <div class="--log-location">${location}&nbsp;</div>
                <div class="--log-message"><span class="--log-noth">▶&nbsp;</span>${
                    __log.join("")
                    .replaceAll(" ", "&nbsp;")
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replace("\n", "<br>")
                }</div>
            </li>
            <hr class="--log-content-divider">
        `;

        if (STOPED) return;
        
        if (PENDING_LOGS.length > 0 || clses.length == 0){
            PENDING_LOGS.push({content: log_, type: "log"});
            return false;
        }

        Array.from(clses)
        .forEach(elm => {
            elm.innerHTML += log_;
        });

        _set_log_width();
        _set_log_height();
        return true;
    }


    static show(){
        var loggers = document.getElementsByClassName("--logger");
        Array.from(loggers)
        .forEach(logger => {
            logger.style.display = "block";
        });
    }


    static hide(){
        var loggers = document.getElementsByClassName("--logger");
        Array.from(loggers)
        .forEach(logger => {
            logger.style.display = "none";
        });
    }


    static setHidden(hidden){
        if (hidden)
            this.hide();
        else
            this.show();
    }


    static clear(){
        var logs = document.getElementsByClassName("--log");

        PENDING_LOGS = [];
        for (var log of logs){
            log.innerHTML = "";
        }
    }


    static setStopped(_bool){
        STOPED = _bool;
    }


    /**
     * 
     * @param {number} button_width
     *  button_width`vw`
     * @param {number} __button_height
     *  Optional
     * @returns
     *  no return
     */
    static setButtonWidth(button_width, __button_height){
        var imgs = document.getElementsByClassName("--log-opener");
        var padding_vw = 0 / window.innerWidth;

        button_width -= padding_vw*100;
        CURRENT_BUTTON_WIDTH = button_width;
        
        if (imgs.length > 0){
            var div_val = imgs[0].naturalHeight/imgs[0].naturalWidth;

            if (isNaN(div_val)){
                if (__button_height)
                    div_val = __button_height/button_width;
                else
                    div_val = 1;
            }
            var he = button_width*(div_val)+"vw";

            Array.from(imgs)
            .forEach(img => {
                img.style.width = button_width+"vw";
                img.style.height = he;
            });
            Array.from(document.getElementsByClassName("--log"))
            .forEach(elem => {
                elem.style.paddingTop = he;
            });
        }
    }


    /**
     * 
     * @param {number} quadrant 
     */
    static setPositionByQuadrant(quadrant){
        var wrapper = document.getElementsByClassName("--log-opener-wrapper");

        function _forEach(func){
            Array.from(wrapper).forEach(i => func(i));
        }

        if (quadrant != undefined)
            EV_QUADRANT = quadrant;

        switch (quadrant){
            case 1:
            default:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-start";
                    wp.style.justifyContent = "end";
                });
                break;
            case 2:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-start";
                    wp.style.justifyContent = "start";
                });
                break;
            case 3:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-end";
                    wp.style.justifyContent = "start";
                });
                break;
            case 4:
                _forEach(function(wp){
                    wp.style.alignItems = "flex-end";
                    wp.style.justifyContent = "end";
                });
                break;
        }
        return true;
    }


    static setLogIcon(path){
        var imgs = document.getElementsByClassName("--log-opener");

        for (var img of imgs){
            img.src = path;
            img.style.backgroundImage = `url("${IMG_LOADING_ICON}")`;
            this.setButtonWidth(CURRENT_BUTTON_WIDTH);
            img.addEventListener("load", function _load(){
                console.setButtonWidth(CURRENT_BUTTON_WIDTH);
                this.style.backgroundImage = "none";
                this.removeEventListener("load", _load);
            });
        }
        LOG_ICON = path;
    }


    static _reset_position(){
        var wrapper = document.getElementsByClassName("--log-opener-wrapper");

        function _forEach(func){
            Array.from(wrapper).forEach(i => func(i));
        }

        _forEach(function(wp){
            wp.style.alignItems = "flex-start";
            wp.style.justifyContent = "start";
        });
    }


    /**
     * 
     * @param  {ErrorEvent} error
     * @param  {...any} __log
     * @returns boolean
     *  success or failure
     */
    static _error_log(error, ...__log){
        var location = this._getLocation(error);
        var clses = document.getElementsByClassName("--log-message-ol");
        var _log = __log.join(" ")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replace("\n", "<br>");
        var log_athttp_pos = _log.indexOf("@http");

        if (log_athttp_pos != -1){
            _log = _log.substring(0, log_athttp_pos) + "<br>" + _log.substring(log_athttp_pos, _log.length);
            _log = _log.replaceAll("@http", "&nbsp;&nbsp;&nbsp;&nbsp;@http");
        }
        else {
            _log = _log.replaceAll("at ", "<br>&nbsp;&nbsp;&nbsp;&nbsp;at ");
            _log = _log.replace("<br>&nbsp;&nbsp;&nbsp;&nbsp;at ", "&nbsp;&nbsp;&nbsp;&nbsp;at ");
        }
        
        var url_childs = _log.split("<br>");
        var urls = [];
        var url_pattern = /https?:\/\/[^\s]+/g;

        url_childs.shift();
        for (var url of url_childs){
            var _found = url.match(url_pattern);
            if (_found)
                _found.forEach(ul => urls.push(ul));
        }
        for (var val of urls){
            _log = _log.replaceAll(val, get_location_from_url(val));
        }
        _log = _log.replace(" ", "&nbsp;");
        
        var log = `
            <li class="--log-message-element">
                <div class="--log-location">${location}&nbsp;</div>
                <div class="--log-message">
                    <span class="--log-noth" style="color: red;">
                        Error
                    </span>
                    <span class="--log-noth">▶</span>
                    <span style="color: red;">
                        ${_log}
                    </span>
                </div>
            </li>
            <hr class="--log-content-divider">
        `;

        if (PENDING_LOGS.length > 0 || clses.length == 0){
            PENDING_LOGS.push({content: log, type: "error"});
            return false;
        }
        
        Array.from(clses)
        .forEach(elm => {
            elm.innerHTML += log;
        });

        _set_log_width();
        _set_log_height();
        return true;
    }


    static _log(log_){
        var clses = document.getElementsByClassName("--log-message-ol");

        Array.from(clses)
        .forEach(elm => {
            elm.innerHTML += log_;
        });
        
        if (clses.length == 0)
            return false;

        _set_log_width();
        _set_log_height();
        return true;
    }


    /**
     * 
     * @param {Error | null} err
     * @returns {string}
     *  location of the first call
     */
    static _getLocation(err){
        try {
            if (err != undefined)
                throw err;
            throw new Error();
        } catch(e){
            if (e.stack){
                var traces = e.stack.split("\n");
                if (traces.length > 0){
                    var stackTrace = traces[traces.length -1],
                        _splited = stackTrace.trim().split(":"),
                        charNumber = _splited[_splited.length -1].replace(")", ""),
                        lineNumber = _splited[_splited.length -2],
                        _fin = _splited[_splited.length -3],
                        _slicer = _fin.lastIndexOf("/") +1,
                        que = _fin.indexOf("?"),
                        fileName = _fin;
                    
                    if (_slicer !== 0)
                        fileName = _fin.slice(_slicer, _fin.length);

                    if (fileName.indexOf("?") != -1)
                        fileName = fileName.substring(0, fileName.indexOf("?"));

                    if (fileName == "")
                        fileName = "index.html";
                    return fileName+":"+lineNumber+":"+charNumber;
                }
            }
            return "undefined";
        }
    }
}

/**
 * 
 * @param {string} url
 *  raw url
 * @returns {string}
 *  location
 */
function get_location_from_url(url){
    var sliced = url.lastIndexOf("/") +1;
    var que = url.indexOf("?");
    var loc = "";

    if (sliced !== 0)
        loc = url.slice(sliced, url.length);
    if (loc.indexOf("?") != -1)
        loc = loc.substring(0, que);
    if (loc.substring(0, 1) == ":")
        loc = "index.html"+loc;
    return loc;
}


function set_logger(button_width){
    if (!button_width)
        button_width = CURRENT_BUTTON_WIDTH;
    __init__(button_width);
}


function __init__(button_width){
    if (!document.body){
        document.createElement("body");
    }

    document.body.innerHTML = `<div class="--logger"></div>`+document.body.innerHTML;
    document.body.style.margin = "0";

    var css = document.createElement("style");

    css.media = "screen";
    
    var fadein = "@keyframes fade-in{" + [
        "0% {opacity: 0}",
        "100% {opacity: 1.0}"
    ].join("") + "}";

    var fadeout = "@keyframes fade-out{" + [
        "0% {opacity: 1.0}",
        "100% {opacity: 0}"
    ].join("") + "}";

    var base_style_sheet = `
    .--logger{
        font-family: Consolas, 'Courier New', monospace;
        width: auto;
        min-width: 100wv;
        z-index: 2147483647;
    }
    .--log-message-element{
        list-style: none;
        font-size: 20px;
    }
    .--log-message{
        word-break: break-all;
    }
    .--log-location{
        text-align: right;
        color: gray;
        right: 0;
    }
    .--log-opener{
        background-color: white;
        border: solid 2px black;
    }
    .--log-content-divider{
        margin: 0;
    }
    .--log-opener{
        background-image: url("${IMG_LOADING_ICON}");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
    }
    .--log-message-ol{
        padding: 10px;
    }
    .--log-opener-wrapper{
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        position: fixed;
    }
    .--log-noth{
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
    }
    `;

    rules = document.createTextNode([fadein, fadeout, base_style_sheet].join("\n"));
    css.appendChild(rules);
    document.head.appendChild(css);

    var first = document.body.children.item(1);

    if (first)
        first.style.margin = "0";
    
    var loggers = document.getElementsByClassName("--logger");

    for (var logger of loggers){
        logger.style.position = "fixed";
        logger.innerHTML = `
        <div class="--log-opener-wrapper" style="display: flex; position: absolute; z-index: 1001;">
            <img class="--log-opener" alt=""></img>
        </div>
        <div class="--log" style="z-index: 1000; display: none; background-color: white; min-width: 100vw; width: 100vw; min-height: 100vh; height: 100vh; padding-left: 2px;">
            <ol class="--log-message-ol">
                <span style="display: none" aria-hidden="true">上矢印・下矢印キーを使ってログを素早く確認しましょう。新しいログをうけとると、リストの一番下に追加されます。</span>
            </ol>
        </div>`;
    }
    
    var log_openers = document.getElementsByClassName("--log-opener");
    var log_elements = document.getElementsByClassName("--log");

    for (var opener of log_openers){
        opener.addEventListener("load", function _load(){
            console.setButtonWidth(CURRENT_BUTTON_WIDTH);
            this.style.backgroundImage = "none";
            this.removeEventListener("load", _load);
        });

        opener.src = LOG_ICON;
        console.setButtonWidth(button_width);
        
        opener.addEventListener("click", function(){
            if (LINED){
                Array.from(document.getElementsByClassName("--logger"))
                .forEach(logger => {
                    logger.style.width = "0px";
                    logger.style.height = "0px";
                    logger.style.overflow = "visible";
                });

                Array.from(log_elements)
                .forEach(log => {
                    log.style.animation = "fade-out 1s linear";
                    log.style.display = "none";
                });

                console.setPositionByQuadrant(EV_QUADRANT);
            } else {
                Array.from(document.getElementsByClassName("--logger"))
                .forEach(logger => {
                    logger.style.width = "100vw";
                    logger.style.height = "100vh";
                    logger.style.overflow = "scroll";
                });

                Array.from(log_elements)
                .forEach(log => {
                    log.style.animation = "fade-in 0.2s linear";
                    log.style.display = "block";
                    _set_log_height();
                });

                console._reset_position();
            }
            LINED = !LINED;
        });
    }
}


function _set_log_width(){
    var logs = document.getElementsByClassName("--log");
    var max = 0;
    
    Array.from(document.getElementsByClassName("--log-message"))
    .forEach(elem => {
        var wd = elem.innerWidth;
        max = (wd > max) ? wd : max;
    });
    /*for (var log of logs){
        log.style.width = max+"px";
    }*/
}


function _set_log_height(){
    var he = 0;

    for (var lmc of document.getElementsByClassName("--log-message-element")){
        he += lmc.clientHeight;
        for (var hr of document.getElementsByClassName("--log-content-divider")){
            he += .0015;
        }
    }
    he /= document.getElementsByClassName("--log-message-ol").length;
    var logs = document.getElementsByClassName("--log");

    Array.from(logs)
    .forEach(log => log.style.height = he+600+"px");
}


/**
 * 
 * @returns boolean
 *  whether every pending log was done successful
 */
function write_pending_logs(){
    for (var dict of PENDING_LOGS){
        var content = dict.content;
        var type = dict.type;
        var success;

        switch (type){
            case "log":
            case "error":
                success = console._log(content);
                break;
            default: 
                break;
        }
        
        if (success){
            PENDING_LOGS = PENDING_LOGS.filter(item => {
                return item !== dict;
            });
        }
    }
    return PENDING_LOGS.length == 0;
}


function onError(event){
    var log = event;
    if (event.error){
        if (event.error.stack){
            log = event.error.stack;
        } else {
            log = event.error;
        }
    }
    console._error_log(event.error, log);
}


function onLoad(){
    set_logger();
    console.setPositionByQuadrant(EV_QUADRANT);
    var me = this.setInterval(
        function(){
            var clearable = write_pending_logs();
            // commentouted to prevent log dissapear by deleting log block
            if (clearable){
                //clearInterval(me);
            }
        }
    , 5);
}


window.addEventListener("error", onError);
window.addEventListener("load", onLoad);
