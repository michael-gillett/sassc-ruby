var webpack = require('webpack');
var update = require('react-addons-update');
var path = require('path');
var _ = require('underscore');


var defaultConfig = {
  entry: {
    goLinksUi: path.resolve('./app/assets/javascripts/reactMain')
  },
  output: {
    path: require('path').resolve('./app/assets/javascripts'),
    filename: '[name].bundle.js',
    publicPath: '/assets'
  },
  resolve: {
    root: [__dirname + '/app/assets/javascripts/', __dirname + '/app/assets/images/', __dirname + '/app/assets/stylesheets/'],
    extensions: ['', '.js', '.jsx', '.hamljs']
  },
  resolveLoader: {
    root: __dirname + '/node_modules'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets:['react', 'es2015']
        }
      },
      {
        test: /\.svg?$/,
        loader: 'lr-svg-inline',
        query: {removeSVGTagAttrs: false, idPrefix: true},
        include: [path.resolve('./node_modules/liveramp-ui-toolkit/images/')]
      },
      {
        test: /\.png?$/,
        loader: 'file-loader',
        query: {name: '/[name]-[sha256:hash:hex:64].[ext]', emitFile: false}
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      _: 'underscore',
      React: 'react',
      ReactDOM: 'react-dom',
      update: 'react-addons-update',
      Redux: 'redux',
      ReactRedux: 'react-redux',
      ReactBootstrap: 'react-bootstrap',
      classNames: 'classnames'
    })
  ],
  scripts: {
    'start': 'node server.js'
  },
  info: {
    dashboard: false
  }
};


var devConfig = update(defaultConfig, {
  entry: {
    react: {
      $set: [
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/only-dev-server',
        path.resolve('./app/assets/javascripts/reactMain')
      ]
    },
  },
  output: {
    $merge: {
      publicPath: 'http://localhost:8080/assets',
      sourceMapFilename: "bundle.js.map",
      devtoolModuleFilenameTemplate: '[resourcePath]',
      devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]',
      pathinfo: true
    }
  },
  devtool: {
    $set: '#cheap-module-eval-source-map'
  },
  module: {
    loaders: {
      $unshift: [
        {
          test: /\.jsx?$/,
          loader: 'react-hot',
          exclude: /node_modules/,
          include: [
            path.resolve('./app/assets/javascripts/actions'),
            path.resolve('./app/assets/javascripts/components'),
            path.resolve('./app/assets/javascripts/constants'),
            path.resolve('./app/assets/javascripts/containers'),
            path.resolve('./app/assets/javascripts/reducers'),
          ]
        }
      ]
    }
  },
  plugins: {
    $push: [
      new webpack.HotModuleReplacementPlugin()
    ],
    $push: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    ]
  }
});

var prodConfig = update(defaultConfig, {
  plugins: {
    $push: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    ]
  }
});

// Kind of hacky, but we need to be able to see this variable through the
// 'npm start DEV_MODE' command and this seems to be the simplest way.
var devMode = _.contains(process.argv, 'DEV_MODE');
var dashboard = _.contains(process.argv, 'DASHBOARD');

var currConfig = devMode ? devConfig : prodConfig;

if (dashboard) {
  var Dashboard = require('webpack-dashboard');
  var DashboardPlugin = require('webpack-dashboard/plugin');
  var dashboard = new Dashboard();

  currConfig = update(currConfig, {
    plugins: {
      $push: [
        new DashboardPlugin(dashboard.setData)
      ]
    },
    info: {
      $set: {
        dashboard: true
      }
    }
  });
}

module.exports = currConfig;
