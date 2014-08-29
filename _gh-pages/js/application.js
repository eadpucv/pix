var hljs = new function () {
        function l(o) {
            return o.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/>/gm, "&gt;")
        }

        function b(p) {
            for (var o = p.firstChild; o; o = o.nextSibling) {
                if (o.nodeName == "CODE") {
                    return o
                }
                if (!(o.nodeType == 3 && o.nodeValue.match(/\s+/))) {
                    break
                }
            }
        }

        function h(p, o) {
            return Array.prototype.map.call(p.childNodes, function (q) {
                if (q.nodeType == 3) {
                    return o ? q.nodeValue.replace(/\n/g, "") : q.nodeValue
                }
                if (q.nodeName == "BR") {
                    return "\n"
                }
                return h(q, o)
            }).join("")
        }

        function a(q) {
            var p = (q.className + " " + q.parentNode.className).split(/\s+/);
            p = p.map(function (r) {
                return r.replace(/^language-/, "")
            });
            for (var o = 0; o < p.length; o++) {
                if (e[p[o]] || p[o] == "no-highlight") {
                    return p[o]
                }
            }
        }

        function c(q) {
            var o = [];
            (function p(r, s) {
                for (var t = r.firstChild; t; t = t.nextSibling) {
                    if (t.nodeType == 3) {
                        s += t.nodeValue.length
                    } else {
                        if (t.nodeName == "BR") {
                            s += 1
                        } else {
                            if (t.nodeType == 1) {
                                o.push({
                                    event: "start",
                                    offset: s,
                                    node: t
                                });
                                s = p(t, s);
                                o.push({
                                    event: "stop",
                                    offset: s,
                                    node: t
                                })
                            }
                        }
                    }
                }
                return s
            })(q, 0);
            return o
        }

        function j(x, v, w) {
            var p = 0;
            var y = "";
            var r = [];

            function t() {
                if (x.length && v.length) {
                    if (x[0].offset != v[0].offset) {
                        return (x[0].offset < v[0].offset) ? x : v
                    } else {
                        return v[0].event == "start" ? x : v
                    }
                } else {
                    return x.length ? x : v
                }
            }

            function s(A) {
                function z(B) {
                    return " " + B.nodeName + '="' + l(B.value) + '"'
                }
                return "<" + A.nodeName + Array.prototype.map.call(A.attributes, z).join("") + ">"
            }
            while (x.length || v.length) {
                var u = t().splice(0, 1)[0];
                y += l(w.substr(p, u.offset - p));
                p = u.offset;
                if (u.event == "start") {
                    y += s(u.node);
                    r.push(u.node)
                } else {
                    if (u.event == "stop") {
                        var o, q = r.length;
                        do {
                            q--;
                            o = r[q];
                            y += ("</" + o.nodeName.toLowerCase() + ">")
                        } while (o != u.node);
                        r.splice(q, 1);
                        while (q < r.length) {
                            y += s(r[q]);
                            q++
                        }
                    }
                }
            }
            return y + l(w.substr(p))
        }

        function f(q) {
            function o(s, r) {
                return RegExp(s, "m" + (q.cI ? "i" : "") + (r ? "g" : ""))
            }

            function p(y, w) {
                if (y.compiled) {
                    return
                }
                y.compiled = true;
                var s = [];
                if (y.k) {
                    var r = {};

                    function z(A, t) {
                        t.split(" ").forEach(function (B) {
                            var C = B.split("|");
                            r[C[0]] = [A, C[1] ? Number(C[1]) : 1];
                            s.push(C[0])
                        })
                    }
                    y.lR = o(y.l || hljs.IR, true);
                    if (typeof y.k == "string") {
                        z("keyword", y.k)
                    } else {
                        for (var x in y.k) {
                            if (!y.k.hasOwnProperty(x)) {
                                continue
                            }
                            z(x, y.k[x])
                        }
                    }
                    y.k = r
                }
                if (w) {
                    if (y.bWK) {
                        y.b = "\\b(" + s.join("|") + ")\\s"
                    }
                    y.bR = o(y.b ? y.b : "\\B|\\b");
                    if (!y.e && !y.eW) {
                        y.e = "\\B|\\b"
                    }
                    if (y.e) {
                        y.eR = o(y.e)
                    }
                    y.tE = y.e || "";
                    if (y.eW && w.tE) {
                        y.tE += (y.e ? "|" : "") + w.tE
                    }
                }
                if (y.i) {
                    y.iR = o(y.i)
                }
                if (y.r === undefined) {
                    y.r = 1
                }
                if (!y.c) {
                    y.c = []
                }
                for (var v = 0; v < y.c.length; v++) {
                    if (y.c[v] == "self") {
                        y.c[v] = y
                    }
                    p(y.c[v], y)
                }
                if (y.starts) {
                    p(y.starts, w)
                }
                var u = [];
                for (var v = 0; v < y.c.length; v++) {
                    u.push(y.c[v].b)
                }
                if (y.tE) {
                    u.push(y.tE)
                }
                if (y.i) {
                    u.push(y.i)
                }
                y.t = u.length ? o(u.join("|"), true) : {
                    exec: function (t) {
                        return null
                    }
                }
            }
            p(q)
        }

        function d(D, E) {
            function o(r, M) {
                for (var L = 0; L < M.c.length; L++) {
                    var K = M.c[L].bR.exec(r);
                    if (K && K.index == 0) {
                        return M.c[L]
                    }
                }
            }

            function s(K, r) {
                if (K.e && K.eR.test(r)) {
                    return K
                }
                if (K.eW) {
                    return s(K.parent, r)
                }
            }

            function t(r, K) {
                return K.i && K.iR.test(r)
            }

            function y(L, r) {
                var K = F.cI ? r[0].toLowerCase() : r[0];
                return L.k.hasOwnProperty(K) && L.k[K]
            }

            function G() {
                var K = l(w);
                if (!A.k) {
                    return K
                }
                var r = "";
                var N = 0;
                A.lR.lastIndex = 0;
                var L = A.lR.exec(K);
                while (L) {
                    r += K.substr(N, L.index - N);
                    var M = y(A, L);
                    if (M) {
                        v += M[1];
                        r += '<span class="' + M[0] + '">' + L[0] + "</span>"
                    } else {
                        r += L[0]
                    }
                    N = A.lR.lastIndex;
                    L = A.lR.exec(K)
                }
                return r + K.substr(N)
            }

            function z() {
                if (A.sL && !e[A.sL]) {
                    return l(w)
                }
                var r = A.sL ? d(A.sL, w) : g(w);
                if (A.r > 0) {
                    v += r.keyword_count;
                    B += r.r
                }
                return '<span class="' + r.language + '">' + r.value + "</span>"
            }

            function J() {
                return A.sL !== undefined ? z() : G()
            }

            function I(L, r) {
                var K = L.cN ? '<span class="' + L.cN + '">' : "";
                if (L.rB) {
                    x += K;
                    w = ""
                } else {
                    if (L.eB) {
                        x += l(r) + K;
                        w = ""
                    } else {
                        x += K;
                        w = r
                    }
                }
                A = Object.create(L, {
                    parent: {
                        value: A
                    }
                });
                B += L.r
            }

            function C(K, r) {
                w += K;
                if (r === undefined) {
                    x += J();
                    return 0
                }
                var L = o(r, A);
                if (L) {
                    x += J();
                    I(L, r);
                    return L.rB ? 0 : r.length
                }
                var M = s(A, r);
                if (M) {
                    if (!(M.rE || M.eE)) {
                        w += r
                    }
                    x += J();
                    do {
                        if (A.cN) {
                            x += "</span>"
                        }
                        A = A.parent
                    } while (A != M.parent);
                    if (M.eE) {
                        x += l(r)
                    }
                    w = "";
                    if (M.starts) {
                        I(M.starts, "")
                    }
                    return M.rE ? 0 : r.length
                }
                if (t(r, A)) {
                    throw "Illegal"
                }
                w += r;
                return r.length || 1
            }
            var F = e[D];
            f(F);
            var A = F;
            var w = "";
            var B = 0;
            var v = 0;
            var x = "";
            try {
                var u, q, p = 0;
                while (true) {
                    A.t.lastIndex = p;
                    u = A.t.exec(E);
                    if (!u) {
                        break
                    }
                    q = C(E.substr(p, u.index - p), u[0]);
                    p = u.index + q
                }
                C(E.substr(p));
                return {
                    r: B,
                    keyword_count: v,
                    value: x,
                    language: D
                }
            } catch (H) {
                if (H == "Illegal") {
                    return {
                        r: 0,
                        keyword_count: 0,
                        value: l(E)
                    }
                } else {
                    throw H
                }
            }
        }

        function g(s) {
            var o = {
                keyword_count: 0,
                r: 0,
                value: l(s)
            };
            var q = o;
            for (var p in e) {
                if (!e.hasOwnProperty(p)) {
                    continue
                }
                var r = d(p, s);
                r.language = p;
                if (r.keyword_count + r.r > q.keyword_count + q.r) {
                    q = r
                }
                if (r.keyword_count + r.r > o.keyword_count + o.r) {
                    q = o;
                    o = r
                }
            }
            if (q.language) {
                o.second_best = q
            }
            return o
        }

        function i(q, p, o) {
            if (p) {
                q = q.replace(/^((<[^>]+>|\t)+)/gm, function (r, v, u, t) {
                    return v.replace(/\t/g, p)
                })
            }
            if (o) {
                q = q.replace(/\n/g, "<br>")
            }
            return q
        }

        function m(r, u, p) {
            var v = h(r, p);
            var t = a(r);
            if (t == "no-highlight") {
                return
            }
            var w = t ? d(t, v) : g(v);
            t = w.language;
            var o = c(r);
            if (o.length) {
                var q = document.createElement("pre");
                q.innerHTML = w.value;
                w.value = j(o, c(q), v)
            }
            w.value = i(w.value, u, p);
            var s = r.className;
            if (!s.match("(\\s|^)(language-)?" + t + "(\\s|$)")) {
                s = s ? (s + " " + t) : t
            }
            r.innerHTML = w.value;
            r.className = s;
            r.result = {
                language: t,
                kw: w.keyword_count,
                re: w.r
            };
            if (w.second_best) {
                r.second_best = {
                    language: w.second_best.language,
                    kw: w.second_best.keyword_count,
                    re: w.second_best.r
                }
            }
        }

        function n() {
            if (n.called) {
                return
            }
            n.called = true;
            Array.prototype.map.call(document.getElementsByTagName("pre"), b).filter(Boolean).forEach(function (o) {
                m(o, hljs.tabReplace)
            })
        }

        function k() {
            window.addEventListener("DOMContentLoaded", n, false);
            window.addEventListener("load", n, false)
        }
        var e = {};
        this.LANGUAGES = e;
        this.highlight = d;
        this.highlightAuto = g;
        this.fixMarkup = i;
        this.highlightBlock = m;
        this.initHighlighting = n;
        this.initHighlightingOnLoad = k;
        this.IR = "[a-zA-Z][a-zA-Z0-9_]*";
        this.UIR = "[a-zA-Z_][a-zA-Z0-9_]*";
        this.NR = "\\b\\d+(\\.\\d+)?";
        this.CNR = "(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
        this.BNR = "\\b(0b[01]+)";
        this.RSR = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
        this.BE = {
            b: "\\\\[\\s\\S]",
            r: 0
        };
        this.ASM = {
            cN: "string",
            b: "'",
            e: "'",
            i: "\\n",
            c: [this.BE],
            r: 0
        };
        this.QSM = {
            cN: "string",
            b: '"',
            e: '"',
            i: "\\n",
            c: [this.BE],
            r: 0
        };
        this.CLCM = {
            cN: "comment",
            b: "//",
            e: "$"
        };
        this.CBLCLM = {
            cN: "comment",
            b: "/\\*",
            e: "\\*/"
        };
        this.HCM = {
            cN: "comment",
            b: "#",
            e: "$"
        };
        this.NM = {
            cN: "number",
            b: this.NR,
            r: 0
        };
        this.CNM = {
            cN: "number",
            b: this.CNR,
            r: 0
        };
        this.BNM = {
            cN: "number",
            b: this.BNR,
            r: 0
        };
        this.inherit = function (q, r) {
            var o = {};
            for (var p in q) {
                o[p] = q[p]
            }
            if (r) {
                for (var p in r) {
                    o[p] = r[p]
                }
            }
            return o
        }
    }();
