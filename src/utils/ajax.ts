export const baseUrl = location.origin;

function buildQuery(params: {}): string {
    return '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
}

function buildUrl(url: string, params: {} = {}) {
    const query = buildQuery(params);
    let fetchUrl;

    if (url.startsWith('http')) {
        fetchUrl = url;
    } else {
        fetchUrl = baseUrl + url;
    }

    if (params) {
        fetchUrl += query;
    }

    return fetchUrl;
}

async function getFn(url: string, params = {}, headers = {}) {
    const fetchUrl = buildUrl(url, params);

    try {
        const response = await fetch(fetchUrl, { method: 'GET', headers: new Headers(headers) });
        
        try {
            return await response.json();
        } catch (e) {}
    } catch (e) {
        console.warn(e);
    }
}

async function deleteFn(url: string, params = {}, headers = {}) {
    const fetchUrl = buildUrl(url, params);

    try {
        const response = await fetch(fetchUrl, { method: 'DELETE', headers: new Headers(headers) });

        try {
            return await response.json();
        } catch (e) {}
    } catch (e) {
        console.warn(e);
    }
}

async function postFn(url: string, data = {}, params = {}, headers = {}) {
    const fetchUrl = buildUrl(url, params);
    try {
        const response = await fetch(fetchUrl, {
            method: 'POST',
            body: data,
            headers: new Headers(Object.assign(headers, { Accept: 'application/json' }))
        });

        try {
            return await response.json();
        } catch (e) {}
    } catch (e) {
        console.warn(e);
    }
}

async function putFn(url: string, data = {}, params = {}, headers = {}) {
    const fetchUrl = buildUrl(url, params);
    try {
        const response = await fetch(fetchUrl, {
            method: 'PUT',
            body: data,
            headers: new Headers(headers)
        });

        try {
            return await response.json();
        } catch (e) {}
    } catch (e) {
        console.warn(e);
    }
}

export const fetchUtil = {
    get: getFn,
    post: postFn,
    put: putFn,
    delete: deleteFn
};
