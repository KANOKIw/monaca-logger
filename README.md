# monaca-logger
this module creates a console gui paticular on monaca education editor

## import
`<script src="https://github.com/KANOKIw/monaca-logger/releases/download/2.2/logger.js"></script>`

__put before any other script tags__

## console
**Attributes**
 * log(...data: `...any`):  
    output a log.

 * warn(...data: `...any`):  
    output a log with warn decoration.

 * clear():  
    clear console logs.

 * setInvisible(invisible: `boolean`):  
    set whether `console button`s are invisible.

 * setStopped(stopped: `boolean`):  
    set whether console logging is stopped.

 * setButtonWidth(width: `number`):  
    set `console button`'s width, heigt depends on width.  
    `width` is what parsentage of `console button`'s width of window width.  
    default to 15.

 * setLogIcon(src: `string`):  
    set `console botton`'s image src.

 * setPositionByQuadrant(quadrant: `number`):  
    set `console botton`'s position by math quadrant.  
    default to 1.

 * clickButton():
   press console button by a callable.

## format codes
 **put color code before decoration code**
 really same as Minecraft  
 * ### color codes  
   `§0`: Black  
   `§1`: Dark Blue  
   `§2`: Dark Green  
   `§3`: Dark Aqua  
   `§4`: Dark Red  
   `§5`: Dark Purple  
   `§6`: Gold  
   `§7`: Gray  
   `§8`: Dark Gray  
   `§9`: Blue  
   `§a`: Green  
   `§b`: Aqua  
   `§c`: Red  
   `§d`: Light Purple  
   `§e`: Yellow  
   `§f`: White  

 * ### decorations  
   `§k`: obfuscated  
   `§l`: bold  
   `§m`: line-through  
   `§n`: underline  
   `§o`: italic  

 * ### special  
   `§r`: reset
   

**Code Based on Google Chrome for PC