hljs.LANGUAGES.javascript = function (a) {
    return {
        k: {
            keyword: "in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const",
            literal: "true false null undefined NaN Infinity"
        },
        c: [a.ASM, a.QSM, a.CLCM, a.CBLCLM, a.CNM, {
            b: "(" + a.RSR + "|\\b(case|return|throw)\\b)\\s*",
            k: "return throw case",
            c: [a.CLCM, a.CBLCLM, {
                cN: "regexp",
                b: "/",
                e: "/[gim]*",
                i: "\\n",
                c: [{
                    b: "\\\\/"
                }]
            }, {
                b: "<",
                e: ">;",
                sL: "xml"
            }],
            r: 0
        }, {
            cN: "function",
            bWK: true,
            e: "{",
            k: "function",
            c: [{
                cN: "title",
                b: "[A-Za-z$_][0-9A-Za-z$_]*"
            }, {
                cN: "params",
                b: "\\(",
                e: "\\)",
                c: [a.CLCM, a.CBLCLM],
                i: "[\"'\\(]"
            }],
            i: "\\[|%"
        }]
    }
}(hljs);
hljs.LANGUAGES.css = function (a) {
    var b = {
        cN: "function",
        b: a.IR + "\\(",
        e: "\\)",
        c: [a.NM, a.ASM, a.QSM]
    };
    return {
        cI: true,
        i: "[=/|']",
        c: [a.CBLCLM, {
            cN: "id",
            b: "\\#[A-Za-z0-9_-]+"
        }, {
            cN: "class",
            b: "\\.[A-Za-z0-9_-]+",
            r: 0
        }, {
            cN: "attr_selector",
            b: "\\[",
            e: "\\]",
            i: "$"
        }, {
            cN: "pseudo",
            b: ":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"
        }, {
            cN: "at_rule",
            b: "@(font-face|page)",
            l: "[a-z-]+",
            k: "font-face page"
        }, {
            cN: "at_rule",
            b: "@",
            e: "[{;]",
            eE: true,
            k: "import page media charset",
            c: [b, a.ASM, a.QSM, a.NM]
        }, {
            cN: "tag",
            b: a.IR,
            r: 0
        }, {
            cN: "rules",
            b: "{",
            e: "}",
            i: "[^\\s]",
            r: 0,
            c: [a.CBLCLM, {
                cN: "rule",
                b: "[^\\s]",
                rB: true,
                e: ";",
                eW: true,
                c: [{
                    cN: "attribute",
                    b: "[A-Z\\_\\.\\-]+",
                    e: ":",
                    eE: true,
                    i: "[^\\s]",
                    starts: {
                        cN: "value",
                        eW: true,
                        eE: true,
                        c: [b, a.NM, a.QSM, a.ASM, a.CBLCLM, {
                            cN: "hexcolor",
                            b: "\\#[0-9A-F]+"
                        }, {
                            cN: "important",
                            b: "!important"
                        }]
                    }
                }]
            }]
        }]
    }
}(hljs);
hljs.LANGUAGES.xml = function (a) {
    var c = "[A-Za-z0-9\\._:-]+";
    var b = {
        eW: true,
        c: [{
            cN: "attribute",
            b: c,
            r: 0
        }, {
            b: '="',
            rB: true,
            e: '"',
            c: [{
                cN: "value",
                b: '"',
                eW: true
            }]
        }, {
            b: "='",
            rB: true,
            e: "'",
            c: [{
                cN: "value",
                b: "'",
                eW: true
            }]
        }, {
            b: "=",
            c: [{
                cN: "value",
                b: "[^\\s/>]+"
            }]
        }]
    };
    return {
        cI: true,
        c: [{
            cN: "pi",
            b: "<\\?",
            e: "\\?>",
            r: 10
        }, {
            cN: "doctype",
            b: "<!DOCTYPE",
            e: ">",
            r: 10,
            c: [{
                b: "\\[",
                e: "\\]"
            }]
        }, {
            cN: "comment",
            b: "<!--",
            e: "-->",
            r: 10
        }, {
            cN: "cdata",
            b: "<\\!\\[CDATA\\[",
            e: "\\]\\]>",
            r: 10
        }, {
            cN: "tag",
            b: "<style(?=\\s|>|$)",
            e: ">",
            k: {
                title: "style"
            },
            c: [b],
            starts: {
                e: "</style>",
                rE: true,
                sL: "css"
            }
        }, {
            cN: "tag",
            b: "<script(?=\\s|>|$)",
            e: ">",
            k: {
                title: "script"
            },
            c: [b],
            starts: {
                e: "<\/script>",
                rE: true,
                sL: "javascript"
            }
        }, {
            b: "<%",
            e: "%>",
            sL: "vbscript"
        }, {
            cN: "tag",
            b: "</?",
            e: "/?>",
            c: [{
                    cN: "title",
                    b: "[^ />]+"
                },
                b
            ]
        }]
    }
}(hljs);
(function () {
    var $, Lightbox, LightboxOptions;
    $ = jQuery;
    LightboxOptions = (function () {
        function LightboxOptions() {
            this.fileLoadingImage = '/images/loading.gif';
            this.resizeDuration = 700;
            this.fadeDuration = 500;
            this.labelImage = "Image";
            this.labelOf = "of";
        }
        return LightboxOptions;
    })();
    Lightbox = (function () {
        function Lightbox(options) {
            this.options = options;
            this.album = [];
            this.currentImageIndex = void 0;
            this.init();
        }
        Lightbox.prototype.init = function () {
            this.enable();
            return this.build();
        };
        Lightbox.prototype.enable = function () {
            var _this = this;
            return $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox]', function (e) {
                _this.start($(e.currentTarget));
                return false;
            });
        };
        Lightbox.prototype.build = function () {
            var $lightbox, _this = this;
            $("<div>", {
                id: 'lightboxOverlay'
            }).appendTo($('body'))
            $('<div/>', {
                id: 'lightbox'
            }).append($('<div/>', {
                "class": 'lb-outerContainer'
            }).append($('<div/>', {
                "class": 'lb-container'
            }).append($('<img/>', {
                "class": 'lb-image'
            }), $('<div/>', {
                "class": 'lb-nav'
            }).append($('<a/>', {
                "class": 'lb-prev'
            }), $('<a/>', {
                "class": 'lb-next'
            })), $('<div/>', {
                "class": 'lb-loader'
            }).append($('<a/>', {
                "class": 'lb-cancel'
            }).append($('<img/>', {
                src: this.options.fileLoadingImage
            }))))), $('<div/>', {
                "class": 'lb-dataContainer'
            }).append($('<div/>', {
                "class": 'lb-data'
            }).append($('<div/>', {
                "class": 'lb-details'
            }).append($('<span/>', {
                "class": 'lb-caption'
            }), $('<span/>', {
                "class": 'lb-number'
            })), $('<div/>', {
                "class": 'lb-closeContainer'
            }).append($('<a/>', {
                "class": 'lb-close'
            }).append($('<img/>', {
                src: this.options.fileCloseImage
            })))))).appendTo($('body'));
            $('#lightboxOverlay').hide().on('click', function (e) {
                _this.end();
                return false;
            });
            $lightbox = $('#lightbox');
            $lightbox.hide().on('click', function (e) {
                if ($(e.target).attr('id') === 'lightbox') _this.end();
                return false;
            });
            $lightbox.find('.lb-outerContainer').on('click', function (e) {
                if ($(e.target).attr('id') === 'lightbox') _this.end();
                return false;
            });
            $lightbox.find('.lb-prev').on('click', function (e) {
                _this.changeImage(_this.currentImageIndex - 1);
                return false;
            });
            $lightbox.find('.lb-next').on('click', function (e) {
                _this.changeImage(_this.currentImageIndex + 1);
                return false;
            });
            $lightbox.find('.lb-loader, .lb-close').on('click', function (e) {
                _this.end();
                return false;
            });
        };
        Lightbox.prototype.start = function ($link) {
            var $lightbox, $window, a, i, imageNumber, left, top, _len, _ref;
            $(window).on("resize", this.sizeOverlay);
            $('select, object, embed').css({
                visibility: "hidden"
            });
            $('#lightboxOverlay').width($(document).width()).height($(document).height()).fadeIn(this.options.fadeDuration);
            this.album = [];
            imageNumber = 0;
            if ($link.attr('rel') === 'lightbox') {
                this.album.push({
                    link: $link.attr('href'),
                    title: $link.attr('title')
                });
            } else {
                _ref = $($link.prop("tagName") + '[rel="' + $link.attr('rel') + '"]');
                for (i = 0, _len = _ref.length; i < _len; i++) {
                    a = _ref[i];
                    this.album.push({
                        link: $(a).attr('href'),
                        title: $(a).attr('title')
                    });
                    if ($(a).attr('href') === $link.attr('href')) imageNumber = i;
                }
            }
            $window = $(window);
            top = $window.scrollTop() + $window.height() / 10;
            left = $window.scrollLeft();
            $lightbox = $('#lightbox');
            $lightbox.css({
                top: top + 'px',
                left: left + 'px'
            }).fadeIn(this.options.fadeDuration);
            this.changeImage(imageNumber);
        };
        Lightbox.prototype.changeImage = function (imageNumber) {
            var $image, $lightbox, preloader, _this = this;
            this.disableKeyboardNav();
            $lightbox = $('#lightbox');
            $image = $lightbox.find('.lb-image');
            this.sizeOverlay();
            $('#lightboxOverlay').fadeIn(this.options.fadeDuration);
            $('.loader').fadeIn('slow');
            $lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();
            $lightbox.find('.lb-outerContainer').addClass('animating');
            preloader = new Image;
            preloader.onload = function () {
                $image.attr('src', _this.album[imageNumber].link);
                $image.width = preloader.width;
                $image.height = preloader.height;
                return _this.sizeContainer(preloader.width, preloader.height);
            };
            preloader.src = this.album[imageNumber].link;
            this.currentImageIndex = imageNumber;
        };
        Lightbox.prototype.sizeOverlay = function () {
            return $('#lightboxOverlay').width($(document).width()).height($(document).height());
        };
        Lightbox.prototype.sizeContainer = function (imageWidth, imageHeight) {
            var $container, $lightbox, $outerContainer, containerBottomPadding, containerLeftPadding, containerRightPadding, containerTopPadding, newHeight, newWidth, oldHeight, oldWidth, _this = this;
            $lightbox = $('#lightbox');
            $outerContainer = $lightbox.find('.lb-outerContainer');
            oldWidth = $outerContainer.outerWidth();
            oldHeight = $outerContainer.outerHeight();
            $container = $lightbox.find('.lb-container');
            containerTopPadding = parseInt($container.css('padding-top'), 10);
            containerRightPadding = parseInt($container.css('padding-right'), 10);
            containerBottomPadding = parseInt($container.css('padding-bottom'), 10);
            containerLeftPadding = parseInt($container.css('padding-left'), 10);
            newWidth = imageWidth + containerLeftPadding + containerRightPadding;
            newHeight = imageHeight + containerTopPadding + containerBottomPadding;
            if (newWidth !== oldWidth && newHeight !== oldHeight) {
                $outerContainer.animate({
                    width: newWidth,
                    height: newHeight
                }, this.options.resizeDuration, 'swing');
            } else if (newWidth !== oldWidth) {
                $outerContainer.animate({
                    width: newWidth
                }, this.options.resizeDuration, 'swing');
            } else if (newHeight !== oldHeight) {
                $outerContainer.animate({
                    height: newHeight
                }, this.options.resizeDuration, 'swing');
            }
            setTimeout(function () {
                $lightbox.find('.lb-dataContainer').width(newWidth);
                $lightbox.find('.lb-prevLink').height(newHeight);
                $lightbox.find('.lb-nextLink').height(newHeight);
                _this.showImage();
            }, this.options.resizeDuration);
        };
        Lightbox.prototype.showImage = function () {
            var $lightbox;
            $lightbox = $('#lightbox');
            $lightbox.find('.lb-loader').hide();
            $lightbox.find('.lb-image').fadeIn('slow');
            this.updateNav();
            this.updateDetails();
            this.preloadNeighboringImages();
            this.enableKeyboardNav();
        };
        Lightbox.prototype.updateNav = function () {
            var $lightbox;
            $lightbox = $('#lightbox');
            $lightbox.find('.lb-nav').show();
            if (this.currentImageIndex > 0) $lightbox.find('.lb-prev').show();
            if (this.currentImageIndex < this.album.length - 1) {
                $lightbox.find('.lb-next').show();
            }
        };
        Lightbox.prototype.updateDetails = function () {
            var $lightbox, _this = this;
            $lightbox = $('#lightbox');
            if (typeof this.album[this.currentImageIndex].title !== 'undefined' && this.album[this.currentImageIndex].title !== "") {
                $lightbox.find('.lb-caption').html(this.album[this.currentImageIndex].title).fadeIn('fast');
            }
            if (this.album.length > 1) {
                $lightbox.find('.lb-number').html(this.options.labelImage + ' ' + (this.currentImageIndex + 1) + ' ' + this.options.labelOf + '  ' + this.album.length).fadeIn('fast');
            } else {
                $lightbox.find('.lb-number').hide();
            }
            $lightbox.find('.lb-outerContainer').removeClass('animating');
            $lightbox.find('.lb-dataContainer').fadeIn(this.resizeDuration, function () {
                return _this.sizeOverlay();
            });
        };
        Lightbox.prototype.preloadNeighboringImages = function () {
            var preloadNext, preloadPrev;
            if (this.album.length > this.currentImageIndex + 1) {
                preloadNext = new Image;
                preloadNext.src = this.album[this.currentImageIndex + 1].link;
            }
            if (this.currentImageIndex > 0) {
                preloadPrev = new Image;
                preloadPrev.src = this.album[this.currentImageIndex - 1].link;
            }
        };
        Lightbox.prototype.enableKeyboardNav = function () {
            $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
        };
        Lightbox.prototype.disableKeyboardNav = function () {
            $(document).off('.keyboard');
        };
        Lightbox.prototype.keyboardAction = function (event) {
            var KEYCODE_ESC, KEYCODE_LEFTARROW, KEYCODE_RIGHTARROW, key, keycode;
            KEYCODE_ESC = 27;
            KEYCODE_LEFTARROW = 37;
            KEYCODE_RIGHTARROW = 39;
            keycode = event.keyCode;
            key = String.fromCharCode(keycode).toLowerCase();
            if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
                this.end();
            } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
                if (this.currentImageIndex !== 0) {
                    this.changeImage(this.currentImageIndex - 1);
                }
            } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
                if (this.currentImageIndex !== this.album.length - 1) {
                    this.changeImage(this.currentImageIndex + 1);
                }
            }
        };
        Lightbox.prototype.end = function () {
            this.disableKeyboardNav();
            $(window).off("resize", this.sizeOverlay);
            $('#lightbox').fadeOut(this.options.fadeDuration);
            $('#lightboxOverlay').fadeOut(this.options.fadeDuration);
            return $('select, object, embed').css({
                visibility: "visible"
            });
        };
        return Lightbox;
    })();
    $(function () {
        var lightbox, options;
        options = new LightboxOptions;
        return lightbox = new Lightbox(options);
    });
}).call(this);
(function (undefined) {
    'use strict';
    var Cookies = function (key, value, options) {
        return arguments.length === 1 ? Cookies.get(key) : Cookies.set(key, value, options);
    };
    Cookies._document = document;
    Cookies._navigator = navigator;
    Cookies.defaults = {
        path: '/'
    };
    Cookies.get = function (key) {
        if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
            Cookies._renewCache();
        }
        return Cookies._cache[key];
    };
    Cookies.set = function (key, value, options) {
        options = Cookies._getExtendedOptions(options);
        options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);
        Cookies._document.cookie = Cookies._generateCookieString(key, value, options);
        return Cookies;
    };
    Cookies.expire = function (key, options) {
        return Cookies.set(key, undefined, options);
    };
    Cookies._areEnabled = function () {
        return Cookies._navigator.cookieEnabled || Cookies.set('cookies.js', 1).get('cookies.js') === '1';
    };
    Cookies.enabled = Cookies._areEnabled();
    Cookies._getExtendedOptions = function (options) {
        return {
            path: options && options.path || Cookies.defaults.path,
            domain: options && options.domain || Cookies.defaults.domain,
            expires: options && options.expires || Cookies.defaults.expires,
            secure: options && options.secure !== undefined ? options.secure : Cookies.defaults.secure
        };
    };
    Cookies._isValidDate = function (date) {
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    };
    Cookies._getExpiresDate = function (expires, now) {
        now = now || new Date();
        switch (typeof expires) {
        case 'number':
            expires = new Date(now.getTime() + expires * 1000);
            break;
        case 'string':
            expires = new Date(expires);
            break;
        }
        if (expires && !Cookies._isValidDate(expires)) {
            throw new Error('`expires` parameter cannot be converted to a valid Date instance');
        }
        return expires;
    };
    Cookies._generateCookieString = function (key, value, options) {
        key = encodeURIComponent(key);
        value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
        options = options || {};
        var cookieString = key + '=' + value;
        cookieString += options.path ? ';path=' + options.path : '';
        cookieString += options.domain ? ';domain=' + options.domain : '';
        cookieString += options.expires ? ';expires=' + options.expires.toGMTString() : '';
        cookieString += options.secure ? ';secure' : '';
        return cookieString;
    };
    Cookies._getCookieObjectFromString = function (documentCookie) {
        var cookieObject = {};
        var cookiesArray = documentCookie ? documentCookie.split('; ') : [];
        for (var i = 0; i < cookiesArray.length; i++) {
            var separatorIndex = cookiesArray[i].indexOf('=');
            var key = decodeURIComponent(cookiesArray[i].substr(0, separatorIndex));
            if (cookieObject[key] === undefined) {
                var value = decodeURIComponent(cookiesArray[i].substr(separatorIndex + 1));
                cookieObject[key] = value;
            }
        }
        return cookieObject;
    };
    Cookies._renewCache = function () {
        Cookies._cache = Cookies._getCookieObjectFromString(Cookies._document.cookie);
        Cookies._cachedDocumentCookie = Cookies._document.cookie;
    };
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Cookies;
        });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Cookies;
        }
        exports.Cookies = Cookies;
    } else {
        window.Cookies = Cookies;
    }
})();
(function () {
    var SelectParser;
    SelectParser = (function () {
        function SelectParser() {
            this.options_index = 0;
            this.parsed = [];
        }
        SelectParser.prototype.add_node = function (child) {
            if (child.nodeName.toUpperCase() === "OPTGROUP") {
                return this.add_group(child);
            } else {
                return this.add_option(child);
            }
        };
        SelectParser.prototype.add_group = function (group) {
            var group_position, option, _i, _len, _ref, _results;
            group_position = this.parsed.length;
            this.parsed.push({
                array_index: group_position,
                group: true,
                label: group.label,
                children: 0,
                disabled: group.disabled
            });
            _ref = group.childNodes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                _results.push(this.add_option(option, group_position, group.disabled));
            }
            return _results;
        };
        SelectParser.prototype.add_option = function (option, group_position, group_disabled) {
            if (option.nodeName.toUpperCase() === "OPTION") {
                if (option.text !== "") {
                    if (group_position != null) {
                        this.parsed[group_position].children += 1;
                    }
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        value: option.value,
                        text: option.text,
                        html: option.innerHTML,
                        selected: option.selected,
                        disabled: group_disabled === true ? group_disabled : option.disabled,
                        group_array_index: group_position,
                        classes: option.className,
                        style: option.style.cssText
                    });
                } else {
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        empty: true
                    });
                }
                return this.options_index += 1;
            }
        };
        return SelectParser;
    })();
    SelectParser.select_to_array = function (select) {
        var child, parser, _i, _len, _ref;
        parser = new SelectParser();
        _ref = select.childNodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            parser.add_node(child);
        }
        return parser.parsed;
    };
    this.SelectParser = SelectParser;
}).call(this);
(function () {
    var AbstractChosen, root;
    root = this;
    AbstractChosen = (function () {
        function AbstractChosen(form_field, options) {
            this.form_field = form_field;
            this.options = options != null ? options : {};
            this.is_multiple = this.form_field.multiple;
            this.set_default_text();
            this.set_default_values();
            this.setup();
            this.set_up_html();
            this.register_observers();
            this.finish_setup();
        }
        AbstractChosen.prototype.set_default_values = function () {
            var _this = this;
            this.click_test_action = function (evt) {
                return _this.test_active_click(evt);
            };
            this.activate_action = function (evt) {
                return _this.activate_field(evt);
            };
            this.active_field = false;
            this.mouse_on_container = false;
            this.results_showing = false;
            this.result_highlighted = null;
            this.result_single_selected = null;
            this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
            this.disable_search_threshold = this.options.disable_search_threshold || 0;
            this.disable_search = this.options.disable_search || false;
            this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
            this.search_contains = this.options.search_contains || false;
            this.choices = 0;
            this.single_backstroke_delete = this.options.single_backstroke_delete || false;
            this.max_selected_options = this.options.max_selected_options || Infinity;
            return this.inherit_select_classes = this.options.inherit_select_classes || false;
        };
        AbstractChosen.prototype.set_default_text = function () {
            if (this.form_field.getAttribute("data-placeholder")) {
                this.default_text = this.form_field.getAttribute("data-placeholder");
            } else if (this.is_multiple) {
                this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || "Select Some Options";
            } else {
                this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || "Select an Option";
            }
            return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || "No results match";
        };
        AbstractChosen.prototype.mouse_enter = function () {
            return this.mouse_on_container = true;
        };
        AbstractChosen.prototype.mouse_leave = function () {
            return this.mouse_on_container = false;
        };
        AbstractChosen.prototype.input_focus = function (evt) {
            var _this = this;
            if (this.is_multiple) {
                if (!this.active_field) {
                    return setTimeout((function () {
                        return _this.container_mousedown();
                    }), 50);
                }
            } else {
                if (!this.active_field) {
                    return this.activate_field();
                }
            }
        };
        AbstractChosen.prototype.input_blur = function (evt) {
            var _this = this;
            if (!this.mouse_on_container) {
                this.active_field = false;
                return setTimeout((function () {
                    return _this.blur_test();
                }), 100);
            }
        };
        AbstractChosen.prototype.result_add_option = function (option) {
            var classes, style;
            if (!option.disabled) {
                option.dom_id = this.container_id + "_o_" + option.array_index;
                classes = option.selected && this.is_multiple ? [] : ["active-result"];
                if (option.selected) {
                    classes.push("result-selected");
                }
                if (option.group_array_index != null) {
                    classes.push("group-option");
                }
                if (option.classes !== "") {
                    classes.push(option.classes);
                }
                style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
                return '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '"' + style + '>' + option.html + '</li>';
            } else {
                return "";
            }
        };
        AbstractChosen.prototype.results_update_field = function () {
            if (!this.is_multiple) {
                this.results_reset_cleanup();
            }
            this.result_clear_highlight();
            this.result_single_selected = null;
            return this.results_build();
        };
        AbstractChosen.prototype.results_toggle = function () {
            if (this.results_showing) {
                return this.results_hide();
            } else {
                return this.results_show();
            }
        };
        AbstractChosen.prototype.results_search = function (evt) {
            if (this.results_showing) {
                return this.winnow_results();
            } else {
                return this.results_show();
            }
        };
        AbstractChosen.prototype.keyup_checker = function (evt) {
            var stroke, _ref;
            stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
            this.search_field_scale();
            switch (stroke) {
            case 8:
                if (this.is_multiple && this.backstroke_length < 1 && this.choices > 0) {
                    return this.keydown_backstroke();
                } else if (!this.pending_backstroke) {
                    this.result_clear_highlight();
                    return this.results_search();
                }
                break;
            case 13:
                evt.preventDefault();
                if (this.results_showing) {
                    return this.result_select(evt);
                }
                break;
            case 27:
                if (this.results_showing) {
                    this.results_hide();
                }
                return true;
            case 9:
            case 38:
            case 40:
            case 16:
            case 91:
            case 17:
                break;
            default:
                return this.results_search();
            }
        };
        AbstractChosen.prototype.generate_field_id = function () {
            var new_id;
            new_id = this.generate_random_id();
            this.form_field.id = new_id;
            return new_id;
        };
        AbstractChosen.prototype.generate_random_char = function () {
            var chars, newchar, rand;
            chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            rand = Math.floor(Math.random() * chars.length);
            return newchar = chars.substring(rand, rand + 1);
        };
        return AbstractChosen;
    })();
    root.AbstractChosen = AbstractChosen;
}).call(this);
(function () {
    var $, Chosen, get_side_border_padding, root, __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    root = this;
    $ = jQuery;
    $.fn.extend({
        chosen: function (options) {
            var browser, match, ua;
            ua = navigator.userAgent.toLowerCase();
            match = /(msie) ([\w.]+)/.exec(ua) || [];
            browser = {
                name: match[1] || "",
                version: match[2] || "0"
            };
            if (browser.name === "msie" && (browser.version === "6.0" || (browser.version === "7.0" && document.documentMode === 7))) {
                return this;
            }
            return this.each(function (input_field) {
                var $this;
                $this = $(this);
                if (!$this.hasClass("chzn-done")) {
                    return $this.data('chosen', new Chosen(this, options));
                }
            });
        }
    });
    Chosen = (function (_super) {
        __extends(Chosen, _super);

        function Chosen() {
            return Chosen.__super__.constructor.apply(this, arguments);
        }
        Chosen.prototype.setup = function () {
            this.form_field_jq = $(this.form_field);
            this.current_value = this.form_field_jq.val();
            return this.is_rtl = this.form_field_jq.hasClass("chzn-rtl");
        };
        Chosen.prototype.finish_setup = function () {
            return this.form_field_jq.addClass("chzn-done");
        };
        Chosen.prototype.set_up_html = function () {
            var container_classes, container_div, container_props, dd_top, dd_width, sf_width;
            this.container_id = this.form_field.id.length ? this.form_field.id.replace(/[^\w]/g, '_') : this.generate_field_id();
            this.container_id += "_chzn";
            container_classes = ["chzn-container"];
            container_classes.push("chzn-container-" + (this.is_multiple ? "multi" : "single"));
            if (this.inherit_select_classes && this.form_field.className) {
                container_classes.push(this.form_field.className);
            }
            if (this.is_rtl) {
                container_classes.push("chzn-rtl");
            }
            this.f_width = this.form_field_jq.outerWidth();
            container_props = {
                id: this.container_id,
                "class": container_classes.join(' '),
                style: 'width: ' + this.f_width + 'px;',
                title: this.form_field.title
            };
            container_div = $("<div />", container_props);
            if (this.is_multiple) {
                container_div.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>');
            } else {
                container_div.html('<a href="javascript:void(0)" class="chzn-single chzn-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');
            }
            this.form_field_jq.hide().after(container_div);
            this.container = $('#' + this.container_id);
            this.dropdown = this.container.find('div.chzn-drop').first();
            dd_top = this.container.height();
            dd_width = this.f_width - get_side_border_padding(this.dropdown);
            this.dropdown.css({
                "width": dd_width + "px",
                "top": dd_top + "px"
            });
            this.search_field = this.container.find('input').first();
            this.search_results = this.container.find('ul.chzn-results').first();
            this.search_field_scale();
            this.search_no_results = this.container.find('li.no-results').first();
            if (this.is_multiple) {
                this.search_choices = this.container.find('ul.chzn-choices').first();
                this.search_container = this.container.find('li.search-field').first();
            } else {
                this.search_container = this.container.find('div.chzn-search').first();
                this.selected_item = this.container.find('.chzn-single').first();
                sf_width = dd_width - get_side_border_padding(this.search_container) - get_side_border_padding(this.search_field);
                this.search_field.css({
                    "width": sf_width + "px"
                });
            }
            this.results_build();
            this.set_tab_index();
            return this.form_field_jq.trigger("liszt:ready", {
                chosen: this
            });
        };
        Chosen.prototype.register_observers = function () {
            var _this = this;
            this.container.mousedown(function (evt) {
                return _this.container_mousedown(evt);
            });
            this.container.mouseup(function (evt) {
                return _this.container_mouseup(evt);
            });
            this.container.mouseenter(function (evt) {
                return _this.mouse_enter(evt);
            });
            this.container.mouseleave(function (evt) {
                return _this.mouse_leave(evt);
            });
            this.search_results.mouseup(function (evt) {
                return _this.search_results_mouseup(evt);
            });
            this.search_results.mouseover(function (evt) {
                return _this.search_results_mouseover(evt);
            });
            this.search_results.mouseout(function (evt) {
                return _this.search_results_mouseout(evt);
            });
            this.form_field_jq.bind("liszt:updated", function (evt) {
                return _this.results_update_field(evt);
            });
            this.form_field_jq.bind("liszt:activate", function (evt) {
                return _this.activate_field(evt);
            });
            this.form_field_jq.bind("liszt:open", function (evt) {
                return _this.container_mousedown(evt);
            });
            this.search_field.blur(function (evt) {
                return _this.input_blur(evt);
            });
            this.search_field.keyup(function (evt) {
                return _this.keyup_checker(evt);
            });
            this.search_field.keydown(function (evt) {
                return _this.keydown_checker(evt);
            });
            this.search_field.focus(function (evt) {
                return _this.input_focus(evt);
            });
            if (this.is_multiple) {
                return this.search_choices.click(function (evt) {
                    return _this.choices_click(evt);
                });
            } else {
                return this.container.click(function (evt) {
                    return evt.preventDefault();
                });
            }
        };
        Chosen.prototype.search_field_disabled = function () {
            this.is_disabled = this.form_field_jq[0].disabled;
            if (this.is_disabled) {
                this.container.addClass('chzn-disabled');
                this.search_field[0].disabled = true;
                if (!this.is_multiple) {
                    this.selected_item.unbind("focus", this.activate_action);
                }
                return this.close_field();
            } else {
                this.container.removeClass('chzn-disabled');
                this.search_field[0].disabled = false;
                if (!this.is_multiple) {
                    return this.selected_item.bind("focus", this.activate_action);
                }
            }
        };
        Chosen.prototype.container_mousedown = function (evt) {
            var target_closelink;
            if (!this.is_disabled) {
                target_closelink = evt != null ? ($(evt.target)).hasClass("search-choice-close") : false;
                if (evt && evt.type === "mousedown" && !this.results_showing) {
                    evt.preventDefault();
                }
                if (!this.pending_destroy_click && !target_closelink) {
                    if (!this.active_field) {
                        if (this.is_multiple) {
                            this.search_field.val("");
                        }
                        $(document).click(this.click_test_action);
                        this.results_show();
                    } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chzn-single").length)) {
                        evt.preventDefault();
                        this.results_toggle();
                    }
                    return this.activate_field();
                } else {
                    return this.pending_destroy_click = false;
                }
            }
        };
        Chosen.prototype.container_mouseup = function (evt) {
            if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
                return this.results_reset(evt);
            }
        };
        Chosen.prototype.blur_test = function (evt) {
            if (!this.active_field && this.container.hasClass("chzn-container-active")) {
                return this.close_field();
            }
        };
        Chosen.prototype.close_field = function () {
            $(document).unbind("click", this.click_test_action);
            this.active_field = false;
            this.results_hide();
            this.container.removeClass("chzn-container-active");
            this.winnow_results_clear();
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale();
        };
        Chosen.prototype.activate_field = function () {
            this.container.addClass("chzn-container-active");
            this.active_field = true;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus();
        };
        Chosen.prototype.test_active_click = function (evt) {
            if ($(evt.target).parents('#' + this.container_id).length) {
                return this.active_field = true;
            } else {
                return this.close_field();
            }
        };
        Chosen.prototype.results_build = function () {
            var content, data, _i, _len, _ref;
            this.parsing = true;
            this.results_data = root.SelectParser.select_to_array(this.form_field);
            if (this.is_multiple && this.choices > 0) {
                this.search_choices.find("li.search-choice").remove();
                this.choices = 0;
            } else if (!this.is_multiple) {
                this.selected_item.addClass("chzn-default").find("span").text(this.default_text);
                if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
                    this.container.addClass("chzn-container-single-nosearch");
                } else {
                    this.container.removeClass("chzn-container-single-nosearch");
                }
            }
            content = '';
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                data = _ref[_i];
                if (data.group) {
                    content += this.result_add_group(data);
                } else if (!data.empty) {
                    content += this.result_add_option(data);
                    if (data.selected && this.is_multiple) {
                        this.choice_build(data);
                    } else if (data.selected && !this.is_multiple) {
                        this.selected_item.removeClass("chzn-default").find("span").text(data.text);
                        if (this.allow_single_deselect) {
                            this.single_deselect_control_build();
                        }
                    }
                }
            }
            this.search_field_disabled();
            this.show_search_field_default();
            this.search_field_scale();
            this.search_results.html(content);
            return this.parsing = false;
        };
        Chosen.prototype.result_add_group = function (group) {
            if (!group.disabled) {
                group.dom_id = this.container_id + "_g_" + group.array_index;
                return '<li id="' + group.dom_id + '" class="group-result">' + $("<div />").text(group.label).html() + '</li>';
            } else {
                return "";
            }
        };
        Chosen.prototype.result_do_highlight = function (el) {
            var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
            if (el.length) {
                this.result_clear_highlight();
                this.result_highlight = el;
                this.result_highlight.addClass("highlighted");
                maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                visible_top = this.search_results.scrollTop();
                visible_bottom = maxHeight + visible_top;
                high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                high_bottom = high_top + this.result_highlight.outerHeight();
                if (high_bottom >= visible_bottom) {
                    return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                } else if (high_top < visible_top) {
                    return this.search_results.scrollTop(high_top);
                }
            }
        };
        Chosen.prototype.result_clear_highlight = function () {
            if (this.result_highlight) {
                this.result_highlight.removeClass("highlighted");
            }
            return this.result_highlight = null;
        };
        Chosen.prototype.results_show = function () {
            var dd_top;
            if (!this.is_multiple) {
                this.selected_item.addClass("chzn-single-with-drop");
                if (this.result_single_selected) {
                    this.result_do_highlight(this.result_single_selected);
                }
            } else if (this.max_selected_options <= this.choices) {
                this.form_field_jq.trigger("liszt:maxselected", {
                    chosen: this
                });
                return false;
            }
            dd_top = this.is_multiple ? this.container.height() : this.container.height() - 1;
            this.form_field_jq.trigger("liszt:showing_dropdown", {
                chosen: this
            });
            this.dropdown.css({
                "top": dd_top + "px",
                "left": 0
            });
            this.results_showing = true;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            return this.winnow_results();
        };
        Chosen.prototype.results_hide = function () {
            if (!this.is_multiple) {
                this.selected_item.removeClass("chzn-single-with-drop");
            }
            this.result_clear_highlight();
            this.form_field_jq.trigger("liszt:hiding_dropdown", {
                chosen: this
            });
            this.dropdown.css({
                "left": "-9000px"
            });
            return this.results_showing = false;
        };
        Chosen.prototype.set_tab_index = function (el) {
            var ti;
            if (this.form_field_jq.attr("tabindex")) {
                ti = this.form_field_jq.attr("tabindex");
                this.form_field_jq.attr("tabindex", -1);
                return this.search_field.attr("tabindex", ti);
            }
        };
        Chosen.prototype.show_search_field_default = function () {
            if (this.is_multiple && this.choices < 1 && !this.active_field) {
                this.search_field.val(this.default_text);
                return this.search_field.addClass("default");
            } else {
                this.search_field.val("");
                return this.search_field.removeClass("default");
            }
        };
        Chosen.prototype.search_results_mouseup = function (evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target.length) {
                this.result_highlight = target;
                this.result_select(evt);
                return this.search_field.focus();
            }
        };
        Chosen.prototype.search_results_mouseover = function (evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target) {
                return this.result_do_highlight(target);
            }
        };
        Chosen.prototype.search_results_mouseout = function (evt) {
            if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
                return this.result_clear_highlight();
            }
        };
        Chosen.prototype.choices_click = function (evt) {
            evt.preventDefault();
            if (this.active_field && !($(evt.target).hasClass("search-choice" || $(evt.target).parents('.search-choice').first)) && !this.results_showing) {
                return this.results_show();
            }
        };
        Chosen.prototype.choice_build = function (item) {
            var choice_id, html, link, _this = this;
            if (this.is_multiple && this.max_selected_options <= this.choices) {
                this.form_field_jq.trigger("liszt:maxselected", {
                    chosen: this
                });
                return false;
            }
            choice_id = this.container_id + "_c_" + item.array_index;
            this.choices += 1;
            if (item.disabled) {
                html = '<li class="search-choice search-choice-disabled" id="' + choice_id + '"><span>' + item.html + '</span></li>';
            } else {
                html = '<li class="search-choice" id="' + choice_id + '"><span>' + item.html + '</span><a href="javascript:void(0)" class="search-choice-close ss-icon" rel="' + item.array_index + '">delete</a></li>';
            }
            this.search_container.before(html);
            link = $('#' + choice_id).find("a").first();
            return link.click(function (evt) {
                return _this.choice_destroy_link_click(evt);
            });
        };
        Chosen.prototype.choice_destroy_link_click = function (evt) {
            evt.preventDefault();
            if (!this.is_disabled) {
                this.pending_destroy_click = true;
                return this.choice_destroy($(evt.target));
            } else {
                return evt.stopPropagation;
            }
        };
        Chosen.prototype.choice_destroy = function (link) {
            if (this.result_deselect(link.attr("rel"))) {
                this.choices -= 1;
                this.show_search_field_default();
                if (this.is_multiple && this.choices > 0 && this.search_field.val().length < 1) {
                    this.results_hide();
                }
                link.parents('li').first().remove();
                return this.search_field_scale();
            }
        };
        Chosen.prototype.results_reset = function () {
            this.form_field.options[0].selected = true;
            this.selected_item.find("span").text(this.default_text);
            if (!this.is_multiple) {
                this.selected_item.addClass("chzn-default");
            }
            this.show_search_field_default();
            this.results_reset_cleanup();
            this.form_field_jq.trigger("change");
            if (this.active_field) {
                return this.results_hide();
            }
        };
        Chosen.prototype.results_reset_cleanup = function () {
            this.current_value = this.form_field_jq.val();
            return this.selected_item.find("abbr").remove();
        };
        Chosen.prototype.result_select = function (evt) {
            var high, high_id, item, position;
            if (this.result_highlight) {
                high = this.result_highlight;
                high_id = high.attr("id");
                this.result_clear_highlight();
                if (this.is_multiple) {
                    this.result_deactivate(high);
                } else {
                    this.search_results.find(".result-selected").removeClass("result-selected");
                    this.result_single_selected = high;
                    this.selected_item.removeClass("chzn-default");
                }
                high.addClass("result-selected");
                position = high_id.substr(high_id.lastIndexOf("_") + 1);
                item = this.results_data[position];
                item.selected = true;
                this.form_field.options[item.options_index].selected = true;
                if (this.is_multiple) {
                    this.choice_build(item);
                } else {
                    this.selected_item.find("span").first().text(item.text);
                    if (this.allow_single_deselect) {
                        this.single_deselect_control_build();
                    }
                }
                if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
                    this.results_hide();
                }
                this.search_field.val("");
                if (this.is_multiple || this.form_field_jq.val() !== this.current_value) {
                    this.form_field_jq.trigger("change", {
                        'selected': this.form_field.options[item.options_index].value
                    });
                }
                this.current_value = this.form_field_jq.val();
                return this.search_field_scale();
            }
        };
        Chosen.prototype.result_activate = function (el) {
            return el.addClass("active-result");
        };
        Chosen.prototype.result_deactivate = function (el) {
            return el.removeClass("active-result");
        };
        Chosen.prototype.result_deselect = function (pos) {
            var result, result_data;
            result_data = this.results_data[pos];
            if (!this.form_field.options[result_data.options_index].disabled) {
                result_data.selected = false;
                this.form_field.options[result_data.options_index].selected = false;
                result = $("#" + this.container_id + "_o_" + pos);
                result.removeClass("result-selected").addClass("active-result").show();
                this.result_clear_highlight();
                this.winnow_results();
                this.form_field_jq.trigger("change", {
                    deselected: this.form_field.options[result_data.options_index].value
                });
                this.search_field_scale();
                return true;
            } else {
                return false;
            }
        };
        Chosen.prototype.single_deselect_control_build = function () {
            if (this.allow_single_deselect && this.selected_item.find("abbr").length < 1) {
                return this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
            }
        };
        Chosen.prototype.winnow_results = function () {
            var found, option, part, parts, regex, regexAnchor, result, result_id, results, searchText, startpos, text, zregex, _i, _j, _len, _len1, _ref;
            this.no_results_clear();
            results = 0;
            searchText = this.search_field.val() === this.default_text ? "" : $('<div/>').text($.trim(this.search_field.val())).html();
            regexAnchor = this.search_contains ? "" : "^";
            regex = new RegExp(regexAnchor + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
            zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'i');
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                if (!option.disabled && !option.empty) {
                    if (option.group) {
                        $('#' + option.dom_id).css('display', 'none');
                    } else if (!(this.is_multiple && option.selected)) {
                        found = false;
                        result_id = option.dom_id;
                        result = $("#" + result_id);
                        if (regex.test(option.html)) {
                            found = true;
                            results += 1;
                        } else if (this.enable_split_word_search && (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0)) {
                            parts = option.html.replace(/\[|\]/g, "").split(" ");
                            if (parts.length) {
                                for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
                                    part = parts[_j];
                                    if (regex.test(part)) {
                                        found = true;
                                        results += 1;
                                    }
                                }
                            }
                        }
                        if (found) {
                            if (searchText.length) {
                                startpos = option.html.search(zregex);
                                text = option.html.substr(0, startpos + searchText.length) + '</em>' + option.html.substr(startpos + searchText.length);
                                text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
                            } else {
                                text = option.html;
                            }
                            result.html(text);
                            this.result_activate(result);
                            if (option.group_array_index != null) {
                                $("#" + this.results_data[option.group_array_index].dom_id).css('display', 'list-item');
                            }
                        } else {
                            if (this.result_highlight && result_id === this.result_highlight.attr('id')) {
                                this.result_clear_highlight();
                            }
                            this.result_deactivate(result);
                        }
                    }
                }
            }
            if (results < 1 && searchText.length) {
                return this.no_results(searchText);
            } else {
                return this.winnow_results_set_highlight();
            }
        };
        Chosen.prototype.winnow_results_clear = function () {
            var li, lis, _i, _len, _results;
            this.search_field.val("");
            lis = this.search_results.find("li");
            _results = [];
            for (_i = 0, _len = lis.length; _i < _len; _i++) {
                li = lis[_i];
                li = $(li);
                if (li.hasClass("group-result")) {
                    _results.push(li.css('display', 'auto'));
                } else if (!this.is_multiple || !li.hasClass("result-selected")) {
                    _results.push(this.result_activate(li));
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        };
        Chosen.prototype.winnow_results_set_highlight = function () {
            var do_high, selected_results;
            if (!this.result_highlight) {
                selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
                do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
                if (do_high != null) {
                    return this.result_do_highlight(do_high);
                }
            }
        };
        Chosen.prototype.no_results = function (terms) {
            var no_results_html;
            no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
            no_results_html.find("span").first().html(terms);
            return this.search_results.append(no_results_html);
        };
        Chosen.prototype.no_results_clear = function () {
            return this.search_results.find(".no-results").remove();
        };
        Chosen.prototype.keydown_arrow = function () {
            var first_active, next_sib;
            if (!this.result_highlight) {
                first_active = this.search_results.find("li.active-result").first();
                if (first_active) {
                    this.result_do_highlight($(first_active));
                }
            } else if (this.results_showing) {
                next_sib = this.result_highlight.nextAll("li.active-result").first();
                if (next_sib) {
                    this.result_do_highlight(next_sib);
                }
            }
            if (!this.results_showing) {
                return this.results_show();
            }
        };
        Chosen.prototype.keyup_arrow = function () {
            var prev_sibs;
            if (!this.results_showing && !this.is_multiple) {
                return this.results_show();
            } else if (this.result_highlight) {
                prev_sibs = this.result_highlight.prevAll("li.active-result");
                if (prev_sibs.length) {
                    return this.result_do_highlight(prev_sibs.first());
                } else {
                    if (this.choices > 0) {
                        this.results_hide();
                    }
                    return this.result_clear_highlight();
                }
            }
        };
        Chosen.prototype.keydown_backstroke = function () {
            var next_available_destroy;
            if (this.pending_backstroke) {
                this.choice_destroy(this.pending_backstroke.find("a").first());
                return this.clear_backstroke();
            } else {
                next_available_destroy = this.search_container.siblings("li.search-choice").last();
                if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
                    this.pending_backstroke = next_available_destroy;
                    if (this.single_backstroke_delete) {
                        return this.keydown_backstroke();
                    } else {
                        return this.pending_backstroke.addClass("search-choice-focus");
                    }
                }
            }
        };
        Chosen.prototype.clear_backstroke = function () {
            if (this.pending_backstroke) {
                this.pending_backstroke.removeClass("search-choice-focus");
            }
            return this.pending_backstroke = null;
        };
        Chosen.prototype.keydown_checker = function (evt) {
            var stroke, _ref;
            stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
            this.search_field_scale();
            if (stroke !== 8 && this.pending_backstroke) {
                this.clear_backstroke();
            }
            switch (stroke) {
            case 8:
                this.backstroke_length = this.search_field.val().length;
                break;
            case 9:
                if (this.results_showing && !this.is_multiple) {
                    this.result_select(evt);
                }
                this.mouse_on_container = false;
                break;
            case 13:
                evt.preventDefault();
                break;
            case 38:
                evt.preventDefault();
                this.keyup_arrow();
                break;
            case 40:
                this.keydown_arrow();
                break;
            }
        };
        Chosen.prototype.search_field_scale = function () {
            var dd_top, div, h, style, style_block, styles, w, _i, _len;
            if (this.is_multiple) {
                h = 0;
                w = 0;
                style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
                styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
                for (_i = 0, _len = styles.length; _i < _len; _i++) {
                    style = styles[_i];
                    style_block += style + ":" + this.search_field.css(style) + ";";
                }
                div = $('<div />', {
                    'style': style_block
                });
                div.text(this.search_field.val());
                $('body').append(div);
                w = div.width() + 25;
                div.remove();
                if (w > this.f_width - 10) {
                    w = this.f_width - 10;
                }
                this.search_field.css({
                    'width': w + 'px'
                });
                dd_top = this.container.height();
                return this.dropdown.css({
                    "top": dd_top + "px"
                });
            }
        };
        Chosen.prototype.generate_random_id = function () {
            var string;
            string = "sel" + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
            while ($("#" + string).length > 0) {
                string += this.generate_random_char();
            }
            return string;
        };
        return Chosen;
    })(AbstractChosen);
    root.Chosen = Chosen;
    get_side_border_padding = function (elmt) {
        var side_border_padding;
        return side_border_padding = elmt.outerWidth() - elmt.width();
    };
    root.get_side_border_padding = get_side_border_padding;
}).call(this);;
(function () {
    function Royal(selector, sayings) {
        this.elem = selector.nodeType ? selector : document.querySelector(selector)
        this.sayings = (sayings || []).slice(0)
        this._listeners = {}
        return this
    }
    Royal.prototype.run = function (sayings) {
        var el = this.elem
        this.sayings = sayings || this.sayings
        if (this.sayings.length) {
            var saying = this.sayings.shift().split('')
            this.text('')
            this.emit('linestart')
            this.type(saying)
        } else {
            this.stop()
        }
        return this
    }
    Royal.prototype.type = function (saying) {
        var self = this,
            el = this.elem
        if ((typeof saying).toLowerCase() === 'string') {
            saying = saying.split('')
        }
        if (saying.length > 0) {
            this.text(this.text() + saying.shift())
            this.letterTimer = window.setTimeout(function () {
                self.type(saying)
            }, random_number(100, 150))
        } else {
            this.emit('linefinish')
            if (!this.sayings.length) this.emit('finish')
            this.sayingTimer = window.setTimeout(function () {
                self.run()
            }, 1400)
        }
        this.emit('lineenter')
        return this
    }
    Royal.prototype.stop = function (clearSayings) {
        this.sayings = []
        window.clearTimeout(this.letterTimer)
        delete this.letterTimer
        window.clearTimeout(this.sayingTimer)
        delete this.sayingTimer
        return this
    }
    Royal.prototype.text = function (text) {
        var el = this.elem,
            input = (el.nodeName.toLowerCase() === 'input')
            if (text === undefined) {
                return input ? el.value : el.innerHTML
            } else {
                if (input) el.value = text
                else el.innerHTML = text
                return this
            }
    }

    function random_number(min, max) {
        return Math.round(Math.random() * (max - min + 1)) + min
    }
    Royal.prototype.on = function (e, fn) {
        (this._listeners[e] = this._listeners[e] || []).push(fn)
        return this
    }
    Royal.prototype.emit = function (e) {
        var listeners = this._listeners[e],
            args = [].slice.call(arguments, 1)
            if (listeners) {
                for (var i = 0, len = listeners.length; i < len; i += 1) {
                    listeners[i].apply(this, args)
                }
            }
        return this
    }

    function royal(selector, sayings) {
        return new Royal(selector, sayings)
    }
    window.Royal = royal
})();
[].map || (Array.prototype.map = function (a) {
    for (var b = this, c = b.length, d = [], e = 0, f; e < b;) d[e] = e in b ? a.call(arguments[1], b[e], e++, b) : f;
    return d
})
jQuery.extend({
    stringify: function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            var n, v, json = [],
                arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") v = '"' + v + '"';
                    else if (t == "object" && v !== null) v = jQuery.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});
