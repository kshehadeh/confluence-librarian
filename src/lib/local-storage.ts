

export function storeKeyValue(key: string, value: Array<unknown> | Record<string, unknown>) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getKeyValue(key: string) {
    const jsonValue = localStorage.getItem(key);

    try {
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Error parsing JSON", e);
        return null;
    }
}
