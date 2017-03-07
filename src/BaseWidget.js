define([
    "require",
    "dojo/_base/declare",
    "base/artTemplate"
], function (require, declare, template) {
    return declare(null, {
        name: "ECP_Widget",
        tpl: null,
        files: [require.toUrl("./BaseWidget/css/style.css")],
        loadedFiles: [],
        /**
         * init widget
         * @param container, if container is a dom element, the widget will be append to the element, else you can get widget dom by widget.ele
         * @param opts, Object, optional.
         *   data, Object. data to render template. see widget's template for detail.
         *   class_name, String. add custom className to widget's root element.
         *   styles, String<css grammar>. add custom styles to widget's root element.
         *   tpl, String<html grammar>. if not empty, default tpl will be replaced. this property will affect(even disabled) other properties, such as data.
         */
        constructor: function (container, opts) {
            // this.setId();
            this.ele = null;

            //verify the container
            if(Object.prototype.toString.call(container) === "[object String]") {
                var containerId = container;
                container = document.getElementById(container);
                if(!container) {
                    throw new Error("failed to create " + this.name + " widget, can not find the element of whose id is '" + containerId + "'");
                }
            }

            this.opts = $.extend({
                data: {},
                class_name: undefined, //as the grammar of html, class names separated by space.
                // theme: undefined,
                // tpl: undefined,
                styles: undefined, //as the grammar of html, style attributes separated by semicolons.
            }, opts || {});

            if(this.opts.tpl) {
                this.tpl = this.opts.tpl;
            }

            //add base style to source files
            this.files.push(require.toUrl("./BaseWidget/css/style.css"));
            //load source files
            this.loadFile(this.files);

            //renderer widget dom
            this.ele = this.render(container, this.opts.data);

            this._initExtraFunc();
        },

        init: function () {
            console.log("executed BaseWidget's initialization.");
        },

        setId: function (id) {
            if(id) {
                this.id = id;
            } else {
                //random and current time to ensure the id is unique
                var random = Math.random().toString().split(".")[1].substr(0, 6);
                this.id = this.name + "_" + random + (new Date()).getTime();
            }
        },

        render: function (container, data) {
            var ele = null;

            if(typeof this.beforeRender == "function") {
                this.beforeRender(template);
            }

            if(this.tpl) {
                if(!data) {
                    data = {};
                }
                //renderer widget
                var render = template.compile(this.tpl);
                var html = render(data);
                var $ele = $(html);
                if(this.id) {
                    $ele.attr("id", this.id);
                }
                //add className
                if(this.opts.class_name) {
                    $ele.addClass(this.opts.class_name);
                }
                //add styles
                if(this.opts.styles) {
                    var styles = this.opts.styles.split(";");
                    for(var i = 0; i < styles.length; i++) {
                        if(styles[i]) {
                            var style = styles[i].split(":");
                            if(style.length == 2) {
                                $ele.css(style[0], style[1]);
                            }
                        }
                    }
                }

                this.ele = ele = $ele[0];

                if(typeof this.afterRender == "function") {
                    this.afterRender();
                }

                if(container) {
                    $ele.appendTo($(container));

                    //ready event will be triggered only when widget initialized and appended to page.
                    if(typeof this.ready == "function") {
                        this.ready();
                    }
                }
            }

            return ele;
        },

        loadFile: function (files) {
            if(!files instanceof Array) {
                throw new Error('argument error. must be an Array!');
            }
            for(var i = 0; i < files.length; i++) {
                var path = files[i];
                if (!path || path.length === 0) {
                    throw new Error('argument "path" is required !');
                }
                if($.inArray(path, this.loadedFiles) == -1) {
                    var type = path.substr(path.lastIndexOf('.') + 1, path.length - 1);
                    switch (type) {
                        case "css":
                            $("head").append('<link href="' + path + '" rel="stylesheet" type="text/css">');
                            break;
                        case "js":
                            $("head").append('<script src="' + path + '"></script>');
                            break;
                        default:
                            break;
                    }

                    this.loadedFiles.push(path);
                }
            }
        },

        getElement: function () {
            return this.ele;
        },

        _initExtraFunc: function () {
            this._initAnimate();
        },

        //initialize jquery animate, so we can easier add animation to element
        _initAnimate: function () {
            if(!$.fn.animateCss) {
                //$('#yourElement').animateCss('bounce');
                //more information: https://github.com/daneden/animate.css
                $.fn.extend({
                    animateCss: function (animationName) {
                        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                        this.addClass('animated ' + animationName).one(animationEnd, function() {
                            $(this).removeClass('animated ' + animationName);
                        });
                    }
                });
            }
        }
    });
});


