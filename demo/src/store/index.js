import { init } from '@rematch/core';
import { todos } from '../models/todos';

console.info(todos);

const store = init({
    models: {
        todos,
    },
});

export default store;
