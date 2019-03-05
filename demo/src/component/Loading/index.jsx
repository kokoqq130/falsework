import { Spin } from 'antd';
import Style from './index.less';

export default () => {
    return (
        <div>
            <div className={Style.loading} />
            <Spin tip="Loading..." size="large" className={Style.spin} />
        </div>
    );
};
