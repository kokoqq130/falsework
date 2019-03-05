/**
 * @Description: 树形结构操作工具
 * @author kokoqq130
 * @date 2019/2/19
*/
export default class TreeIterator {
    /**
     *  遍历整个树形结构，无返回
     */
    static each(data, cb, fieldType = 'children') {
        data.forEach((item, index) => {
            if (item[fieldType] instanceof Array && item[fieldType].length > 0) {
                TreeIterator.each(item.children, cb, fieldType);
            }
            cb(item, index);
        });
    }

    /**
     * 遍历整个树形结构,并返回一个新的树形结构
     * @param data 输入数据
     * @param cb   回调
     * @param fieldType 迭代的字段，默认children
     * @returns {*}
     */
    static map(data, cb, fieldType = 'children') {
        return data.map((item, index) => {
            const itemCopy = JSON.parse(JSON.stringify(item));
            if (item[fieldType] instanceof Array && item[fieldType].length > 0) {
                itemCopy[fieldType] = TreeIterator.map(item.children, cb, fieldType);
            }
            cb(itemCopy, index);
            return itemCopy;
        });
    }

    /**
     *  遍历整个树形结构,返回满足条件数据为数组结构
     */
    static filter(data, cb, fieldType = 'children') {
        let result = [];
        const temp = data.filter((item, index) => {
            if (item[fieldType] instanceof Array && item[fieldType].length > 0) {
                result = result.concat(TreeIterator.filter(item[fieldType], cb, fieldType));
            }
            return cb(item, index);
        });
        return result.concat(temp);
    }

    /**
     *  遍历整个树形结构,返回满足条件数据以及其父节点 的一个数组
     */
    static filterIncludesParents(data, cb, fieldType = 'children') {
        let result = [];
        const temp = data.filter((item, index) => {
            let partResult = false;
            if (item[fieldType] instanceof Array && item[fieldType].length > 0) {
                const childResult = TreeIterator.filterIncludesParents(item[fieldType], cb, fieldType);
                partResult = childResult.length !== 0;
                result = result.concat(childResult);
            }
            return partResult || cb(item, index);
        });
        return result.concat(temp);
    }

    /**
     *  遍历整个树形结构,返回满足条件的树形结构
     */
    static filterAsTree(data, cb, fieldType = 'children') {
        return JSON.parse(JSON.stringify(data)).filter((item, index) => {
            let partResult = false;
            if (item[fieldType] instanceof Array && item[fieldType].length > 0) {
                const childResult = TreeIterator.filterAsTree(item[fieldType], cb, fieldType);
                item[fieldType] = childResult;
                partResult = childResult.length !== 0;
            }
            return partResult || cb(item, index);
        });
    }

    /**
     *  遍历整个树形结构,判断是否有满足条件数组
     */
    static some(data, cb, fieldType = 'children') {
        return data.some((item, index) => {
            let result = false;
            if (item[fieldType] instanceof Array && item[fieldType].length > 0) {
                result = TreeIterator.some(item[fieldType], cb, fieldType) || result;
            }
            return result || cb(item, index);
        });
    }
}
