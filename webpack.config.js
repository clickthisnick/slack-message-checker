module.exports = {
    entry: './src/index.js',
    target: 'web',
    output: {
        path: './build',
        filename: 'bundle.js',
        libraryTarget: 'var',
        library: 'EntryPoint'
    },
    module: {
        loaders: [
            {
                test: /\.node$/,
                loader: 'node-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
