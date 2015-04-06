;(function ( $, window, document, undefined ) {

    "use strict";

    var pluginName = "gamepad";
    var self;
    var $el = $("#gamepadPrompt");

    var hasGamepad = false;
    var reportGamepad;


    // PLUGIN DEFAULTS
    // ===============================

    var defaults = {
        prompt: "Connect your gamepad and press any button!",
        checkInterval: 500,
        pollingInterval: 100,
        debugLog: true
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

    /**
     * Is Gamepad supported?
     */
    Plugin.prototype.supported = function() {
        var self = this;
        console.log('is supported?');
        return 10;
    };


    // PRIVATE METHODS
    // ===============================

    /**
     * Initializes plugin.
     */
    Plugin.prototype._init = function() {
        var self = this;
        log("oh-base: init");
        console.log(this.settings);

        if(supportsGamepad()) {

          $el.text(self._defaults.prompt);

          // Attach gamepad connected/disconnected events
          $(window).on("gamepadconnected", self._onGamepadConnected);
          $(window).on("gamepaddisconnected", self._onGamepadDisconnected);

          //setup an interval for Chrome
          var checkGamepad = window.setInterval(function() {
            console.log('checkGamepad');
            if(navigator.getGamepads()[0]) {
              if(!hasGamepad) $(window).trigger("gamepadconnected");
              window.clearInterval(checkGamepad);
            }
          }, 500);
        }
    };

    Plugin.prototype._onGamepadConnected = function(e) {
        hasGamepad = true;
        $el.html("Gamepad connected!");
        console.log("connection event");
        reportGamepad = window.setInterval(reportOnGamepad, 100);
    };

    Plugin.prototype._onGamepadDisconnected = function(e) {
        console.log("disconnection event");
        $el.text(prompt);
        window.clearInterval(reportGamepad);
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

    $.fn[pluginName].defaults = defaults;

})( jQuery, window, document );
