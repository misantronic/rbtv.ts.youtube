const { FuseBox, WebIndexPlugin, CSSPlugin } = require('fuse-box');
const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'public/$name.js',
    plugins: [
        WebIndexPlugin({
            template: 'src/index.html'
        }),
        CSSPlugin()
    ]
});

fuse.bundle('app').watch().instructions(`>index.tsx`);
fuse.run();
