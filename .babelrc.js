// const getScopedName = require('./config/getScopedName');
// const isDev = process.env.NODE_ENV === 'development';
const isDev = g_envSettings.isDev;

module.exports = {
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties",
        ["react-css-modules", 
            {
                autoResolveMultipleImports: true,
                filetypes: {
                    '.scss': {
                        syntax: 'postcss-scss'
                    }
                },
                generateScopedName: isDev ? '[path]_[name]_[local]' : '[sha1:hash:hex:4]',
                // generateScopedName: isDev ? '[path]_[name]_[local]' : getScopedName,
            }
        ]
    ]
};