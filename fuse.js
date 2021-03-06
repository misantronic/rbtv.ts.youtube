const fs = require('fs');
const { Sparky, FuseBox, WebIndexPlugin, CSSPlugin, EnvPlugin, QuantumPlugin } = require('fuse-box');

let production = false;

const envData = {
    NODE_ENV: production ? 'production' : 'development',
    YT_KEY: process.env.YT_KEY
};

if (fs.existsSync(__dirname + '/env.js')) {
    const env = require('./env');

    for (var i in env) {
        if (env.hasOwnProperty(i)) {
            envData[i] = env[i];
        }
    }
}

Sparky.task('build', () => {
    // config
    const fuse = FuseBox.init({
        homeDir: 'src',
        output: 'dist/$name.js',
        target: 'browser',
        experimentalFeatures: true,
        cache: !production,
        sourceMaps: !production,
        hash: production,
        plugins: [
            EnvPlugin(envData),
            WebIndexPlugin({
                title: 'rbtv.ts.youtube',
                target: 'index.ejs',
                template: 'src/index.html',
                path: '/'
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

    // vendor
    const vendor = fuse.bundle('vendor').instructions(`~ **/**.{js,ts,tsx} +tslib - [__types__/**/**.d.ts]`);

    // app
    const app = fuse
        .bundle('app')
        .splitConfig({ browser: '/', dest: '/' })
        .split('containers/activities/**', 'activities > containers/activities/index.tsx')
        .split('containers/video/**', 'video > containers/video/index.tsx')
        .split('containers/playlists/**', 'playlists > containers/playlists/index.tsx')
        .split('containers/timetable/**', 'timetable > containers/timetable/index.tsx')
        .instructions(`> [index.tsx] + [containers/**/**.{ts, tsx}]`);

    if (!production) {
        // HMR
        // vendor.hmr();
        // app.hmr().watch();
        vendor.watch();
        app.watch();
    }

    // Run
    fuse.run();
});

Sparky.task('clean', () => Sparky.src('dist/*').clean('dist/'));
Sparky.task('default', ['clean', 'build'], () => {});
Sparky.task('set-production-env', () => (production = true));
Sparky.task('dist', ['clean', 'set-production-env', 'build'], () => {});
