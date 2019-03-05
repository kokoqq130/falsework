import React from 'react';
import { func } from 'prop-types';
import View from '@View';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;
class Deal extends View {
    static propTypes = {
        addTodo: func,
    };

    static defaultProps = {
        addTodo: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    handleClick = () => {
        const { addTodo } = this.props;
        const { text } = this.state;
        addTodo(text);
        this.setState({
            text: '',
        });
    };

    render() {
        const { text = '' } = this.state;
        return (<Form layout="inline">
            <FormItem>
                <Input
                    value={text}
                    onChange={(e) => {
                        this.setState({
                            text: e.target.value,
                        });
                    }}
                />
            </FormItem>
            <FormItem>
                <Button
                    onClick={this.handleClick}
                >新增一行</Button>
            </FormItem>
        </Form>);
    }
}

const mapDispatch = (dispatch) => {
    return {
        addTodo: dispatch.todos.add,
    };
};

export default connect(null, mapDispatch)(Deal);
