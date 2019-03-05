import React from 'react';
import View from '@View';
import Search from './Search';
import Deal from './Deal';
import List from './List';


class Index extends View {
    render() {
        return (<div>
            <h1>主页</h1>
            <Search />
            <List />
            <Deal />
        </div>);
    }
}

export default Index;
