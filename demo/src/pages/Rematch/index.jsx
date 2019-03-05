import React from 'react';
import View from '@View';
import Search from './Search';
import Table from './Table';


class Index extends View {
    render() {
        return (<div>
            <h1>主页</h1>
            <Search />
            <Table />
        </div>);
    }
}

export default Index;
