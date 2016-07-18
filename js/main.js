/**
 * Created by Administrator on 2016/7/15.
 */
(function () {
    var dom = {
        topNav: $('#top-nav'),
        bottomNav: $('#bottom-nav'),
        calalogBtn: $('#catalog-btn'),
        fontBtn: $('#font-btn'),
        themeBtn: $('#theme-btn'),
        fontContainer: $('#font-container'),
        largeFont: $('#large-font'),
        smallFont: $('#small-font'),
        fictionContainer: $('#fiction-container')
    };//常用的dom对象
    var win = $(window);//界面窗口
    var $body = $('body');//文档body
    var colorBtns = $('.bg-container');//背景颜色切换按钮
    var readerUI;
    var initFont, initFontColor, initColorBtn, initBgColor, initTheme, initThemeCn;//界面UI数据

    //一个阅读器常用的类
    var Util = function () {
        this.prefix = 'html5_reader_';
        //localStorageGetter获取
        this.storageGetter = function (key) {
            return localStorage.getItem(this.prefix + key);
        };
        //loclaStorageSetter设置
        this.storageSetter = function (key, val) {
            return localStorage.setItem(this.prefix + key, val);
        };
        //jsonp调用数据
        this.getBSONP = function (url, callback) {
            return $.jsonp({
                url: url,
                cache: true,
                callback: 'duokan_fiction_chapter',
                success: function (result) {
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    callback(json);
                }
            })
        };
    };
    var myUtil = new Util();
    //载入localStorage数据方法
    function loadInitData() {
        initFont = parseInt(myUtil.storageGetter('initFont'));//默认字体
        if (!initFont) {
            initFont = 14;
        }
        initBgColor = myUtil.storageGetter('initBgColor');//默认背景颜色
        if (initBgColor == null) {
            initBgColor = '#e9dfc7';
        }
        initColorBtn = parseInt(myUtil.storageGetter('initColorBtn'));
        if (!initColorBtn) {
            initColorBtn = 1;
        }
        initTheme = myUtil.storageGetter('initTheme');
        if (initTheme == null) {
            initTheme = 'icon-theme-day';
        }
        initThemeCn = myUtil.storageGetter('initThemeCn');
        if (initThemeCn == null) {
            initThemeCn = '白天'
        }
        initFontColor = myUtil.storageGetter('initFontColor');
        if (initFontColor == null) {
            initFontColor = '#555';
        }
    }

    //阅读器界面初始化渲染方法
    function readerRset() {
        dom.themeBtn.removeClass().addClass(initTheme).html('<span></span>' + initThemeCn);//渲染主题
        $(colorBtns[initColorBtn]).find('div').addClass('bg-container-current');//颜色按钮选择渲染
        dom.fictionContainer.css({'font-size': initFont + 'px'});//字体大小渲染
        dom.fictionContainer.css({'color': initFontColor});//渲染字体颜色
        $body.css({'background': initBgColor});//背景渲染
    }

    //实现和阅读器相关的数据交互方法
    function readerModel() {
        var chapter_id;
        var chapterTotal;
        var init = function (UIcallback) {
            getFictionInfo(function () {
                getCurChapterContent(chapter_id, function (data) {
                    UIcallback && UIcallback(data);
                });
            });
        };
        var getFictionInfo = function (callback) {
            $.get('data/chapter.json', function (data) {
                //获得章节信息后的回调
                chapter_id = myUtil.storageGetter('initChapter');
                if (chapter_id == null) {
                    chapter_id = data.chapters[1].chapter_id;
                }
                chapterTotal = 4;
                callback && callback();
            }, 'json');
        };
        var getCurChapterContent = function (chapter_id, callback) {
            $.get('data/data' + chapter_id + '.json', function (data) {
                if (data.result == 0) {
                    var url = data.jsonp;
                    myUtil.getBSONP(url, function (data) {
                        callback && callback(data);
                    });
                }
            }, 'json');
        };
        var prevChapter = function (UIcallback) {
            chapter_id = parseInt(chapter_id, 10);
            chapter_id -= 1;
            if (chapter_id < 1) {
                chapter_id = 1;
                return;
            }
            myUtil.storageSetter('initChapter', chapter_id);
            getCurChapterContent(chapter_id, UIcallback);
        };
        var nextChapter = function (UIcallback) {
            chapter_id = parseInt(chapter_id, 10);
            chapter_id += 1;
            if (chapter_id > chapterTotal) {
                chapter_id = 4;
                return;
            }
            myUtil.storageSetter('initChapter', chapter_id);
            getCurChapterContent(chapter_id, UIcallback);
        };
        //方法接口
        return {
            init: init,
            prevChapter: prevChapter,
            nextChapter: nextChapter
        };
    }

    //渲染基本小说内容方法
    function readerBaseFrame(container) {
        function parseChapterData(jsonData) {
            var jsonObj = JSON.parse(jsonData);
            var html = '<h4>' + jsonObj.t + '</h4>';
            for (var i = 0; i < jsonObj.p.length; i++) {
                html += '<p>' + jsonObj.p[i] + '</p>';
            }
            return html;
        }

        return function (data) {
            container.html(parseChapterData(data));
        }
    }

    //交互的事件绑定方法
    function eventHandler() {
        //点击阅读器中部的时候显示顶部和底部
        $('#action-mid').click(function () {
            if (dom.topNav.css('display') == 'none') {
                dom.bottomNav.show('fast');
                dom.topNav.show('fast');
            } else {
                dom.bottomNav.hide('fast');
                dom.topNav.hide('fast');
                dom.fontContainer.hide();
                dom.fontBtn.removeClass('icon-font-select');
            }
        });
        //滚动条滚动的时候隐藏顶部和底部
        win.scroll(function () {
            dom.bottomNav.hide('fast');
            dom.topNav.hide('fast');
            dom.fontContainer.hide('fast');
        });
        //字体选项点击唤醒字体设置面板
        dom.fontBtn.click(function () {
            if (dom.fontContainer.css('display') == 'none') {
                dom.fontContainer.show();
                dom.fontBtn.addClass('icon-font-select');
            } else {
                dom.fontContainer.hide();
                dom.fontBtn.removeClass('icon-font-select');
            }
        });
        //largeFont按键
        dom.largeFont.click(function () {
            if (initFont >= 20) {
                return;
            }
            initFont += 1;
            myUtil.storageSetter('initFont', initFont);
            dom.fictionContainer.css({'font-size': initFont + 'px'});
        });
        //smallFont按键
        dom.smallFont.click(function () {
            if (initFont <= 12) {
                return;
            }
            initFont -= 1;
            myUtil.storageSetter('initFont', initFont);
            dom.fictionContainer.css({'font-size': initFont + 'px'});
        });
        //主题按键
        dom.themeBtn.click(function () {
            if (dom.themeBtn.hasClass('icon-theme-day')) {
                $('.bg-container').find('div').removeClass();
                $('.night').find('div').addClass('bg-container-current');
                $body.css({'background': '#5B5B5B'});
                dom.fictionContainer.css({'color': '#D9D9D9'});
                dom.themeBtn.removeClass('icon-theme-day').addClass('icon-theme-night').html('<span></span>夜间');
                myUtil.storageSetter('initFontColor', '#D9D9D9');
                myUtil.storageSetter('initBgColor', '#5B5B5B');
                myUtil.storageSetter('initColorBtn', 5);
                myUtil.storageSetter('initTheme', 'icon-theme-night');
                myUtil.storageSetter('initThemeCn', '夜间');
            } else {
                $('.bg-container').find('div').removeClass();
                $('.orange').find('div').addClass('bg-container-current');
                $body.css({'background': '#e9dfc7'});
                dom.fictionContainer.css({'color': '#555'});
                dom.themeBtn.removeClass('icon-theme-night').addClass('icon-theme-day').html('<span></span>白天');
                myUtil.storageSetter('initFontColor', '#555');
                myUtil.storageSetter('initBgColor', '#e9dfc7');
                myUtil.storageSetter('initColorBtn', 0);
                myUtil.storageSetter('initTheme', 'icon-theme-day');
                myUtil.storageSetter('initThemeCn', '白天');
            }
        });
        //为每个背景颜色按钮绑定事件
        for (var i = 0; i < colorBtns.length; i++) {
            (function (i) {
                $(colorBtns[i]).click(function () {
                    var colorClas = this.className.split(' ');//颜色按钮所有的类
                    var color = colorClas[1];//颜色类
                    var $lastSelectColor = $('.bg-container-current').parent();
                    var lastSelectColor = $lastSelectColor.get(0);
                    var colorLastClas = lastSelectColor.className.split(' ');
                    var colorLastCla = colorLastClas[1];
                    switch (color) {
                        case 'orange':
                            $body.css({'background': '#e9dfc7'});
                            dom.fictionContainer.css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#e9dfc7');
                            myUtil.storageSetter('initFontColor', '#555');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'gray':
                            $body.css({'background': '#C5C1AA'});
                            dom.fictionContainer.css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#C5C1AA');
                            myUtil.storageSetter('initFontColor', '#555');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'green':
                            $body.css({'background': '#698B22'});
                            dom.fictionContainer.css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#698B22');
                            myUtil.storageSetter('initFontColor', '#555');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'blue':
                            $body.css({'background': '#53868B'});
                            dom.fictionContainer.css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#53868B');
                            myUtil.storageSetter('initFontColor', '#555');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'yellow':
                            $body.css({'background': '#F0E68C'});
                            dom.fictionContainer.css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#F0E68C');
                            myUtil.storageSetter('initFontColor', '#555');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'night':
                            $body.css({'background': '#5B5B5B'});
                            dom.fictionContainer.css({'color': '#D9D9D9'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#F0E68C');
                            myUtil.storageSetter('initFontColor', '#D9D9D9');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        default:
                            break;
                    }
                    if (i != 5) {
                        dom.themeBtn.removeClass('icon-theme-night').addClass('icon-theme-day').html('<span></span>白天');
                        myUtil.storageSetter('initTheme', 'icon-theme-day');
                        myUtil.storageSetter('initThemeCn', '白天');
                    }
                    else {
                        dom.themeBtn.removeClass('icon-theme-day').addClass('icon-theme-night').html('<span></span>夜间');
                        myUtil.storageSetter('initTheme', 'icon-theme-night');
                        myUtil.storageSetter('initThemeCn', '夜间');
                    }
                });
            })(i);
        }
        //上一章
        $('#prev-button').click(function () {
            readerModel.prevChapter(function (data) {
                readerUI(data)
            });
        });
        //下一章
        $('#next-button').click(function () {
            readerModel.nextChapter(function (data) {
                readerUI(data);
            });
        });
    }

    //整个项目的入口方法
    function main() {
        loadInitData();
        readerRset();
        readerModel = readerModel();
        readerUI = readerBaseFrame(dom.fictionContainer);
        readerModel.init(function (data) {
            readerUI(data);
        });
        eventHandler();
    }

    main();
})();