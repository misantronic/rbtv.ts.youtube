# rbtv.ts.youtube 

[![Build Status](https://travis-ci.org/misantronic/rbtv.ts.youtube.svg?branch=master)](https://travis-ci.org/misantronic/rbtv.ts.youtube)

## setup

to develop on your local machine you need:
- a [redis-db](https://elements.heroku.com/addons/heroku-redis) to cache youtube-api-data
- a [mongo-db](https://elements.heroku.com/addons/mongolab) to cache videos
- a [youtube-key](https://console.developers.google.com/apis/api/youtube.googleapis.com/overview) to access the data-api

note: both redis- and mongo-db can be completely empty. they're just needed for caching data.

## installation

```js
npm install
```

create `env.js` in the project-root

```js
const REDIS_URL = 'redis://user:pw@server:port';
const MONGOLAB_URI = 'mongodb://user:pw@server:port/path';
const YT_KEY = 'my_generic_youtube_key';

module.exports = {
    REDIS_URL,
    MONGOLAB_URI,
    YT_KEY
};
```

these envirenment-variables will be set in production from heroku.

## run

```js
npm run dev
```

open `http://localhost:5000/`
