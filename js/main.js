/**
 * Created by Administrator on 2016/7/15.
 */
(function () {
    //创建一个浏览器数据存储的类,并且已经执行
    var Util = function () {
        this.prefix = 'html5_reader_';
        this.storageGetter = function (key) {
            return localStorage.getItem(this.prefix + key);
        };
        this.storageSetter = function (key, val) {
            return localStorage.setItem(this.prefix + key, val);
        };
    };
    var myUtil = new Util();
    //常用的dom对象
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
    };
    var win = $(window);
    var doc = $(document);
    var colorBtns = $('.bg-container');
    //存储在localStorage中的数据
    var initFont = parseInt(myUtil.storageGetter('initFont'));//默认字体
    if (!initFont) {
        initFont = 14;
    }
    var initBgColor = myUtil.storageGetter('initBgColor');//默认背景颜色
    if (initBgColor == null) {
        initBgColor = '#e9dfc7';
    }
    var initColotBtn = parseInt(myUtil.storageGetter('initColorBtn'));
    if (!initColotBtn) {
        initColotBtn = 1;
    }
    var initTheme = myUtil.storageGetter('theme');
    if (initTheme == null) {
        initTheme = 'icon-theme-day';
    }
    var initThemeCn=myUtil.storageGetter('themeCn');
    if(initThemeCn==null){
        initThemeCn='白天'
    }
    var initFontColor=myUtil.storageGetter('fontColor');
    if(initFontColor==null){
        initFontColor='#555';
    }
    //阅读器初始化渲染
    dom.fictionContainer.css({'font-size': initFont + 'px'});//字体大小渲染
    $('body').css({'background': initBgColor});//背景渲染
    $(colorBtns[initColotBtn]).find('div').addClass('bg-container-current');//颜色按钮选择渲染
    $('#fiction-container').css({'color':initFontColor});//渲染字体颜色
    dom.themeBtn.removeClass().addClass(initTheme).html('<span></span>'+initThemeCn);//渲染主题
    //整个项目的入口函数
    function main() {
        eventHandler();
    }

    //实现和阅读器相关的数据交互的方法
    function readerMode() {

    }

    //渲染基本的UI结构
    function readerBaseFrame() {

    }

    //交互的事件绑定
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
                $('body').css({'background': '#5B5B5B'});
                $('#fiction-container').css({'color': '#D9D9D9'});
                dom.themeBtn.removeClass('icon-theme-day').addClass('icon-theme-night').html('<span></span>夜间');
                myUtil.storageSetter('initBgColor', '#5B5B5B');
                myUtil.storageSetter('theme', 'icon-theme-night');
                myUtil.storageSetter('fontColor', '#D9D9D9');
                myUtil.storageSetter('themeCn','夜间');
            } else {
                $('body').css({'background': initBgColor});
                $('#fiction-container').css({'color': '#555'});
                dom.themeBtn.removeClass('icon-theme-night').addClass('icon-theme-day').html('<span></span>白天');
                myUtil.storageSetter('initBgColor', '#e9dfc7');
                myUtil.storageSetter('theme', 'icon-theme-day');
                myUtil.storageSetter('fontColor', '#555');
                myUtil.storageSetter('themeCn','白天');
            }
        });
        //为每个背景颜色按钮绑定事件
        for (var i = 0; i < colorBtns.length; i++) {
            (function (i) {
                $(colorBtns[i]).click(function () {
                    var colorClas = this.className.split(' ');
                    var color = colorClas[1];
                    var $lastSelectColor = $('.bg-container-current').parent();
                    var lastSelectColor = $lastSelectColor.get(0);
                    var colorLastClas = lastSelectColor.className.split(' ');
                    var colorLastCla = colorLastClas[1];
                    switch (color) {
                        case 'orange':
                            $('body').css({'background': '#e9dfc7'});
                            $('#fiction-container').css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#e9dfc7');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'gray':
                            $('body').css({'background': '#C5C1AA'});
                            $('#fiction-container').css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#C5C1AA');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'green':
                            $('body').css({'background': '#698B22'});
                            $('#fiction-container').css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#698B22');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'blue':
                            $('body').css({'background': '#53868B'});
                            $('#fiction-container').css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#53868B');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        case 'yellow':
                            $('body').css({'background': '#F0E68C'});
                            $('#fiction-container').css({'color': '#555'});
                            $(this).find('div').addClass('bg-container-current');
                            if (colorLastCla != color) {
                                $lastSelectColor.find('div').removeClass('bg-container-current');
                            }
                            myUtil.storageSetter('initBgColor', '#F0E68C');
                            myUtil.storageSetter('initColorBtn', i);
                            break;
                        default:
                            break;
                    }
                });
            })(i);
        }
    }

    main();
})();