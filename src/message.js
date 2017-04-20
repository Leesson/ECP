define([
    "require",
    "dojo/_base/declare",
    "base/artTemplate",
    "ecp/BaseWidget",
    "i18n!./Message/nls/strings",
    "text!./Message/Widget.html"
], function (require, declare, template, BaseWidget, i18n, tpl) {
    var Widget = declare(BaseWidget, {
        //template
        tpl: null, //do not renderer element when initialize the widget
        //source file's path
        files: [require.toUrl("./Message/css/style.css")],

        constructor: function (opts) {
            this.init();
        },

        init: function () {
            //initialize configurable properties
            this.config();
        },

        config: function (opts) {
            this.opts = $.extend(this.opts, opts || {
                    duration: 2,  //time before auto-dismiss, in seconds
                    top: 16  //distance to top
                });
        },

        info: function (content, duration) {
            var ele = this._renderWidget(content, 'ecp-info', 'fa-info-circle');
            return this._show(ele, duration);
        },

        success: function (content, duration) {
            var ele = this._renderWidget(content, 'ecp-success', 'fa-check-circle');
            return this._show(ele, duration);
        },

        error: function (content, duration) {
            var ele = this._renderWidget(content, 'ecp-error', 'fa-times-circle');
            return this._show(ele, duration);
        },

        warning: function (content, duration) {
            var ele = this._renderWidget(content, 'ecp-warning', 'fa-exclamation-circle');
            return this._show(ele, duration);
        },

        loading: function (content, duration) {
            var ele = this._renderWidget(content, 'ecp-loading', 'fa-spinner fa-pulse');
            return this._show(ele, duration);
        },

        _renderWidget: function (content, typeClass, iconClass) {
            var renderData = {
                content: content || i18n.default_content,
                type_class: typeClass,
                icon_class: iconClass
            };
            this.tpl = tpl;
            return this.render(null, renderData);
        },

        _show: function (ele, duration) {
            var that = this;
            $(ele).appendTo($("body")).css("top", this.opts.top + "px").show();

            //return the remove function when duration equal to 0
            //else triggers auto-dismiss after default duration seconds
            if(duration === 0) {
                return function () {
                    that._remove(ele);
                };
            } else {
                setTimeout(function () {
                    that._remove(ele);
                }, (duration || this.opts.duration) * 1000);
            }
        },

        _remove: function (ele) {
            $(ele).find('.ecp-message-notice-content').addClass("fadeOutUp");
            //the default animation time of animate.css is 1 second
            setTimeout(function () {
                $(ele).remove();
            }, 1000);
        }
    });

    return new Widget();
});