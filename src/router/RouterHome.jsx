import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../component/Loading';

export default class RouterHome {
    static getRouters() {
        return (
            <Route
                exact
                path="/"
                component={Loadable({
                    loader: () => { return import('../pages/Index'); },
                    loading: Loading,
                })}
            />
        );
    }
}
