import React from 'react';
import View from '@View';
import Deal from './Deal';
import List from './List';
import './style.css';


class Index extends View {
    render() {
        return (<div>
            <h1>主页</h1>
            <List />
            <Deal />
        </div>);
    }
}

export default Index;
