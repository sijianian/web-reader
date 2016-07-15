/**
 * Created by Administrator on 2016/7/15.
 */
(function(){
    //创建一个浏览器数据存储的类
    var Util=(function(){
        var prefix='html5_reader_';
        var storageGetter=function(key){
          return localStorage.getItem(prefix+key);
        };
        var storageSetter=function(key,val){
          return localStorage.setItem(prefix+key,val);
        };
    })();
    //整个项目的入口函数
    function main(){

    }
    //实现和阅读器相关的数据交互的方法
    function readerMode(){

    }
    //渲染基本的UI结构
    function readerBaseFrame(){

    }
    //交互的事件绑定
    function eventHandler(){
        
    }
})();