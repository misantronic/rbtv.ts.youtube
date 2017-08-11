const baseUrl = 'http://localhost:5000';

async function get(url: string, params: object = {}) {
    const query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    let fetchUrl = baseUrl + url;

    if (params) {
        fetchUrl += '?' + query;
    }

    const response = await fetch(fetchUrl);

    return await response.json();
}

export const fetchUtil = {
    get
}
