const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        allowedHosts: 'all'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env) // Ensures process.env is defined
        }),
        new webpack.EnvironmentPlugin({
            FIREBASE_API_KEY: "asdf123",
            FIREBASE_AUTH_DOMAIN: "xyz.firebaseapp.com",
            FIREBASE_PROJECT_ID: "fdfddfa",
            FIREBASE_STORAGE_BUCKET: "something.appspot.com",
            FIREBASE_MESSAGING_SENDER_ID: "123123",
            FIREBASE_APP_ID: "x.firebaseapp.com",
            FIREBASE_MEASUREMENT_ID: "141412431",
            JCP_API_ENDPOINT: "localhost"
        })
    ]
});