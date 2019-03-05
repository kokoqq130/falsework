/**
 * @Description: 对Ant-design pro的SiderMenu进行重写
 * @author kokoqq130
 * @date 2019/2/19
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { TreeIterator } from '../../util';
import styles from './index.less';
import { projectName } from '../../../config/config.json';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderMenu extends Component {
    static propTypes = {
        location: PropTypes.object,
        menu: PropTypes.array,
        children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        collapsed: PropTypes.bool,
        isMobile: PropTypes.bool,
        isIframe: PropTypes.bool,
        onCollapse: PropTypes.func,
        defaultOpenKeys: PropTypes.array,
    };

    static defaultProps = {
        location: {},
        menu: [],
        children: [],
        collapsed: false,
        isMobile: false,
        isIframe: false,
        onCollapse: () => {},
        defaultOpenKeys: ['components', 'common'],
    };

    constructor(props) {
        super(props);
        this.state = {
            openKeys: [],
            showMenu: true,
        };
    }

    componentWillMount() {
        this.setState({
            openKeys: this.getCurrentOpenKey(),
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            showMenu: !props.isMobile,
        });
    }

    /**
     *  根据路由地址获取获取当前展开菜单keys
     */
    getCurrentOpenKey() {
        const { location: { pathname }, menu } = this.props;
        return TreeIterator.filterIncludesParents(menu, (item) => {
            return item.path === pathname;
        }).map((m) => {
            return m.key || m.path;
        });
    }

    /**
     *  根据路由地址获取获取当前选中菜单key
     */
    getSelectedMenuKeys = () => {
        const { location: { pathname }, menu } = this.props;
        const tree = TreeIterator.filter(menu, (item) => {
            return item.path === pathname;
        });
        return tree.map((m) => {
            return m.key || m.path;
        });
    };

    /**
     * 计算菜单宽度
     */
    getMenuWidth = () => {
        const { isIframe } = this.props;
        const { showMenu } = this.state;
        if (!isIframe) {
            return 256;
        }
        if (isIframe && showMenu) {
            return 190;
        }
        return 0;
    };

    /**
     * 生成菜单
     */
    getNavMenuItems(menusData) {
        const pathname = this.props.location.pathname || '/';
        if (!menusData) {
            return [];
        }
        return menusData.map((item) => {
            if (!item.name) {
                return null;
            }
            let itemPath;
            if (item.path && item.path.indexOf('http') === 0) {
                itemPath = item.path;
            } else {
                itemPath = `/${item.path || ''}`.replace(/\/+/g, '/');
            }
            if (item.children && item.children.some((child) => { return child.name; })) {
                return item.hideInMenu ? null
                    : (
                        <SubMenu
                            title={
                                item.icon ? (
                                    <span className="menu-item">
                                        <Icon type={item.icon} />
                                        <span>{item.name}</span>
                                    </span>
                                ) : item.name
                            }
                            key={item.key || item.path}
                        >
                            {this.getNavMenuItems(item.children)}
                        </SubMenu>
                    );
            }
            const icon = item.icon && <Icon type={item.icon} />;
            return item.hideInMenu ? null
                : (
                    <Menu.Item key={item.key || item.path} className="menu-item">
                        {
                            /^https?:\/\//.test(itemPath) ? (
                                <a href={itemPath} target={item.target}>
                                    {icon}
                                    <span>{item.name}</span>
                                </a>
                            ) : (
                                <Link
                                    to={itemPath}
                                    target={item.target}
                                    replace={itemPath === pathname}
                                    onClick={this.props.isMobile ? () => { this.props.onCollapse(true); } : null}
                                >
                                    {icon}
                                    <span>{item.name}</span>
                                </Link>
                            )
                        }
                    </Menu.Item>
                );
        });
    }

    /**
     * 菜单展开控制
     */
    handleOpenChange = (openKeys) => {
        const { menu = [] } = this.props;
        const lastOpenKey = openKeys[openKeys.length - 1];
        const openKey = TreeIterator.filterIncludesParents(menu, (item) => {
            return (item.key || item.path) === lastOpenKey;
        }).map((m) => {
            return m.key || m.path;
        });
        this.setState({
            openKeys: openKey,
        });
    };

    /**
     *  菜单顶部logo和标题
     */
    genLogo = () => {
        const { isIframe } = this.props;
        return (
            <div className={!isIframe ? styles.slidermenu_logo : styles.slidermenu_title}>
                <a href="/">
                    {!isIframe ? <img src="../../../static/img/logo.png" alt="logo" /> : null}
                    <h1>{projectName}</h1>
                </a>
            </div>
        );
    };

    /**
     * iframe下的折叠按钮
     */
    genCollapseToggle = () => {
        const { showMenu } = this.state;
        const { isIframe } = this.props;
        if (!isIframe) {
            return null;
        }
        return (
            <div
                className={styles.slidermenu_collapsed}
                onClick={() => {
                    this.setState({
                        showMenu: !showMenu,
                    });
                }}
            >
                <div className={styles.slidermenu_collapsed_inner}>
                    <div className={styles.slidermenu_collapsed_bg} />
                    <div className={styles.slidermenu_collapsed_navbar}>
                        <Icon
                            className={styles.slidermenu_collapsed_icon}
                            style={{ fontSize: 15 }}
                            type={!showMenu ? 'menu-unfold' : 'menu-fold'}
                        />
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const {
            collapsed, isIframe, menu, defaultOpenKeys,
        } = this.props;
        const menuProps = collapsed ? {} : {
            openKeys: this.state.openKeys,
        };
        return (
            <Sider
                theme="light"
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="md"
                width={this.getMenuWidth()}
                className={!isIframe ? styles.slidermenu_sider : `${styles.slidermenu_sider} light-them-slider`}
            >
                {this.genLogo()}
                <div style={{ height: 'calc(100% - 104px)', marginTop: 40, borderRight: '1px solid #e8e8e8' }}>
                    <Menu
                        defaultOpenKeys={defaultOpenKeys}
                        // theme={!isIframe ? 'dark' : 'light'}
                        mode="inline"
                        {...menuProps}
                        onOpenChange={this.handleOpenChange}
                        selectedKeys={this.getSelectedMenuKeys()}
                        style={{ width: '100%' }}
                    >
                        {this.getNavMenuItems(menu)}
                    </Menu>
                    {this.genCollapseToggle()}
                </div>
            </Sider>
        );
    }
}
