import React from 'react';
import ReactDom from 'react-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import App from './pages/App';

/* eslint-disable react/jsx-filename-extension */
ReactDom.render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>,
    document.getElementById('app'));
/* eslint-enable react/jsx-filename-extension */
