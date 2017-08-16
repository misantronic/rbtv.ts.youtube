const fs = require('fs');
const request = require('request');
const sharp = require('sharp');

async function download(uri, dest) {
    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(dest);

        stream.on('finish', resolve).on('error', reject);

        request(uri).pipe(stream);
    });
}

async function readImage(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (e, data) => {
            if (e) {
                resolve(null);
            }

            resolve(data);
        });
    });
}

async function readImageMetadata(path) {
    return sharp(path).metadata();
}

async function clipImage(path, dest, { left, top, width, height }) {
    return new Promise(resolve => {
        sharp(path).extract({ left, top, width, height }).toFile(dest, resolve);
    });
}

async function deleteImage(path) {
    return new Promise(resolve => {
        fs.unlink(path, resolve);
    });
}

module.exports = async function(req, res) {
    const { url, name, small } = req.query;
    const filepath = `.images/${name}`;
    const prefix = '_'; //small ? '_small-' : '_';
    const dest = `.images/${prefix}${name}`;

    let buffer = await readImage(dest);

    if (buffer) {
        res.end(buffer);
    } else {
        await download(url, filepath);

        const { width } = await readImageMetadata(filepath);
        let height, top;

        switch (width) {
            case 480:
                top = 45;
                height = 270;
                break;
            case 640:
                top = 60;
                height = 360;
                break;
        }

        await clipImage(filepath, dest, { left: 0, top, width, height });
        await deleteImage(filepath);
        buffer = await readImage(dest);

        res.end(buffer);
    }
};
