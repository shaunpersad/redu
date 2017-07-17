const path = require('path');
module.exports = {
    entry: './examples/github-users/src/app.js',
    output: {
        filename: './examples/github-users/dist/bundle.js'
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