$(function () {
    hljs.initHighlightingOnLoad();
    $('.site-message').addClass('loaded')
    var cart = Cookies.get('cart')
    cart = $.parseJSON(($.trim(cart) === '') ? '{}' : cart)
    var $cart_icon = $('header .cart')
    if (cart.sets && cart.sets.length) {
        $cart_icon.removeClass('is-empty')
        $cart_icon.addClass('is-full')
    }
    $(document).on('blur', 'input[required].error', function () {
        var $field = $(this);
        if ($field.val() != '') {
            $field.removeClass('error');
        }
    });
    if ($('.sticky-footer').length) {
        var $stickyFooter = $('.sticky-footer');
        var stickyFooterHeight = null;
        $(window).load(function () {
            stickyFooterHeight = $stickyFooter.height() + (parseInt($stickyFooter.css('paddingTop')) * 2) + parseInt($stickyFooter.css('marginTop'));
            var windowHeight = $(window).height();
            var bodyHeight = $('body').height();
            if (bodyHeight < windowHeight) {
                $stickyFooter.addClass('is-sticky');
            }
            $(window).on('resize', function () {
                $stickyFooter.removeClass('is-sticky')
                var windowHeight = $(window).height();
                var bodyHeight = $('body').height();
                if (bodyHeight < windowHeight) {
                    $stickyFooter.addClass('is-sticky');
                }
            });
        });
    }
    $(window).resize(function () {
        if ($('.home-typer').length > 0) {
            var height = (window.innerHeight - 288),
                height = (height > 864) ? 864 : (height < 432) ? 432 : height
                $('.home-typer').css('height', height + 'px')
        }
    }).resize();
    if ($('body.view-home').length) {
        var newLocation = false;
        if (getAnchor()) {
            newLocation = window.location.origin + '/icons/' + getAnchor();
        }
        if (getAnchor() == 'social' || getAnchor() == 'symbolicons') {
            newLocation += '-regular';
        }
        if (newLocation) {
            window.location = newLocation;
        }
    }
    if (!Modernizr.inputtypes.range) {
        $('.font-slider').hide();
    }
    var typer = $('.home-typer input')
    typer.one('click', stopTyping)
    typer.on('blur', typerBlur)
    typer.on('focus', typerFocus)
    var sayings = ["Mobile and desktop optimized", "Made for the world web", "Turn text into images with magic", "Look sharp on Retina", "Computer and user friendly", "Download or cloud hosting", "Itâ€™s time to fast forward into the future ", "Edit and try for yourself", "Symbolset loves you"],
        colors = ['#3dbfd9', '#88c800', '#febc06', '#cc6601', '#866cba'],
        length = 0
    if (document.querySelector('.home-typer input')) {
        var typewriter = Royal('.home-typer input', sayings).on('linestart', function () {
            var demo = $('.home-demo');
            var shop = $('.home-shop');
            if (length === colors.length) length = 0;
            demo.css('background', colors[length]);
            shop.css('background', colors[length]);
            length++;
        }).on('lineenter', function () {
            if (typeof ss_legacy == 'function') ss_legacy(typer)
        }).on('finish', function () {
            var demo = $('.home-demo')
            demo.addClass('active')
            setTimeout(function () {
                typewriter.run(sayings.slice(0))
                demo.removeClass('active')
            }, 3200)
        })
        setTimeout(function () {
            typewriter.run()
        }, 1400)
        if (typeof ss_legacy == 'function') {
            typer.keyup(function () {
                ss_legacy(typer);
            })
        }
    }

    function stopTyping() {
        typewriter.stop().text('')
        $(this).click()
    }

    function typerFocus() {
        $('.home-demo label').text('Great! Try typing: cart, user, mail...')
    }

    function typerBlur() {
        $('.home-demo label').text('Click below to type.');
    }
    $('.font-slider input').on('change', updateSlider)

    function updateSlider(slideAmount) {
        var slide_amount = this.value
        $('.home-typer input').css('font-size', slide_amount + 'px')
    }
    $('#paypal-link').on('click', function (e) {
        e.preventDefault()
        if ($('#payment_method').val() == 'stripe') {
            $('#payment_method').val('paypal')
            $(this).text($(this).attr('data-stripe'))
            $('.cc-info').slideUp()
            $('.payment').addClass('paypal')
        } else {
            $('#payment_method').val('stripe')
            $(this).text($(this).attr('data-paypal'))
            $('.cc-info').slideDown()
            $('.payment').removeClass('paypal')
        }
    })
    $('#hosting').on('change', function () {
        var cart = $.parseJSON(Cookies.get('cart'));
        cart.hosting = this.checked
        Cookies.set('cart', $.stringify(cart))
    })
    $('.set-licenses').on('change', function () {
        var $this = $(this);
        var $row = $this.parents('tr');
        var licenses = $this.val();
        var price = $this.find('option[value="' + licenses + '"]').data('price');
        var cart = $.parseJSON(Cookies.get('cart'));
        var set_id = parseInt($this.attr('id').split('_')[0]);
        var in_cart = false
        var $cart_icon = $('header .cart')
        cart.sets.map(function (set) {
            if (set.set_id === set_id) {
                set.license_level = parseInt(licenses)
                in_cart = true
                if (parseInt(licenses) === 0) {
                    if (typeof item != 'undefined') {
                        var i = cart.sets.indexOf(item)
                        cart.sets.splice(i, 1)
                    }
                }
            }
        });
        if (!in_cart) {
            cart.sets.push({
                'set_id': set_id,
                'license_level': parseInt(licenses)
            })
        }
        Cookies.set('cart', $.stringify(cart))
        price = parseFloat(price);
        if (price != 0) {
            $row.removeClass('non-active');
            priceLabel = price;
        } else {
            $row.addClass('non-active');
            priceLabel = parseFloat($this.find('option:nth-child(2)').attr('data-price'));
            for (var i = cart.sets.length - 1; i >= 0; i--) {
                if (cart.sets[i].set_id == set_id) {
                    cart.sets.splice(i, 1);
                }
            }
            Cookies.set('cart', $.stringify(cart))
        }
        if (cart.sets.length) {
            $cart_icon.removeClass('is-empty')
            $cart_icon.addClass('is-full')
        } else {
            $cart_icon.removeClass('is-full')
            $cart_icon.addClass('is-empty')
        }
        if (priceLabel % 1 != 0) priceLabel = priceLabel.toFixed(2)
        $row.find('.set-price').data('price', price).html('$' + priceLabel);
        calculateSetsTotal();
    });

    function calculateSetsTotal() {
        total = 0;
        $('.set-licenses option:selected').each(function () {
            total += parseFloat($(this).data('price'));
        });
        if (total % 1 != 0) total = total.toFixed(2)
        $('.sets-total').data('total', total).html('$' + total);
        if (total != 0 || $('input#hosting').is(':checked')) {
            $('.submit').removeAttr('disabled');
        } else {
            $('.submit').attr('disabled', 'disabled');
        }
    }
    $('input#hosting').on('change', function () {
        var $this = $(this);
        if ($this.is(':checked')) {
            $('label[for="hosting"] b').html('Hosting');
        } else {
            $('label[for="hosting"] b').html('Add hosting')
        }
        calculateSetsTotal();
    });
    $('#checkout').on('submit', function (e) {
        var $button = $('button.submit').attr('disabled', true);
        var formInvalid = false;
        $('input[required]').each(function () {
            var $requiredField = $(this);
            if ($requiredField.val() == '') {
                formInvalid = true;
                $requiredField.addClass('error');
            }
        });
        if (formInvalid) {
            $button.removeAttr('disabled')
            e.preventDefault();
            return
        }
        if ($('#payment_method').val() != 'paypal') {
            if (cardValidation()) {
                Stripe.createToken({
                    number: $('#user-card').val(),
                    cvc: $('#user-cvc').val(),
                    exp_month: $('#user-exp-m').val(),
                    exp_year: $('#user-exp-y').val()
                }, stripeResponseHandler)
            } else {
                $button.removeAttr('disabled')
            }
            e.preventDefault()
        }
    })
    if ($('.set-slideshow.banner .slideshow-wrapper').length) {
        $('.set-slideshow .slideshow-wrapper').each(function () {
            startSlideshow.call(this, 3600)
        })
    }
    if ($('.sets-list .slideshow-wrapper').length) {
        $('.set-slideshow .slideshow-wrapper').mouseover(function () {
            var that = this,
                $images = $(this).find('img[data-src]'),
                images_length = $images.length
                clearInterval(window.slideshowInterval)
                $images.each(function () {
                    var data_src = this.getAttribute('data-src'),
                        regex = new RegExp(data_src, "g")
                        if ( !! !this.src.match(regex)) {
                            this.src = data_src
                            $(this).on('load', function () {
                                images_length--
                            })
                        } else {
                            images_length--
                        }
                })
                when(function () {
                    return (images_length <= 0)
                }, function () {
                    startSlideshow.call(that, 1200)
                }, 2)
        }).mouseout(stopSlideshow)
    }

    function startSlideshow(interval) {
        var colors = $(this).attr('data-colors').split(','),
            i = 1,
            that = this
            window.slideshowInterval = setInterval(function () {
                $(that).children('div').first().fadeOut(750).parents('.set-slideshow').css('background-color', colors[i]).end().next().fadeIn(750).end().appendTo(that)
                i++
                if (i >= colors.length) i = 0
            }, interval)
    }

    function stopSlideshow() {
        clearInterval(window.slideshowInterval)
    }

    function when(conditionFunc, execFunc, interval) {
        if (conditionFunc()) {
            execFunc();
        } else {
            setTimeout(function () {
                when(conditionFunc, execFunc, interval);
            }, interval);
        }
    }
    $('.account-info .form-toggle').on('click', function (e) {
        e.preventDefault()
        $(this).parents('.account-info').find('form').slideToggle()
        $text = $(this).attr('data-text')
        $title = $(this).attr('data-title')
        $(this).attr('data-text', $(this).text()).attr('data-title', $(this).attr('title')).text($text).attr('title', $title)
        $('body').animate({
            scrollTop: $(this).offset().top
        })
    })
    $('.minimize-project, .project-title').on('click', function (e) {
        e.preventDefault()
        var info = $(this).parents('form').find('.project-info')
        if (!info.hasClass('open')) {
            info.addClass('open')
            info.slideDown(function () {
                if (!info.find('.project-sets').hasClass('chzn-done'))
                    info.find('.project-sets').chosen()
            })
        } else {
            info.removeClass('open')
            info.slideUp()
        }
    })
    $('.delete-project').on('click', function (e) {})
    $('.account-projects > a.flip-button').on('click', function (e) {
        if (!$(this).hasClass('buy-hosting')) {
            e.preventDefault()
            $('#new-project').slideDown(function () {
                if (!$(this).find('.project-sets').hasClass('chzn-done'))
                    $(this).find('.project-sets').chosen()
            })
        }
    })
    $('.project-info button').on('click', function (e) {
        e.preventDefault();
        var $form = $(this).parents('form');
        var errors = false;
        if ($form.find('select.project-sets').val() == null) {
            alert('Please select a set for your project');
            $form.find('.chzn-choices').addClass('error')
            errors = true;
        }
        $form.find('input[required]').each(function () {
            if ($(this).val() == '') {
                $(this).addClass('error');
                errors = true;
            }
        });
        if (!errors) {
            $form.submit();
        }
    });
    $('.account-embed').on('click', function (e) {
        $(this).select();
    });
    $('.delete-project').on('click', function (e) {
        e.preventDefault()
        if (window.confirm('Are you sure you want to delete this project? This canâ€™t be undone!')) {
            var $this = $(this),
                project_id = $(this).attr('data-project-id')
                $.ajax({
                    url: '/project/' + project_id + '/delete',
                    type: 'POST'
                }).done(function () {
                    $this.parents('li').remove()
                })
        }
        return false;
    })
    $('.post-content a img, .blog-post a img').parent().addClass('linked-image');
    if ($('body.view-thanks').length) {
        var $tips = $('.thanks-tips');
        $.getJSON('http://symbolset.siteleaf.com/search.json?category=tips&callback=?', function (data) {
            for (var i = data.length - 1; i >= data.length - 3; i--) {
                var body = $(data[i].body);
                var tip = $('<div class="thanks-tip">');
                var title = $('<h2 class="three col"><a href="' + data[i].url + '">' + data[i].title + '</a></h2>');
                var desc = $('<p class="three col">' + body.text().substring(0, 150) + '...</p>');
                tip.append(title);
                tip.append(desc);
                $tips.append(tip);
            };
        });
    }
})

