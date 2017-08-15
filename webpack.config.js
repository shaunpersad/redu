const path = require('path');
module.exports = {
    entry: {
        ['github-users']: './examples/github-users/src/app.js',
        ['github-users-substore']: './examples/github-users-substore/src/app.js',
        ['readme-redu']: './examples/readme-redu/src/app.js',
        ['readme-redu-substore']: './examples/readme-redu-substore/src/app.js',
        ['readme-vanilla-react']: './examples/readme-vanilla-react/src/app.js',
    },
    output: {
        filename: './examples/[name]/dist/bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            redu: path.resolve(__dirname, 'redu.js')
        }
    }
};
