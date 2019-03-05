export default [{
    path: '/test',
    exact: true,
    page: () => { return import('../pages/BasicInfo'); },
}, {
    path: '/rematch',
    exact: true,
    page: () => { return import('../pages/Rematch'); },
}];