function cardValidation() {
    var card_el = $('#user-card');
    var expm_el = $('#user-exp-m');
    var expy_el = $('#user-exp-y');
    var cvc_el = $('#user-cvc');
    var card = Stripe.validateCardNumber(card_el.val());
    var exp = Stripe.validateExpiry(expm_el.val(), expy_el.val());
    var cvc = Stripe.validateCVC(cvc_el.val());
    if (card && exp && cvc) {
        return true;
    } else {
        if (!card) card_el.addClass('error');
        else cvc_el.removeClass('error'); if (!cvc) cvc_el.addClass('error');
        else card_el.removeClass('error'); if (!exp) {
            expm_el.addClass('error');
            expy_el.addClass('error')
        } else {
            expm_el.removeClass('error');
            expy_el.removeClass('error')
        }
        return false;
    }
}

function stripeResponseHandler(status, response) {
    if (response.error) {
        var err = $('.payment .errors');
        err.text(response.error.message);
        err.css('display', 'block');
        $('button.submit').attr('disabled', false);
    } else {
        var form = document.getElementById('checkout');
        var token = response.id;
        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'stripeToken';
        hidden.value = token;
        form.appendChild(hidden);
        form.submit();
    }
}

function getAnchor() {
    return location.hash.replace('#', '');
}