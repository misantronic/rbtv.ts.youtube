const fetch = require('./../fetch');
const cache = require('../cache');

function parseData(data) {
    data.items = data.items.filter(item => item.id.kind !== 'youtube#channel');

    return data;
}

module.exports = function(req, res) {
    const { q, eventType, maxResults = 30, pageToken, channelId, ttl = 60 * 60 * 2 /* 2 hours */ } = req.query;

    var query = {
        q,
        maxResults,
        pageToken,
        channelId,
        part: 'snippet',
        type: 'video',
        order: 'date'
    };

    if (eventType) query.eventType = eventType;

    var config = new fetch.Config({
        response: res,
        endpoint: 'search',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('search', query.channelId, encodeURIComponent(query.q), query.pageToken, query.maxResults, query.eventType),
            ttl
        )
    });

    fetch(config).then(result => fetch.end(res, parseData(result.data)));
};
