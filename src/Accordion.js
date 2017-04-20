define([
    "require",
    "dojo/_base/declare",
    "base/artTemplate",
    "ecp/BaseWidget",
    "text!./Accordion/Widget.html"
], function (require, declare, template, BaseWidget, tpl) {
    return declare(BaseWidget, {
        name: "Accordion",
        //template
        tpl: tpl,
        //source file's path
        files: [require.toUrl("./Accordion/css/style.css")],
        defaults: {
            theme: undefined, //blue, green, red, white, black, default black.
            customHtml: false,
            speed: 300,
            showDelay: 0,
            hideDelay: 0,
            singleOpen: true,
            clickEffect: true,
            identifyField: undefined,
            titleField: "title",
            labelField: "label",
            iconField: "icon",
            childrenField: "nodes",
            linkTo: undefined, // when valued, identifyField must be defined.
            enableSearch: false,
            footer: false,
            callback: $.noop
        },

        constructor: function (opts) {
            this.init();
        },

        init: function () {
            if(this.opts.data instanceof Array) {
                var
                    $ele = $(this.ele),
                    html = this.buildHtml(this.opts.data);
                $ele.find('.ecp-accordion-list').html(html);

                $ele.addClass(this.opts.theme);
            } else {
                throw new Error('there are no data can be parsed.');
            }

            if(this.opts.enableSearch) {
                $.expr[":"].Contains = function(a, i, m) {
                    return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
                };
                this.filterList($(this.ele).find(".ecp-accordion-header"), $(this.ele).find(".ecp-accordion-list"));
            }

            if(this.opts.footer) {
                $(this.ele).find(".ecp-accordion-footer").html(this.opts.footer);
            }

            this.openSubmenu();
            this.submenuIndicators();
            if (this.opts.clickEffect) {
                this.addClickEffect()
            }
        },

        buildHtml: function (list) {
            var i, html = '', item, icon, href;
            for (i = 0; i < list.length; i++) {
                /**
                 * [titleField], String. display label
                 * [labelField], String. display in the right as suffix
                 * [iconField], String. font awesome class name or html
                 */
                item = list[i];

                /*if(typeof this.opts.customHtml == "function") {
                    var $item = $(this.opts.customHtml(item));
                    if(item[this.opts.childrenField]) {
                        html += '<ul class="submenu">';
                        html += this.buildHtml(item[this.opts.childrenField]);
                        html += '</ul>';
                        $item.append(html);
                    }

                    var $div = $('<div/>').append($item);
                    html += $div.html();
                } else {*/
                    if(this.checkHtml(item[this.opts.iconField])) {
                        icon = item[this.opts.iconField];
                    } else {
                        icon = '<i class="fa fa-' + item[this.opts.iconField] + '"></i>'
                    }

                    href = this.opts["linkTo"] ? this.opts["linkTo"].replace(/__id__/, item[this.opts["identifyField"]]) : "javascript:void(0);";

                    html += '<li>' +
                        '<a href="' + href + '">' + icon + item[this.opts.titleField] + '</a>';

                    if(item[this.opts.labelField]) {
                        html += '<span class="ecp-accordion-label">' + item[this.opts.labelField] + '</span>';
                    }

                    if(item[this.opts.childrenField]) {
                        html += '<ul class="submenu">';
                        html += this.buildHtml(item[this.opts.childrenField]);
                        html += '</ul>';
                    }

                    html += '</li>';
                // }
            }

            return html;
        },

        //验证字符串是否html
        checkHtml: function (htmlStr) {
            var reg = /<[^>]+>/g;
            return reg.test(htmlStr);
        },

        openSubmenu: function () {
            var that = this;
            $(this.ele).children("ul").find("li").bind("click touchstart",
                function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var $ele = $(this), indexes = [], depth, item, $pivotEle, i;
                    // 列表项背景颜色切换
                    $(that.ele).find(".ecp-accordion-list li.active").removeClass("active");
                    $ele.addClass("active");

                    if ($ele.children(".submenu").length > 0) {
                        if ($ele.children(".submenu").css("display") == "none") {
                            $ele.children(".submenu").delay(that.opts.showDelay).slideDown(that.opts.speed);
                            $ele.children(".submenu").siblings("a").addClass("submenu-indicator-minus");
                            if (that.opts.singleOpen) {
                                $ele.siblings().children(".submenu").slideUp(that.opts.speed);
                                $ele.siblings().children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
                            }
                            // return false
                        } else {
                            $ele.children(".submenu").delay(that.opts.hideDelay).slideUp(that.opts.speed)
                        }
                        if ($ele.children(".submenu").siblings("a").hasClass("submenu-indicator-minus")) {
                            $ele.children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
                        }
                    }
                    window.location.href = $ele.children("a").attr("href");

                    // 获取节点对应json
                    depth = $ele.parents("ul.submenu").length;
                    indexes.push($ele.prevAll().length);
                    // 逆向获取索引位置
                    for(i = 0; i < depth; i++) {
                        $pivotEle = $ele.closest("ul").parent("li");
                        indexes.push($pivotEle.prevAll().length);
                    }
                    indexes.reverse();

                    item = that.opts.data[indexes[0]];
                    for(i = 1; i < indexes.length; i++) {
                        item = item[that.opts.childrenField][indexes[i]];
                    }
                    that.opts.callback.call(this, item);
                })
        },
        submenuIndicators: function () {
            if ($(this.ele).find(".submenu").length > 0) {
                $(this.ele).find(".submenu").siblings("a").append("<span class='submenu-indicator'>+</span>")
            }
        },
        addClickEffect: function () {
            var ink, d, x, y;
            $(this.ele).find("a").bind("click touchstart",
                function (e) {
                    $(".ink").remove();
                    if ($(this).children(".ink").length === 0) {
                        $(this).prepend("<span class='ink'></span>")
                    }
                    ink = $(this).find(".ink");
                    ink.removeClass("animate-ink");
                    if (!ink.height() && !ink.width()) {
                        d = Math.max($(this).outerWidth(), $(this).outerHeight());
                        ink.css({
                            height: d,
                            width: d
                        })
                    }
                    x = e.pageX - $(this).offset().left - ink.width() / 2;
                    y = e.pageY - $(this).offset().top - ink.height() / 2;
                    ink.css({
                        top: y + 'px',
                        left: x + 'px'
                    }).addClass("animate-ink")
                })
        },

        filterList: function (header, list) {
            //@header 头部元素
            //@list 无序列表
            //创建一个搜素表单
            var form = $("<form>").attr({
                "class": "filterform",
                action: "#"
            }), input = $("<input>").attr({
                "class": "ecp-accordion-filterinput",
                type: "text"
            });
            $(form).append(input).appendTo(header);
            $(input).change(function () {
                var filter = $(this).val();
                if (filter) {
                    $matches = $(list).find("a:Contains(" + filter + ")").parent();
                    $("li", list).not($matches).slideUp();
                    $matches.slideDown();
                } else {
                    $(list).find("li").slideDown();
                }
                return false;
            }).keyup(function () {
                $(this).change();
            });
        }
    });
});