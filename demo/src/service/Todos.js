import CommonService from './CommonService';

class Todos extends CommonService {
    remove(time) {
        return this.delay(time);
    }
}

export default new Todos();
