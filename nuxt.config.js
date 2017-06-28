module.exports = {
    dev: (process.env.NODE_ENV !== 'production'),
    css: ['~assets/css/main.css'],
    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#3B8070' },
    build: {
        loaders: [{
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000, // 1KO
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000, // 1 KO
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    }
};