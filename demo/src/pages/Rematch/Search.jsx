import React from 'react';
import View from '@View';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class Search extends View {
    render() {
        return (<Form layout="inline">
            <FormItem
                label="查询列表"
            >
                <Input />
            </FormItem>
            <FormItem>
                <Button type="primary">搜索</Button>
            </FormItem>
        </Form>);
    }
}

export default Search;
