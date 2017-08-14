const fetch = require('./../fetch');
const cache = require('../cache');

function parseData(data) {
    data.items = data.items.filter(item => item.id.kind !== 'youtube#channel');

    return data;
}

module.exports = function(req, res) {
    const { q, maxResults = 30, pageToken, channelId, ttl = 60 * 60 * 2 /* 2 hours */ } = req.query;

    var query = {
        part: 'snippet',
        maxResults,
        type: 'video',
        order: 'date',
        q,
        pageToken,
        channelId
    };

    var config = new fetch.Config({
        response: res,
        endpoint: 'search',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('search', query.channelId, encodeURIComponent(query.q), query.pageToken, query.maxResults),
            ttl
        )
    });

    fetch(config).then(result => fetch.end(res, parseData(result.data)));
};
