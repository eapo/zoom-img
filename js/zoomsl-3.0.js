/*http://zoomsl.sergeland.ru Sergey Zaragulov skype: deeserge icq: 287295769 sergeland@mail.ru*/
(function ($, global) {
  "use strict"; //utility methods
  /*$.fn.extend({
		resetzoomsl: function(){
			this.each(function(){
			});
		}
	});*/

  $.fn.imagezoomsl = function (options) {
    options = options || {};
    return this.each(function () {
      //return jQuery obj
      if (!$(this).is("img")) return true;
      var that = this;
      setTimeout(function () {
        $(new Image())
          .load(function () {
            sergelandimagezoomer.init($(that), options);
          })
          .attr("src", $(that).attr("src"));
      }, 30);
    });
  };

  var sergelandimagezoomer = {};
  $.extend(sergelandimagezoomer, {
    dsetting: {
      //default settings 
      loadinggif: "", // картинка показываемая при загрузке big изображения
      loadopacity: 0.1, // прозрачность фона перекрытия tmb картинки при загрузке	big изображения
      loadbackground: "#878787", // цвет фона перекрытия tmb картинки при загрузке	 big изображения 
      cursorshade: true, // показать контейнер лупы
      magnifycursor: "crosshair", // вид курсора мыши над tmb в формате CSS
      cursorshadecolor: "#fff", // цвет контейнера лупы в формате CSS
      cursorshadeopacity: 0.3, // прозрачность контейнера лупы
      cursorshadeborder: "1px solid black", // внешний бордюра контейнера лупы в формате CSS
      zindex: "", // z-index контейнера лупы
      stepzoom: 0.5, // шаг зуммирования при прокрутке колеса мыши
      zoomrange: [2, 2], // диапазон зуммирования
      zoomstart: 2, // стартовая установка зуммирования
      magnifierborderradius: "inherit",
      disablewheel: true, // отключить прокрутку документа колесом мыши когда курсор над картинкой tmb в случае если не задан диапазон зуммирования 
      showstatus: true, // показывать при наведении на tmb help контейнер
      showstatustime: 2000, // время показа help контейнера
      statusdivborder: "1px solid black",
      statusdivbackground: "#C0C0C0",
      statusdivpadding: "4px",
      statusdivfont: "bold 13px Arial",
      statusdivopacity: 0.8, // контейнер big картинки (magnifier)
      magnifierpos: "right", // сторона отображения контейнера left/right
      magnifiersize: [0, 0], // размер контейнера
      magnifiereffectanimate: "showIn", // эффект появления/скрытия fadeIn/showIn/slideIn
      innerzoom: false, // показать контейнер внутри tmb
      innerzoommagnifier: false, // показать контейнер как лупу
      descarea: false, // показать контейнер в произвольной области, область descarea должна иметь width и height
      leftoffset: 15, // отступ слева от tmb картинки
      rightoffset: 15, // отступ справа от tmb картинки
      switchsides: true, // учитывать край экрана
      magnifierborder: "1px solid black", // внешний бордюр 
      textdnbackground: "#fff",
      textdnpadding: "10px",
      textdnfont: "13px/20px cursive", // коэффициенты скорости анимации
      scrollspeedanimate: 5 /*4*/, // прокрутки big картинки
      zoomspeedanimate: 7, // зуммирования (плавность)
      loopspeedanimate: 2.5 /*2.45342*/, // перемещения области лупы и big контейнера в режиме лупы
      magnifierspeedanimate: 350, // показа big контейнера 
      classmagnifier: "magnifier",
      classcursorshade: "cursorshade",
      classstatusdiv: "statusdiv",
      classtextdn: "textdn",
      classtracker: "tracker"
    }, //isie: (function(){/*@cc_on @*//*@if(@_jscript_version >= 5)return true;@end @*/return false;})(), 
    isie: (function () {
      var nAgt = navigator.userAgent;
      if (nAgt.indexOf("MSIE") != -1) return true;
      else return false;
    })(), //isMobile: (function(){ if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ){ return true; } })(),

    highestzindex: function ($img) {
      var z = 0,
        $els = $img.parents().add($img),
        elz;
      $els.each(function () {
        elz = $(this).css("zIndex");
        elz = isNaN(elz) ? 0 : +elz;
        z = Math.max(z, elz);
      });
      return z;
    },

    getboundary: function (b, val, specs) {
      if (b == "left") {
        var rb = -specs.img.w * specs.newpower + specs.magnifier.w;
        return val > 0 ? 0 : val < rb ? rb : val;
      } else {
        var tb = -specs.img.h * specs.newpower + specs.magnifier.h;
        return val > 0 ? 0 : val < tb ? tb : val;
      }
    },

    controlLoop: function ($tracker) {
      var self = this,
        specs = $tracker.data("specs");
      if (!specs) return;

      var coords = specs.$img.offsetsl(),
        pageX = self.cld.pageX999 - coords.left,
        pageY = self.cld.pageY999 - coords.top;

      self.cld.destU += (self.cld.pageX999 - self.cld.destU) / 2.45342;
      self.cld.destV += (self.cld.pageY999 - self.cld.destV) / 2.45342;

      specs.$statusdiv.css({
        left: self.cld.destU - 10,
        top: self.cld.destV + 20
      });

      var csw = Math.round(specs.magnifier.w / specs.newpower),
        csh = Math.round(specs.magnifier.h / specs.newpower);

      self.cld.destK +=
        (pageX - self.cld.destK) / specs.setting.loopspeedanimate;
      self.cld.destL +=
        (pageY - self.cld.destL) / specs.setting.loopspeedanimate;

      specs.$cursorshade.css({
        left:
          specs.img.w > csw
            ? Math.min(
                specs.img.w - csw,
                Math.max(0, self.cld.destK - csw / 2)
              ) +
              coords.left -
              specs.cursorshade999.border999.left999
            : coords.left - specs.cursorshade999.border999.left999,
        top:
          specs.img.h > csh
            ? Math.min(
                specs.img.h - csh,
                Math.max(0, self.cld.destL - csh / 2)
              ) +
              coords.top -
              specs.cursorshade999.border999.top999
            : coords.top - specs.cursorshade999.border999.top999
      });

      if (specs.setting.innerzoommagnifier) {
        self.cld.destM +=
          (self.cld.pageX999 - self.cld.destM) / specs.setting.loopspeedanimate;
        self.cld.destN +=
          (self.cld.pageY999 - self.cld.destN) / specs.setting.loopspeedanimate;

        specs.$magnifier.css({
          left: self.cld.destM - Math.round(specs.magnifier.w / 2),
          top: self.cld.destN - Math.round(specs.magnifier.h / 2)
        });
        specs.$textdn.css({
          left: self.cld.destM - Math.round(specs.magnifier.w / 2),
          top: self.cld.destN + specs.magnifier.h / 2
        });
      }

      self.cld.currU +=
        (pageX - self.cld.currU) / specs.setting.scrollspeedanimate;
      self.cld.currV +=
        (pageY - self.cld.currV) / specs.setting.scrollspeedanimate;

      var newx = -self.cld.currU * specs.newpower + specs.magnifier.w / 2;
      var newy = -self.cld.currV * specs.newpower + specs.magnifier.h / 2;

      specs.$bigimage.css({
        left: self.getboundary("left", newx, specs),
        top: self.getboundary("top", newy, specs)
      });
      self.cld.controlTimer = setTimeout(function () {
        self.controlLoop($tracker);
      }, 30);
    },

    controlLoop2: function ($tracker) {
      var self = this,
        specs = $tracker.data("specs");
      if (!specs) return;

      specs.currM +=
        (specs.newpower - specs.currM) / specs.setting.zoomspeedanimate;
      specs.currM = Math.round(specs.currM * 1000) / 1000;

      specs.$cursorshade.css({
        width:
          specs.img.w > Math.round(specs.magnifier.w / specs.currM)
            ? Math.round(specs.magnifier.w / specs.currM)
            : specs.img.w,
        height:
          specs.img.h > Math.round(specs.magnifier.h / specs.currM)
            ? Math.round(specs.magnifier.h / specs.currM)
            : specs.img.h
      });
      specs.$bigimage.css({
        width: Math.round(
          specs.currM * specs.bigimage.w * (specs.img.w / specs.bigimage.w)
        ),
        height: Math.round(
          specs.currM * specs.bigimage.h * (specs.img.h / specs.bigimage.h)
        )
      });

      self.cld.controlTimer2 = setTimeout(function () {
        self.controlLoop2($tracker);
      }, 30);
    },

    cld: {},

    showimage: function ($tracker) {
      var self = this,
        specs = $tracker.data("specs"),
        width = specs.setting.magnifiersize[0],
        height = specs.setting.magnifiersize[1],
        magcoords = {},
        coords = specs.$img.offsetsl(),
        func = function () {},
        left1 = 0,
        top1 = 0;

      magcoords.left =
        coords.left +
        (specs.setting.magnifierpos === "left"
          ? -specs.magnifier.w - specs.setting.leftoffset
          : specs.img.w + specs.setting.rightoffset);
      if (specs.setting.switchsides && !specs.setting.innerzoom) {
        if (
          specs.setting.magnifierpos !== "left" &&
          magcoords.left + specs.magnifier.w + specs.setting.leftoffset >=
            $(window).width() &&
          coords.left - specs.magnifier.w >= specs.setting.leftoffset
        )
          magcoords.left =
            coords.left - specs.magnifier.w - specs.setting.leftoffset;
        else if (specs.setting.magnifierpos === "left" && magcoords.left < 0)
          magcoords.left =
            coords.left + specs.img.w + specs.setting.rightoffset;
      }

      left1 = magcoords.left;
      top1 = coords.top;
      specs.$magnifier.css({ visibility: "visible", display: "none" });

      if (specs.setting.descarea) {
        left1 = $(specs.setting.descarea).offsetsl().left;
        top1 = $(specs.setting.descarea).offsetsl().top;
      }
      if (specs.setting.innerzoommagnifier) {
        left1 = self.cld.pageX999 - Math.round(specs.magnifier.w / 2);
        top1 = self.cld.pageY999 - Math.round(specs.magnifier.h / 2);
      } //*
      func = function () {
        specs.$textdn
          .stop(true, true)
          .fadeIn(specs.setting.magnifierspeedanimate);
        if (!specs.setting.innerzoommagnifier)
          specs.$textdn.css({ left: left1, top: top1 + height });
      }; // */

      if (specs.setting.innerzoom) {
        left1 = coords.left;
        top1 = coords.top;

        func = function () {
          specs.$img.css({ visibility: "hidden" });
          specs.$textdn
            .css({ left: left1, top: top1 + height })
            .stop(true, true)
            .fadeIn(specs.setting.magnifierspeedanimate);
        };
      }

      switch (specs.setting.magnifiereffectanimate) {
        case "slideIn":
          specs.$magnifier
            .css({
              left: left1,
              top: top1 - height / 3,
              width: width,
              height: height
            })
            .stop(true, true)
            .show()
            .animate(
              { top: top1 },
              specs.setting.magnifierspeedanimate,
              "easeOutBounceSL",
              func
            );
          break;
        case "showIn":
          specs.$magnifier
            .css({
              left: coords.left + Math.round(specs.img.w / 2),
              top: coords.top + Math.round(specs.img.h / 2),
              width: Math.round(specs.magnifier.w / 5),
              height: Math.round(specs.magnifier.h / 5)
            })
            .stop(true, true)
            .show()
            .css({ opacity: "0.1" })
            .animate(
              {
                left: left1,
                top: top1,
                opacity: "1",
                width: width,
                height: height
              },
              specs.setting.magnifierspeedanimate,
              func
            );
          break;
        default:
          specs.$magnifier
            .css({
              left: left1,
              top: top1,
              width: width,
              height: height
            })
            .stop(true, true)
            .fadeIn(specs.setting.magnifierspeedanimate, func);
      }
      if (specs.setting.showstatus && (specs.title999 || specs.help))
        specs.$statusdiv
          .html(
            specs.title999 +
              '<div style="font-size:80%">' +
              specs.help +
              "</div>"
          )
          .stop(true, true)
          .fadeIn()
          .delay(specs.setting.showstatustime)
          .fadeOut("slow");
      else specs.$statusdiv.hide();
    },

    hideimage: function ($tracker) {
      var self = this,
        specs = $tracker.data("specs"),
        coords = specs.$img.offsetsl();

      switch (specs.setting.magnifiereffectanimate) {
        case "showIn":
          specs.$magnifier.stop(true, true).animate(
            {
              left: coords.left + Math.round(specs.img.w / 2),
              top: coords.top + Math.round(specs.img.h / 2),
              opacity: "0.1",
              width: Math.round(specs.magnifier.w / 5),
              height: Math.round(specs.magnifier.h / 5)
            },
            specs.setting.magnifierspeedanimate,
            function () {
              specs.$magnifier.hide();
            }
          );
          break;

        default:
          specs.$magnifier
            .stop(true, true)
            .fadeOut(specs.setting.magnifierspeedanimate);
      }
    },

    /* Init function start.  */
    init: function ($img, options, gallery) {
      var setting = $.extend({}, this.dsetting, options),
        basezindex = setting.zindex || this.highestzindex($img),
        img = { w: $img.width(), h: $img.height() },
        cld = new cld(),
        title = $img.attr("data-title") ? $img.attr("data-title") : "",
        help = $img.attr("data-help") ? $img.attr("data-help") : "",
        textdn = $img.attr("data-text-bottom")
          ? $img.attr("data-text-bottom")
          : "",
        self = this,
        newpower,
        key,
        $magnifier,
        $cursorshade,
        $statusdiv,
        $tracker,
        $textdn;

      if (img.h === 0 || img.w === 0) {
        $(new Image())
          .load(function () {
            self.init($img, options);
          })
          .attr("src", $img.attr("src"));
        return;
      }

      $img.css({ visibility: "visible" });
      setting.largeimage = $img.attr("data-large") || $img.attr("src");

      for (key in setting)
        if (setting[key] === "") setting[key] = this.dsetting[key];

      if (setting.zoomrange[0] < setting.zoomstart)
        newpower = setting.zoomstart;
      else newpower = setting.zoomrange[0];

      if (
        setting.magnifiersize.toString() === "0,0" ||
        setting.magnifiersize.toString() === ""
      )
        if (setting.innerzoommagnifier)
          setting.magnifiersize = [img.w / 2, img.h / 2];
        else setting.magnifiersize = [img.w, img.h];

      if (setting.descarea && $(setting.descarea).length) {
        if (
          $(setting.descarea).width() === 0 ||
          $(setting.descarea).height() === 0
        )
          setting.descarea = false;
        else
          setting.magnifiersize = [
            $(setting.descarea).width(),
            $(setting.descarea).height()
          ];
      } else setting.descarea = false;

      if (setting.innerzoom) {
        setting.magnifiersize = [img.w, img.h];
        if (!options.cursorshade) setting.cursorshade = false;
        if (!options.scrollspeedanimate) setting.scrollspeedanimate = 10;
      }

      if (setting.innerzoommagnifier) {
        if (!options.magnifycursor)
          if (window.chrome || window.sidebar) setting.magnifycursor = "none";
        setting.cursorshade = false;
        setting.magnifiereffectanimate = "fadeIn";
      } // === 

      function cld() {
        this.pageX999 = 0;
        this.pageY999 = 0;
      } // === 

      function getspecs($bigimage) {
        $tracker.data("specs", {
          setting: setting,
          title999: title,
          help: help,

          $img: $img,
          $magnifier: $magnifier,
          $bigimage: $bigimage,
          $statusdiv: $statusdiv,
          $cursorshade: $cursorshade,
          $textdn: $textdn,

          img: img,
          bigimage: { w: $bigimage.width(), h: $bigimage.height() },
          magnifier: { w: $magnifier.width(), h: $magnifier.height() },
          cursorshade999: {
            w: $cursorshade.width(),
            h: $cursorshade.height(),
            border999: {
              left999: parseInt($cursorshade.css("border-left-width")) || 0,
              top999: parseInt($cursorshade.css("border-top-width")) || 0
            }
          },

          currM: newpower,
          newpower: newpower
        });
      } // === 

      function isImageLoaded(img) {
        if (!img.complete) return false;
        if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0)
          return false;
        return true;
      } // === 

      var toFix = [
        "wheel",
        "mousewheel",
        "DOMMouseScroll",
        "MozMousePixelScroll"
      ];
      var toBind =
        "onwheel" in document || document.documentMode >= 9
          ? ["wheel"]
          : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"];
      var lowestDelta, lowestDeltaXY;

      if ($.event.fixHooks) {
        for (var i = toFix.length; i; ) {
          $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
      }

      $.event.special.mousewheel = {
        setup: function () {
          if (this.addEventListener) {
            for (var i = toBind.length; i; ) {
              this.addEventListener(toBind[--i], handler, false);
            }
          } else {
            this.onmousewheel = handler;
          }
        },

        teardown: function () {
          if (this.removeEventListener) {
            for (var i = toBind.length; i; ) {
              this.removeEventListener(toBind[--i], handler, false);
            }
          } else {
            this.onmousewheel = null;
          }
        }
      };

      function handler(event) {
        var orgEvent = event || window.event,
          args = [].slice.call(arguments, 1),
          delta = 0,
          deltaX = 0,
          deltaY = 0,
          absDelta = 0,
          absDeltaXY = 0,
          fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel"; // Old school scrollwheel delta
        if (orgEvent.wheelDelta) {
          delta = orgEvent.wheelDelta;
        }
        if (orgEvent.detail) {
          delta = orgEvent.detail * -1;
        } // New school wheel delta (wheel event)
        if (orgEvent.deltaY) {
          deltaY = orgEvent.deltaY * -1;
          delta = deltaY;
        }
        if (orgEvent.deltaX) {
          deltaX = orgEvent.deltaX;
          delta = deltaX * -1;
        } // Webkit
        if (orgEvent.wheelDeltaY !== undefined) {
          deltaY = orgEvent.wheelDeltaY;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
          deltaX = orgEvent.wheelDeltaX * -1;
        } // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
          lowestDelta = absDelta;
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
          lowestDeltaXY = absDeltaXY;
        } // Get a whole value for the deltas
        fn = delta > 0 ? "floor" : "ceil";
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY); // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
      } // === 

      $.fn.offsetsl = function () {
        var elem = this.get(0);
        function getOffsetSum(elem) {
          var top999 = 0,
            left999 = 0;
          while (elem) {
            top999 = top999 + parseInt(elem.offsetTop);
            left999 = left999 + parseInt(elem.offsetLeft);
            elem = elem.offsetParent;
          }
          return { top: top999, left: left999 };
        }
        if (elem.getBoundingClientRect) return this.offset();
        else return getOffsetSum(elem);
      }; // === 

      $.easing.easeOutBounceSL = function (x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
          return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
          return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
          return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        } else {
          return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
        }
      }; // === 

      $magnifier = $("<div />")
        .attr({ class: setting.classmagnifier })
        .css({
          position: "absolute",
          zIndex: basezindex,
          width: setting.magnifiersize[0],
          height: setting.magnifiersize[1],
          left: -10000,
          top: -10000,
          borderRadius: setting.magnifierborderradius,
          visibility: "hidden",
          overflow: "hidden"
        })
        .appendTo(document.body);

      if (!options.classmagnifier)
        $magnifier.css({ border: setting.magnifierborder });

      $cursorshade = $("<div />");
      if (setting.cursorshade) {
        $cursorshade
          .attr({ class: setting.classcursorshade })
          .css({
            zIndex: basezindex,
            display: "none",
            position: "absolute",
            width: Math.round(setting.magnifiersize[0] / setting.zoomstart),
            height: Math.round(setting.magnifiersize[1] / setting.zoomstart),
            top: 0,
            left: 0
          })
          .appendTo(document.body);

        if (!options.classcursorshade)
          $cursorshade.css({
            border: setting.cursorshadeborder,
            opacity: setting.cursorshadeopacity,
            backgroundColor: setting.cursorshadecolor
          });
      }

      if (!setting.loadinggif)
        setting.loadinggif =
          "data:image/gif;base64,R0lGODlhYABKAKIAAOHh4evr6/Ly8s7Ozu/v7/Dw8NHR0dDQ0CH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wMi0wOFQwMTowODoyOCswMjowMCIgeG1wOkNyZWF0b3JUb29sPSJDb3JlbERSQVcgMjAxOSIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDItMDhUMDE6MTk6NTUtMjI6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDItMDhUMDE6MTk6NTUtMjI6MDAiIHBkZjpQcm9kdWNlcj0iQ29yZWwgUERGIEVuZ2luZSBWZXJzaW9uIDIxLjAuMC41OTMiIGRjOmZvcm1hdD0iaW1hZ2UvZ2lmIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVFNjY0RDIzQTczRDExRURBQTBCRDE1Q0YzNUFEQjMzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVFNjY0RDI0QTczRDEx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";

      $statusdiv = $("<div />")
        .attr({ class: setting.classstatusdiv + " preloadevt" })
        .css({
          position: "absolute",
          display: "none",
          zIndex: basezindex,
          top: 0,
          left: 0
        })
        .html('<img src="' + setting.loadinggif + '" />')
        .appendTo(document.body);

      $tracker = $("<div />")
        .attr({ class: setting.classtracker })
        .css({
          zIndex: basezindex,
          backgroundImage: self.isie ? "url(cannotbe)" : "none",
          position: "absolute",
          width: img.w,
          height: img.h,
          left: gallery ? $img.offsetsl().left : -10000,
          top: gallery ? $img.offsetsl().top : -10000
        })
        .appendTo(document.body);

      $textdn = $("<div />");
      if (textdn) {
        $textdn
          .attr({ class: setting.classtextdn })
          .css({
            position: "absolute",
            zIndex: basezindex,
            left: 0,
            top: 0,
            display: "none"
          })
          .html(textdn)
          .appendTo(document.body);
        if (!options.classtextdn)
          $textdn.css({
            border: setting.magnifierborder,
            background: setting.textdnbackground,
            padding: setting.textdnpadding,
            font: setting.textdnfont
          });
        $textdn.css({
          width:
            setting.magnifiersize[0] -
            parseInt($textdn.css("padding-left")) -
            parseInt($textdn.css("padding-right"))
        });
      }
      $tracker.data("largeimage", setting.largeimage); // EVENTS
      $(window).bind("resize", function () {
        var o = $img.offsetsl();
        if ($tracker.data("loadimgevt"))
          $tracker.css({ left: o.left, top: o.top });
        $statusdiv
          .filter(".preloadevt")
          .css({
            left: o.left + img.w / 2 - $statusdiv.width() / 2,
            top: o.top + img.h / 2 - $statusdiv.height() / 2,
            visibility: "visible"
          });
      });
      $(document).mousemove(function (e) {
        self.cld.docX = e.pageX;
        if (self.cld.pageX999 !== self.cld.docX) {
          clearTimeout(self.cld.controlTimer);
          clearTimeout(self.cld.controlTimer2);
          $img.css({ visibility: "visible" }); //$tracker.hide().css({left: 10000, top: 10000});
        }
      });
      $img.mouseover(function (e) {
        var o = $img.offsetsl();
        $tracker.css({ left: o.left, top: o.top }).show();
      });
      $tracker.mouseover(function (e) {
        self.cld.pageX999 = e.pageX;
        self.cld.pageY999 = e.pageY;

        cld.pageX999 = e.pageX;
        cld.pageY999 = e.pageY;

        self.cld.docX = e.pageX;

        var o = $img.offsetsl(),
          pageX = self.cld.pageX999 - o.left,
          pageY = self.cld.pageY999 - o.top;

        self.cld.destK = pageX;
        self.cld.destL = pageY;

        self.cld.currU = pageX;
        self.cld.currV = pageY;

        self.cld.destM = self.cld.pageX999;
        self.cld.destN = self.cld.pageY999;

        self.cld.destU = self.cld.pageX999 - 10;
        self.cld.destV = self.cld.pageY999 + 20;

        $tracker.css({ cursor: setting.magnifycursor });
        setting.largeimage = $img.attr("data-large") || $img.attr("src");

        $statusdiv.show();
        clearTimeout(self.cld.controlTimer);
        clearTimeout(self.cld.controlTimer2);

        if (setting.largeimage !== $tracker.data("largeimage")) {
          $(new Image())
            .load(function () {})
            .attr("src", setting.largeimage);

          $($tracker).unbind();
          $($statusdiv).remove();
          $($cursorshade).remove();
          $($magnifier).remove();
          $($tracker).remove();
          $($textdn).remove();

          self.init($img, options, true);
        }
        if ($tracker.data("loadevt")) {
          $cursorshade.fadeIn();
          self.showimage($tracker);
          self.controlLoop($tracker);
          self.controlLoop2($tracker);
        }
      });
      $tracker.mousemove(function (e) {
        setting.largeimage = $img.attr("data-large") || $img.attr("src");
        if (setting.largeimage !== $tracker.data("largeimage")) {
          $(new Image())
            .load(function () {})
            .attr("src", setting.largeimage);

          $($tracker).unbind();
          $($statusdiv).remove();
          $($cursorshade).remove();
          $($magnifier).remove();
          $($tracker).remove();
          $($textdn).remove();

          self.init($img, options, true);
        }

        self.cld.pageX999 = e.pageX;
        self.cld.pageY999 = e.pageY;

        cld.pageX999 = e.pageX;
        cld.pageY999 = e.pageY;

        self.cld.docX = e.pageX;
      });
      $tracker.mouseout(function (e) {
        clearTimeout(self.cld.controlTimer);
        clearTimeout(self.cld.controlTimer2);
        $img.css({ visibility: "visible" });
        $textdn.hide();
        $cursorshade.add($statusdiv.not(".preloadevt")).stop(true, true).hide();
      });
      $tracker.one("mouseover", function (e) {
        var imgcoords = $img.offsetsl();
        var $bigimage = $('<img src="' + setting.largeimage + '"/>')
          .css({ position: "relative", maxWidth: "none" })
          .appendTo($magnifier);
        if (!self.loaded999[setting.largeimage]) {
          $tracker.css({
            opacity: setting.loadopacity,
            background: setting.loadbackground
          });
          $tracker.data("loadimgevt", true);
          $statusdiv.css({
            left: imgcoords.left + img.w / 2 - $statusdiv.width() / 2,
            top: imgcoords.top + img.h / 2 - $statusdiv.height() / 2,
            visibility: "visible"
          });
        }
        $bigimage.bind("loadevt", function (event, e) {
          if (e.type === "error") return;
          $tracker.mouseout(function (e) {
            //image onmouseout
            self.hideimage($tracker);
            clearTimeout(self.cld.controlTimer);
            clearTimeout(self.cld.controlTimer2);
            $img.css({ visibility: "visible" });
            $textdn.hide();
            $tracker.hide().css({ left: -10000, top: -10000 });
          });
          $tracker.mouseover(function (e) {
            //image onmouseover
            specs.currM = specs.newpower;
          });
          $tracker.data("loadimgevt", false);
          $tracker.css({ opacity: 0, cursor: setting.magnifycursor });
          $statusdiv.empty();
          if (!options.classstatusdiv)
            $statusdiv.css({
              border: setting.statusdivborder,
              background: setting.statusdivbackground,
              padding: setting.statusdivpadding,
              font: setting.statusdivfont,
              opacity: setting.statusdivopacity
            });
          $statusdiv.hide().removeClass("preloadevt");
          self.loaded999[setting.largeimage] = true;
          getspecs($bigimage);
          if (cld.pageX999 == self.cld.docX) {
            $cursorshade.fadeIn();
            self.showimage($tracker);
            clearTimeout(self.cld.controlTimer);
            clearTimeout(self.cld.controlTimer2);
            self.controlLoop($tracker);
            self.controlLoop2($tracker);
          }

          var specs = $tracker.data("specs");
          $bigimage.css({
            width:
              setting.zoomstart * specs.bigimage.w * (img.w / specs.bigimage.w),
            height:
              setting.zoomstart * specs.bigimage.h * (img.h / specs.bigimage.h)
          });
          $tracker.data("loadevt", true);

          if (
            setting.zoomrange &&
            setting.zoomrange[1] > setting.zoomrange[0]
          ) {
            //if zoom range enabled
            $tracker.bind("mousewheel", function (e, delta) {
              var zoomdir = delta < 0 ? "out" : "in",
                power = specs.newpower,
                newpower =
                  zoomdir == "in"
                    ? Math.min(power + setting.stepzoom, setting.zoomrange[1])
                    : Math.max(power - setting.stepzoom, setting.zoomrange[0]);

              specs.newpower = newpower;
              specs.delta = delta;
              e.preventDefault();
            });
          } else if (setting.disablewheel) {
            $tracker.bind("mousewheel", function (e) {
              e.preventDefault();
            });
          }
        }); //end $bigimage onload */

        if (isImageLoaded($bigimage.get(0)))
          $bigimage.trigger("loadevt", { type: "load" });
        else
          $bigimage.bind("load error", function (e) {
            $bigimage.trigger("loadevt", e);
          });
      });
    },
    loaded999: {}
  });
})(jQuery, window);
