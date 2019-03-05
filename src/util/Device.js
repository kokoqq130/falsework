/**
 * @Description: 设备信息方法类
 * @author 王发靖 kokoqq130
 * @date 2019/2/19
*/

import { enquireScreen } from 'enquire-js';


const OS = {
    'iphone os': 'IOS',
    'mac os x': 'OSX',
    android: 'AND',
};

const BROWSERS = {
    msie: 'IE',
    chrome: 'CHR',
    opera: 'OPE',
    firefox: 'FF',
    safari: 'SAF',
    micromessenger: 'WX',
    ucbrowser: 'UC',
    qq: 'QQ',
    baiduboxapp: 'BD',
};

const UA = navigator.userAgent.toLowerCase();

export default class Device {
    /**
     * 获取设备是否PC端
     */
    static isPC() {
        const pick = (pattern) => {
            const match = UA.match(pattern);
            return (match && match.length > 1) ? match[1] : '';
        };
        const ios = pick(/(ipod|iphone|ipad)/);
        const android = /android/.test(UA) && !/like android/.test(UA);
        let mobile = /[^-]mobi/.test(UA);
        if (ios === 'ipod' || ios === 'iphone' || android
            || /blackberry|\bbb\d+/.test(UA)
            || /rim\stablet/.test(UA)
            || /(web|hpw)os/.test(UA)
            || /bada/i.test(UA)) {
            mobile = true;
        }
        return !mobile;
    }

    /*
     * 简单高效判断是否为 IE
     */
    static isIE() {
        return !!window.ActiveXObject || 'ActiveXObject' in window;
    }

    /**
     * 获取IE浏览器版本号
     */
    static ieVer() {
        if (!Device.isPC()) return false;
        // IE11 的判断与IE10以下的不同
        const ie11 = UA.match(/trident.*rv:([\d.]+)\) like gecko/);
        if (ie11) return ie11[1].substr(0, ie11[1].indexOf('.'));
        const browser = navigator.appName;
        if (browser !== 'Microsoft Internet Explorer') return false;
        const browserVer = navigator.appVersion;
        const versionStr = browserVer.match(/MSIE\s.*?;/i)[0].match(/\d{1,2}/i)[0];
        if (versionStr) return parseInt(versionStr, 10);
        return true;
    }

    /**
     * 获取移动设备系统信息。
     * @return Object 移动设备系统名及版本。
     */
    static getOS() {
        const m = UA.match(/(iphone os|android|mac os x).*?([\d._]+)/);
        m[1] = OS[m[1]] || '';
        m[2] = (m[2] || '').replace(/_/g, '.');

        return {
            os: m[1] || 'unknow',
            ver: m[2],
        };
    }

    /**
     * 获取浏览器类别。
     * @return Object 浏览器名及版本号。
     */
    static browserInfo() {
        let m = UA.match(/(msie|firefox|chrome|opera|micromessenger|version).*?([\d.]+)/);
        // IE11 的判断与IE10以下的不同
        const isIE11 = UA.match(/trident.*rv:([\d.]+)\) like gecko/);
        const isWX = UA.indexOf('micromessenger') > -1;
        const isUC = UA.indexOf('ucbrowser') > -1;
        const isQQ = UA.indexOf('qq') > -1;
        const isBaiDu = UA.indexOf('baiduboxapp') > -1;
        if (isIE11) {
            const bak = m[1];
            m[2] = bak;
            m[1] = 'msie';
        }
        if (isWX) {
            m = UA.match(/(micromessenger).*?([\d.]+)/);
        }
        if (isUC) {
            m = UA.match(/(ucbrowser).*?([\d.]+)/);
        }
        if (isQQ) {
            m = UA.match(/(qq).*?([\d.]+)/);
        }
        if (isBaiDu) {
            m = UA.match(/(baiduboxapp).*?([\d._]+)/);
        }
        let ver = (m[2] || '').replace(/_/g, '.');
        ver = ver.substr(0, ver.indexOf('.'));
        return {
            browser: BROWSERS[(m[1] || '').replace(/version/, 'safari')],
            ver,
        };
    }

    /**
     * 获取屏幕宽高
     * @return Object
     */
    static screenBounds() {
        return {
            w: window.screen.width,
            h: window.screen.height,
        };
    }

    /**
     *  查询屏幕是否满足一定尺寸要求
     */
    static enquireScreen(cb, num) {
        const str = num ? `only screen and (max-width: ${num}px)` : null;
        return enquireScreen(cb, str);
    }
}
