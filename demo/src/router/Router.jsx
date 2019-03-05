/**
 * @Description: 定义路由组件
 * @author kokoqq130
 * @date 2019/2/18
*/

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import Exception from '../component/Exception';
import Loading from '../component/Loading';
import { openPaths, menus } from '../../config/config.json';
import { TreeIterator } from '../util';
import RouteConfig from './RouterConfig';


export default class RouterGenerator {
    static genRouter() {
        const routers = RouterGenerator.getRouters(RouteConfig);
        return (
            <Switch>
                {
                    routers.map((route) => {
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                component={route.main}
                            />
                        );
                    })
                }
                <Route component={Exception} />
            </Switch>
        );
    }

    static routers = null;

    static openPaths = openPaths;

    /**
     *  设置菜单白名单
     * @param path
     */
    static setOpenPaths(path) {
        if (!path) {
            return;
        }
        if (typeof path === 'string') {
            RouterGenerator.paths.push(path);
        } else if (path instanceof Array) {
            RouterGenerator.paths = RouterGenerator.paths.concat(path);
        }
    }

    /**
     *  校验权限
     * @param path
     * @returns {boolean}
     */
    static validatePermission(path) {
        // 可以访问的菜单
        const menu = menus;
        if (RouterGenerator.openPaths.includes(path)) {
            return true;
        }
        const targetMenu = TreeIterator.filter(menu, (item) => {
            return item.path === path;
        });
        return targetMenu.length > 0;
    }

    /**
     *  获取路由
     * @param routerConf
     * @returns {boolean}
     */
    static getRouters(routerConf) {
        if (!RouterGenerator.routers) {
            RouterGenerator.routers = routerConf.map((router) => {
                return {
                    path: router.path,
                    exact: router.exact,
                    main: Loadable({
                        loader: () => { return router.page() || Loading; },
                        loading: (props) => {
                            if (props.error) {
                                window.console.error(props.error);
                            }
                            return <Loading />;
                        },
                        render(loaded, props) {
                            const Component = loaded.default;
                            const flag = RouterGenerator.validatePermission(router.path);
                            return flag ? <Component {...props} /> : <Exception type="403" />;
                        },
                    }),
                };
            });
        }
        return RouterGenerator.routers;
    }
}
