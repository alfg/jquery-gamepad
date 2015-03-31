;(function ( $, window, document, undefined ) {

    "use strict";

    var pluginName = "gamepad";
    var self;


    // PLUGIN DEFAULTS
    // ===============================

    var defaults = {
      foo: "bar"
    };


    // PUBLIC METHODS
    // ===============================

    /**
     * Update.
     */
    Plugin.prototype.update = function() {
        var self = this;
        log("updating...");
    };


    // PRIVATE METHODS
    // ===============================

    /**
     * Initializes plugin.
     */
    Plugin.prototype._init = function() {
        var self = this;
        log("oh-base: init");

        console.log("settings:");
        console.log(this.settings);

        var hasGP = false;
        var repGP;

        if(supportsGamepad()) {

          var prompt = "To begin using your gamepad, connect it and press any button!";
          $("#gamepadPrompt").text(prompt);

          $(window).on("gamepadconnected", function() {
            hasGP = true;
            $("#gamepadPrompt").html("Gamepad connected!");
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad,100);
          });

          $(window).on("gamepaddisconnected", function() {
            console.log("disconnection event");
            $("#gamepadPrompt").text(prompt);
            window.clearInterval(repGP);
          });

          //setup an interval for Chrome
          var checkGP = window.setInterval(function() {
            console.log('checkGP');
            if(navigator.getGamepads()[0]) {
              if(!hasGP) $(window).trigger("gamepadconnected");
              window.clearInterval(checkGP);
            }
          }, 500);
        }
    };


    // UTILITY FUNCTIONS
    // ===============================

    /**
     * Simple check if gamepad is supported.
     * @return {boolean} true or false
     */
    function supportsGamepad() {
        try {
            return "getGamepads" in navigator;
        } catch (e) {
            return false;
        }
    }

    function reportOnGamepad() {
  		var gp = navigator.getGamepads()[0];
  		var html = "";
  			html += "id: "+gp.id+"<br/>";

  		for(var i=0;i<gp.buttons.length;i++) {
  			html+= "Button "+(i+1)+": ";
  			if(gp.buttons[i].pressed) html+= " pressed";
  			html+= "<br/>";
  		}

  		for(var i=0;i<gp.axes.length; i+=2) {
  			html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
  		}

  		$("#gamepadDisplay").html(html);
  	}

    /**
     * Logs to console if debugger enabled.
     * @param {string} text - Console text to display.
     * @param {object} [obj] (optional) - Object to console out.
     */
    function log(text, obj) {
        if (defaults.debugLog) {
            console.log("\n===========");
            console.log(text);

            if (obj) {
               console.log(obj);
            }
        }
    }


    // PLUGIN INSTANCE
    // ===============================

    /**
     * Creates a new Plugin.
     * @param {object} element - Element node.
     * @param {object} options - Object containing options to override defaults.
     * @constructor
     */
    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this._init();
    }

    // A plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(opt) {
        // slice arguments to leave only arguments after function name
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var item = $(this), instance = item.data(pluginName);
            if(!instance) {
                // create plugin instance and save it in data
                item.data(pluginName, new Plugin(this, opt));
            } else {
                // if instance already created call method
                if(typeof opt === "string") {
                    instance[opt].apply(instance, args);
                }
            }
        });
    };

})( jQuery, window, document );
