import { Remote } from '../util';

class CommonService {
    delay = (time) => {
        return new Promise((resolve) => {
            return setTimeout(() => {
                return resolve();
            }, time);
        });
    };

    test() {
        return Remote.get('www.baidu.com').then((res) => {
            return res;
        });
    }
}

export default CommonService;
