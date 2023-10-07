# monaca-logger
this module creates a console gui paticular on monaca education editor

## import
`<script src="https://github.com/KANOKIw/monaca-logger/releases/download/1.1.8/logger.js"></script>`

__put before any other script tags__

## console
**Attributes**
 * log(...data: `...any`):
   
    output a log.
 * setHidden(hidden: `boolean`):
   
    set whether `console button`s are hidden.
 * clear():
   
    clear console logs.
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

**Code Based on Google Chrome for PC
