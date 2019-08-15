import { Locale } from 'vant';

import enUS from 'vant/lib/locale/lang/en-US';
import zhCN from 'vant/lib/locale/lang/zh-CN';
// Locale.use('zh-CN', zhCN); //组件语言切换
let checkoutLang = function(lang){
    if(lang==='en-US'){
        Locale.use('zh-CN', enUS);
    }else if(lang==='zh-CN'){
        Locale.use('zh-CN', zhCN);
    }
}
export default checkoutLang