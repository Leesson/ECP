define([
    "require",
    "dojo/_base/declare",
    "base/artTemplate",
    "ecp/BaseWidget",
    "i18n!./EmptyWidget/nls/strings",
    "text!./EmptyWidget/Widget.html"
], function (require, declare, template, BaseWidget, i18n, tpl) {
    return declare(BaseWidget, {
        name: "ecp.EmptyWidget",
        //template
        tpl: tpl,
        //source file's path
        files: [require.toUrl("./EmptyWidget/css/style.css")],

        constructor: function (opts) {
            this.init();
        },

        init: function () {

        }
    });
});