
    var browser={
         versions:function(){
          var u = navigator.userAgent,
           app = navigator.appVersion;
          var obj = {
        
           trident: u.indexOf('Trident') > -1, //IE内核
        
           presto: u.indexOf('Presto') > -1, //opera内核
        
           webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        
           gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        
           ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        
           android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        
           isWin: (navigator.platform == "Win32") || (navigator.platform == "Windows"),
           isMac: (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"),
          };
         return {
             core: function(){
                 if(obj.trident){
                     return 'trident'
                 }else if(obj.presto){
                     return 'presto'
                 }else if(obj.webKit){
                     return 'webKit'
                 }else if(obj.gecko){
                     return 'gecko'
                 }else{
                     return '其他'
                 }
             }(),
             iosOrAndroid:  function(){
                 if(obj.ios){
                     return 'ios'
                 }else if(obj.android){
                     return 'android'
                 }else{
                     return '其他'
                 }
             }(),
             system:function(){
                 if(obj.isWin){
                     return 'Win'
                 }else if(obj.isMac){
                     return 'Mac'
                 }else{
                     return '其他'
                 }
             }(),
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                language:(navigator.browserLanguage || navigator.language).toLowerCase()
         }
         }(),
        }
    var data = {
        device: JSON.stringify(browser.versions),
        lang: browser.versions.language,
        referer_url: null,
        access_url: null,
        good_id: null
    }
    export default data