# Zoomsl v3.2
## Screenshot
![image](https://user-images.githubusercontent.com/4000929/217397024-6e60b354-4845-4229-8c0b-6c4bfacdea8b.png)

## Configuration
```js
//default settings
loadinggif: "", // image shown when loading a big image
loadopacity: 0.1, // tmb image overlay background transparency when big image is loaded
loadbackground: "#878787", // tmb image overlay background color when big image is loaded
cursorshade: true, // show magnifier container
magnifycursor: "crosshair", // CSS view of mouse cursor over tmb
cursorshadecolor: "#fff", // CSS color of the magnifier container
cursorshadeopacity: 0.3, // magnifier container transparency
cursorshadeborder: "1px solid black", // CSS outer border of the magnifier container
zindex: "", // z-index of the magnifier container
stepzoom: 0.5, // zoom step when scrolling the mouse wheel
zoomrange: [2, 2], // zoom range
zoomstart: 2, // zoom start setting
magnifierborderradius: "inherit",
disablewheel: true, // disable scrolling the document with the mouse wheel when the cursor is over the tmb image if the zoom range is not set
showstatus: true, // show when hovering over tmb help container
showstatustime: 2000, // help container display time
statusdivborder: "1px solid black",
statusdivbackground: "#C0C0C0",
statusdivpadding: "4px",
statusdivfont: "bold 13px Arial",
statusdivopacity: 0.8, // big image container (magnifier)
magnifierpos: "right", // container display side left/right
magnifiersize: [0, 0], // container size
magnifiereffectanimate: "showIn", // fadeIn/showIn/slideIn effect
innerzoom: false, // show container inside tmb
innerzoommagnifier: false, // show container as magnifying glass
descarea: false, // show container in custom area, descarea area must have width and height
leftoffset: 15, // offset to the left of the tmb image
rightoffset: 15, // offset to the right of the tmb image
switchsides: true, // consider screen edge
magnifierborder: "1px solid black", // outer border
textdnbackground: "#fff",
textdnpadding: "10px",
textdnfont: "13px/20px cursive", // animation speed factors
scrollspeedanimate: 5 /*4*/, // scroll big picture
zoomspeedanimate: 7, // zoom (smoothness)
loopspeedanimate: 2.5 /*2.45342*/, // moving the loop area and big container in loop mode
magnifierspeedanimate: 350, // show big container
classmagnifier: "magnifier",
classcursorshade: "cursorshade",
classstatusdiv: "statusdiv",
classtextdn: "textdn",
classtracker: "tracker"
```

## Image Placeholder loading animation
![Image Placeholder loading animation](https://raw.githubusercontent.com/eapo/zoom-img/master/img-load.gif)

This animation is `base64` encoded in the [zoom-img/js](https://github.com/eapo/zoom-img/tree/master/js).
The Animation created based: [File:Placeholder view vector.svg - Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Placeholder_view_vector.svg)
