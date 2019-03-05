
import React from 'react';
import {
    HashRouter, BrowserRouter, MemoryRouter, StaticRouter, Switch, Route,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Loading from '../../component/Loading';
import View from '../../core/View';
import { Device } from '../../util';
import '../../style/common.css';
import SiderMenu from '../../component/SiderMenu';
import RouterHome from '../../router/RouterHome';
import Config from '../../../config/config.json';
import Router from '../../router/Router';

const { Header, Content } = Layout;
const {
    menuPosition,
    routeType,
    query,
    projectName,
    userHabit,
    menus,
} = Config;

class Index extends View {
    static propTypes = {
        app: PropTypes.object,
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    };

    static defaultProps = {
        app: {},
        children: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            isIframe: false,
            collapsed: userHabit && window.localStorage.getItem('collapsed') === 'true',
            loading: true,
        };
    }


    componentWillMount() {
        // 判断是否为iframe
        const isIframe = window.self !== window.top;
        this.setState({ isIframe });
        this.handleScreenSize(isIframe);
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

    /**
     * 设置菜单收缩状态
     */
    setMenuCollapsed(iscollapsed) {
        const collapsed = iscollapsed || !this.state.collapsed;
        this.setState({ collapsed });
        window.localStorage.setItem('collapsed', collapsed);
    }

    /**
     * 监控窗口尺寸变化
     */
    handleScreenSize = (isIframe) => {
        if (!isIframe) {
            Device.enquireScreen((bool) => {
                this.setState({
                    isMobile: !!bool,
                    collapsed: true,
                });
            }, 767.99);
            Device.enquireScreen((bool) => {
                this.setState({
                    collapsed: !!bool,
                });
            }, 991.99);
        } else {
            Device.enquireScreen((bool) => {
                this.setState({
                    isMobile: !!bool,
                });
            }, 910.99);
        }
    };


    /**
     * 渲染左侧菜单
     */
    genMenu = () => {
        const menu = menus;
        // const { menu } = this.props.app;
        const { collapsed, isIframe } = this.state;
        return menuPosition === 'left' && menu
            ? (
                <SiderMenu
                    menu={menu}
                    collapsed={collapsed}
                    isMobile={this.state.isMobile}
                    isIframe={isIframe}
                    setMenuCollapsed={() => { this.setMenuCollapsed(); }}
                    {...this.props}
                />
            ) : null;
    };

    /**
     * 判断使用的路由方式
     */
    _getRouteType() {
        switch (routeType) {
            case 'browser':
                return BrowserRouter;
            case 'memory':
                return MemoryRouter;
            case 'static':
                return StaticRouter;
            default:
                return HashRouter;
        }
    }

    render() {
        const RouterType = this._getRouteType();
        const layout = (
            <RouterType>
                <Switch>
                    {RouterHome.getRouters()}
                    <Route render={() => {
                        return (
                            <Layout>
                                <div id="components-layout-demo-custom-trigger">
                                    {this.genMenu()}
                                </div>
                                <div style={{ flex: '1 1 auto' }}>
                                    <Header style={{ background: '#fff', padding: 0 }} />
                                    <Content
                                        style={{
                                            margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
                                        }}
                                    >
                                        {Router.genRouter()}
                                    </Content>
                                </div>
                            </Layout>
                        );
                    }}
                    />
                </Switch>
            </RouterType>
        );
        return (
            <DocumentTitle title={projectName}>
                <ContainerQuery query={query}>
                    {(params) => {
                        return (
                            <div className={classNames(params)}>
                                { this.state.loading ? <Loading /> : layout }
                            </div>
                        );
                    }}
                </ContainerQuery>
            </DocumentTitle>
        );
    }
}

export default Index;
