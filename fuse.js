const express = require('express');
const path = require('path');
const { Sparky, FuseBox, WebIndexPlugin, CSSPlugin, EnvPlugin, QuantumPlugin } = require('fuse-box');

let production = false;

Sparky.task('build', () => {
    // config
    const fuse = FuseBox.init({
        homeDir: 'src',
        output: 'dist/static/$name.js',
        target: 'browser',
        experimentalFeatures: true,
        cache: !production,
        sourceMaps: !production,
        hash: production,
        plugins: [
            EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
            WebIndexPlugin({
                title: 'rbtv.ts.youtube',
                template: 'src/index.html',
                path: '/static/'
            }),
            CSSPlugin(),
            production &&
                QuantumPlugin({
                    treeshake: true,
                    removeExportsInterop: false,
                    uglify: true,
                    api: core => {
                        core.solveComputed('moment/moment.js');
                    }
                })
        ]
    });

    //if (!production) {
    // server
    fuse.dev({ root: false }, server => {
        const dist = path.join(__dirname, 'dist');
        const app = server.httpServer.app;

        app.use('/static/', express.static(path.join(dist, 'static')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(dist, 'static/index.html'));
        });
    });
    //}

    // vendor
    const vendor = fuse.bundle('vendor').instructions(`~ **/**.{ts,tsx} +tslib - [@types/**/**.d.ts]`);

    // app
    const app = fuse
        .bundle('app')
        .splitConfig({ browser: '/static/', dest: 'bundles/' })
        .split('containers/activities/**', 'activities > containers/activities/index.tsx')
        .split('containers/video/**', 'video > containers/video/index.tsx')
        .instructions(`> [index.tsx] + [containers/**/**.{ts, tsx}]`);

    if (!production) {
        // HMR
        vendor.hmr();
        app.hmr().watch();
    }

    // Run
    fuse.run();
});

Sparky.task('clean', () => Sparky.src('dist/*').clean('dist/'));
Sparky.task('default', ['clean', 'build'], () => {});
Sparky.task('set-production-env', () => (production = true));
Sparky.task('dist', ['clean', 'set-production-env', 'build'], () => {});
