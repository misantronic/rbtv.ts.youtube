# rbtv.ts.youtube 

[![Build Status](https://travis-ci.org/misantronic/rbtv.ts.youtube.svg?branch=master)](https://travis-ci.org/misantronic/rbtv.ts.youtube)

## setup

to work on your local machine you need:
- npm
- a redis-db to cache youtube-api-data
- a mongo-db to cache videos
- a youtube-key to access the data-api

## installation

`npm install`

create an-env file: `www/env.js`

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

## run

`npm run dev`
