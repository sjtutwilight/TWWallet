// 添加一个项到 localStorage
function addItemToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Item added: ${key} = ${value}`);
    } catch (error) {
        console.error('Failed to add item to localStorage:', error);
    }
}

// 查看 localStorage 中的所有项
function viewAllLocalStorageItems() {
    console.log('All localStorage items:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        try {
            console.log(`${key}:`, JSON.parse(value));
        } catch {
            console.log(`${key}:`, value);
        }
    }
}

// 获取指定 key 的值
function getItemFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        console.log(`Item retrieved: ${key} =`, JSON.parse(value));
        return JSON.parse(value);
    } catch (error) {
        console.error(`Failed to retrieve item: ${key}`, error);
        return null;
    }
}

// 删除 localStorage 中的指定项
function removeItemFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        console.log(`Item removed: ${key}`);
    } catch (error) {
        console.error(`Failed to remove item: ${key}`, error);
    }
}

// 清除所有 localStorage 项
function clearAllLocalStorage() {
    try {
        localStorage.clear();
        console.log('All localStorage items have been cleared.');
    } catch (error) {
        console.error('Failed to clear localStorage:', error);
    }
}

// 示例使用
// 添加一个项
// addItemToLocalStorage('user', { name: 'Alice', age: 30 });

// 查看所有项
// viewAllLocalStorageItems();

// 获取指定项
// getItemFromLocalStorage('user');

// 删除一个项
removeItemFromLocalStorage('tokens');