import React from 'react';
import View from '@View';
import { func, array } from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';

class List extends View {
    static propTypes = {
        remove: func,
        asyncRemove: func,
        todosArray: array,
    };

    static defaultProps = {
        remove: () => {},
        asyncRemove: () => {},
        todosArray: [],
    };

    render() {
        const { todosArray, remove, asyncRemove } = this.props;
        return (<div>
            <ul className="list">
                {
                    todosArray.map((item) => {
                        return <li key={item.id}>
                            <span className="listInfo">{item.text}</span>
                            <Button
                                className="removeList"
                                onClick={() => {
                                    remove(item.id);
                                }}
                            >删除</Button>
                            <Button
                                className="removeList"
                                onClick={() => {
                                    asyncRemove(item.id);
                                }}
                            >异步删除</Button>
                        </li>;
                    })
                }
            </ul>
        </div>);
    }
}

const mapState = (state) => {
    console.info(state);
    console.info(state.todos);
    const todosIds = Object.keys(state.todos);
    console.info(todosIds);
    return {
        totalTodos: todosIds.length,
        todosArray: todosIds.map((id) => {
            return {
                ...state.todos[id],
                id,
            };
        }),
    };
};

const mapDispatch = (dispatch) => {
    return {
        remove: (id) => {
            return dispatch.todos.remove(id);
        },
        asyncRemove: (id) => {
            return dispatch.todos.asyncRemove(id);
        },
    };
};

export default connect(mapState, mapDispatch)(List);
