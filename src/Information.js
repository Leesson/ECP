define([
    "require",
    "dojo/_base/declare",
    "base/artTemplate",
    "ecp/BaseWidget",
    "text!./Information/Widget.html",
    // "i18n!./Information/nls/strings"
], function (require, declare, template, BaseWidget, tpl, i18n) {
    return declare(BaseWidget, {
        name: "ecp.Information",
        //template
        tpl: tpl,
        //source file's path
        files: [require.toUrl("./Information/css/style.css")],

        /**
         * constructor
         * @param opts
         *   ...
         *   data, Object. includes: message, description.
         *   type, String. values: info, success, error, warning.
         *   closable, Boolean. If true, show close button.
         *   closeText, String. If not empty, default close icon will be replaced.
         *   onClose, Function. Callback when close Information.
         *   showIcon, Boolean. If true, show decent icon.
         *   banner, Boolean. Whether to show as banner.
         */
        constructor: function (opts) {
            this.init();
        },

        init: function () {
            this._reRender();
        },

        _reRender: function () {
            var $ele = $(this.ele),
                withDescription = this.opts.data && this.opts.data.description;
            switch (this.opts.type) {
                case "info":
                    $ele.addClass("ecp-bg-info");
                    this.opts.showIcon && this._addIcon("ecp-info", withDescription ? "fa-info" : "fa-info-circle");
                    break;
                case "success":
                    $ele.addClass("ecp-bg-success");
                    this.opts.showIcon && this._addIcon("ecp-success", withDescription ? "fa-check" : "fa-check-circle");
                    break;
                case "error":
                    $ele.addClass("ecp-bg-error");
                    this.opts.showIcon && this._addIcon("ecp-error", withDescription ? "fa-times" : "fa-times-circle");
                    break;
                case "warning":
                    $ele.addClass("ecp-bg-warning");
                    this.opts.showIcon && this._addIcon("ecp-warning", withDescription ? "fa-exclamation" : "fa-exclamation-circle");
                    break;
                default:
                    break;
            }

            if(!this.opts.showIcon) {
                $ele.addClass("ecp-information-no-icon");
            }

            if(withDescription) {
                $ele.addClass("ecp-information-with-description");
            }

            if(this.opts.closable) {
                this._addCloseBtn(this.opts.closeText, this.opts.onClose);
            }

            if(this.opts.banner) {
                $ele.addClass("ecp-information-banner");
            }
        },

        _addIcon: function (typeClass, iconClass) {
            var $ele = $(this.ele);
            $ele.prepend('<i class="fa ' + typeClass + ' ' + iconClass + '" aria-hidden="true"></i>');
        },

        _addCloseBtn: function (closeText, callback) {
            var that = this,
                $ele = $(this.ele),
                closeBtn;
            closeBtn = $('<a class="ecp-information-close"></a>');
            if(closeText) {
                closeBtn.text(closeText);
            } else {
                closeBtn.html('<span>×</span>');
            }

            closeBtn.appendTo($ele);

            closeBtn.bind('click', function (e) {
                that.close();

                if(typeof callback == 'function') {
                    callback();
                }
            });
        },

        close: function () {
            var $ele = $(this.ele);
            $ele.hide(200);

            setTimeout(function () {
                $ele.remove();
            }, 200);
        }
    });
});


