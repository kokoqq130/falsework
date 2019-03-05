import React from 'react';
import View from '@View';
import '../../style/common.css';


class Index extends View {
    render() {
        return (<div>
            主页
            <a href="/test">进入菜单</a>
        </div>);
    }
}

export default Index;
