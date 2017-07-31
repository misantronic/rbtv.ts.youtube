export function getStorage(key: string) {
    let item = localStorage.getItem(key);

    try {
        item = JSON.parse(item as string);
    } catch (e) {}

    return item;
}

export function setStorage(key: string, value) {
    try {
        value = JSON.stringify(value);
    } catch (e) {}

    localStorage.setItem(key, value);
}

export function updateStorage(key: string, props: object) {
    const keyValue = getStorage(key) || {};

    setStorage(key, Object.assign(keyValue, props));
}
