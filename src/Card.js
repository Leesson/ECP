define([
    "require",
    "dojo/_base/declare",
    "base/artTemplate",
    "ecp/BaseWidget",
    "text!./Card/Widget.html"
], function (require, declare, template, BaseWidget, tpl) {
    return declare(BaseWidget, {
        name: "Card",
        //template
        tpl: tpl,
        //source file's path
        files: [require.toUrl("./Card/css/style.css")],

        /**
         * @param opts, Object.
         *   ...
         *   data, Object. see template parameters
         *   theme, string. widget's theme style.
         */
        constructor: function (opts) {
            this.init();
        },

        init: function () {
            var theme = this.opts.theme || "lightgray";
            this._renderTheme(theme);
        },

        _renderTheme: function (theme) {
            var themeClass = "ecp-card-" + theme;
            $(this.ele).addClass(themeClass);
        }
    });
});


