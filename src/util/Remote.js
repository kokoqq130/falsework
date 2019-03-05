/**
 * @Description: 定义远程访问组件
 * @author kokoqq130
 * @date 2019/2/25
*/

import Axios from 'axios';
import Config from 'config/config.json';
import _forEach from 'lodash.foreach';
import _isEmpty from 'lodash.isempty';
import { Device } from './index';

class Remote {
    constructor() {
        this.axios = Axios.create();
        this.domain = this.genDomainForEnv();
        this.initInterceptors();
        this.sources = [];
        this.CancelToken = Axios.CancelToken;
    }

    /**
     * 初始化全局拦截器
     */
    initInterceptors = () => {
        this.axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                try {
                    return Promise.reject(error.response.data);
                } catch (e) {
                    // 处理超时
                    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') >= 0) {
                        // 覆盖超时信息
                        error.message = '请求超时，请刷新页面';
                    }
                    // 处理取消请求等错误
                    return Promise.reject(error);
                }
            },
        );
    };

    /**
     * 删去已经完成的promise对应的key
     */
    delCancelHandler = (key) => {
        this.sources = this.sources.filter((source) => {
            return source.key !== key;
        });
    };

    /**
     * 生成cancelToken或者超时设置
     */
    genCancelConf = (key) => {
        const config = {};
        const keyType = typeof key;
        // key为string类型并且重复了，则直接返回空对象
        // key为number类型是设置超时，所以重复了不影响请求
        if (keyType === 'string' && !this.checkKey(key)) {
            return config;
        }

        if (keyType === 'string' && key) {
            // 处理取消请求
            const token = new this.CancelToken((c) => {
                this.sources.push({
                    key,
                    cancel: c,
                });
            });
            config.cancelToken = token;
            config.key = key;
        } else if (keyType === 'number') {
            // 处理超时
            config.timeout = key;
        }
        return config;
    };

    /**
     * 通过key来找到token
     */
    findSource = (key) => {
        return this.sources.find((s) => {
            return s.key === key;
        });
    };

    /**
     * 检查key是否重复
     */
    checkKey = (key) => {
        return this.findSource(key) === undefined;
    };

    /**
     * 取消掉请求
     */
    cancel = (key, msg = '用户手动取消') => {
        const source = this.findSource(key);

        if (source) {
            source.cancel(msg);
            this.delCancelHandler(key);
        }
    };

    static METHOD = {
        GET: 'GET',
        POST: 'POST',
        DELETE: 'DELETE',
        PUT: 'PUT',
    };

    /**
     * get请求
     */
    get = (url, data, key) => {
        return this.http(Remote.METHOD.GET, `${this.domain}${url}`, data, 'json', key);
    };

    /**
     * post请求
     */
    post = (url, data, type = 'json', key) => {
        return this.http(Remote.METHOD.POST, `${this.domain}${url}`, data, type, key);
    };

    /**
     * put请求
     */
    put = (url, data, type = 'json', key) => {
        return this.http(Remote.METHOD.PUT, `${this.domain}${url}`, data, type, key);
    };

    /**
     * delete请求,关键字冲突使用delite
     */
    delite = (url, data, type = 'json', key) => {
        return this.http(Remote.METHOD.DELETE, `${this.domain}${url}`, data, type, key);
    };

    /**
     * HTTP 请求远端数据。
     * @return Promise
     */
    http = (method, url, data, type = 'json', key) => {
        if (!url) return null;
        const send = this.axios.request;
        const config = this.getHttpConfig(method, url, data, type, this.genCancelConf(key));
        return new Promise((resolve, reject) => {
            send(config).then((resp) => {
                const respData = resp.data;
                this.delCancelHandler(config.key);
                const code = respData.error === undefined ? respData.code : respData.error;
                switch (code) {
                    case 0:
                    case '0':
                    case 200:
                    case '200':
                        resolve(respData);
                        break;
                    default:
                        reject({
                            error: -1,
                            code: respData.code,
                            reason: respData.msg || '接口错误',
                            data: respData.data || respData.result,
                        });
                }
            }).catch((err) => {
                reject({
                    error: -1,
                    reason: `网络异常或服务器错误: [${err.message}]`,
                });
            });
        });
    };

    /**
     * 获取http请求配置
     */
    getHttpConfig = (method, url, data, type, specificConf) => {
        let sendURL = url;
        const config = Object.assign({}, {
            url: sendURL,
            withCredentials: true,
            method,
        }, specificConf);
        if (method === Remote.METHOD.GET) {
            sendURL += this.genQuery(data);
            config.url = sendURL;
        } else {
            let contentType = '';
            let cfgData = data;
            switch (type) {
                case 'json':
                    contentType = 'application/json';
                    cfgData = JSON.stringify(data || {});
                    break;
                case 'file':
                    contentType = 'multipart/form-data';
                    cfgData = new FormData();
                    _forEach(data, (val, key) => {
                        cfgData.append(key, val);
                    });
                    break;
                case 'formData':
                    contentType = 'application/x-www-form-urlencoded';
                    config.transformRequest = [(requestData) => {
                        let ret = '';
                        let index = 0;
                        _forEach(requestData, (v, k) => {
                            ret += `${index === 0 ? '' : '&'}${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
                            index += 1;
                        });
                        return ret;
                    }];
                    break;
                default:
                    break;
            }
            config.headers = { 'Content-Type': contentType };
            config.data = cfgData;
        }
        return config;
    };

    /**
     * 获取当前所处环境。
     * @return string
     */
    getEnv = () => {
        const domain = window.location.host;
        if (/^.*front_local.*?\..*$/g.test(domain)) {
            return 'dev';
        }
        return 'dev';
    };

    /**
     * 定义生成http query string的方法
     * @param queryData Object query参数
     * @return string query字符串
     */
    genQuery = (queryData) => {
        if (_isEmpty(queryData)) return '';
        let ret = '';
        // 防止IE接口缓存，加上时间戳
        if (Device.isIE()) queryData.timestamp = new Date().getTime();
        _forEach(queryData, (val, key) => {
            ret += `&${key}=${encodeURIComponent(val)}`;
        });
        return ret.replace(/&/, '?');
    };

    /**
     *  依照环境生成域名
     *  @return string
     */
    genDomainForEnv = () => {
        const env = this.getEnv();
        let domain = `${Config.api.protocol}://${Config.api.domain}`;
        console.info(domain);
        domain = env === 'dev' ? `${domain}` : '';
        return domain;
    };
}

const remote = new Remote();
export default {
    get: remote.get,
    post: remote.post,
    put: remote.put,
    delite: remote.delite,
    cancel: remote.cancel,
};
