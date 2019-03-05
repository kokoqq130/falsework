import Todos from '../service/Todos';

console.info(Todos);

export const todos = {
    state: {
        1516344826871: { text: 'do stuff', done: true },
        1516344852231: { text: 'do other stuff', done: false },
    },
    reducers: {
        add(state, text) {
            return {
                ...state,
                [Date.now()]: { text, done: false },
            };
        },
        remove(state, id) {
            delete state[id];
            return {
                ...state,
            };
        },
    },
    effects: {
        async asyncRemove(id) {
            await Todos.remove(1000);
            this.remove(id);
        },
    },
};
