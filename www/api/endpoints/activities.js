var fetch = require('../fetch');
var cache = require('../cache');
var _ = require('lodash');

module.exports = async function(req, res) {
    var query = {
        part: 'snippet,contentDetails,id',
        maxResults: 30,
        channelId: req.query.channelId,
        pageToken: req.query.pageToken
    };

    var config = new fetch.Config({
        response: res,
        endpoint: 'activities',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('activities', query.channelId, query.pageToken, query.maxResults),
            60 * 15 // 5 mins
        )
    });

    const result = await fetch(config);
    
    result.data.items = result.data.items.filter(item => item.snippet.type === 'upload');

    fetch.end(res, result.data);
};
