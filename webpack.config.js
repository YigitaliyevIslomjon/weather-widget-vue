const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
// ✅ .env faylni avval o'qish uchun
require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production'

// ✅ .env fayl o'qilgandan keyin o'qiladi
const API_BASE_URL = process.env.API_BASE_URL
const API_WEATHER_KEY = process.env.API_WEATHER_KEY 

module.exports = {
  mode: isProd ? 'production' : 'development',
  
  entry: './src/main.ts',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'weather-widget.js',
    library: {
      name: 'WeatherWidget',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    clean: true
  },
  
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  module: {
    rules: [
      // Vue files - with custom element support
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          customElement: true
        }
      },
      
      // TypeScript files
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      },
      
       // Images - WebP, PNG, JPG, SVG
       {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]'
        }
      },

      // SCSS files
      {
        test: /\.scss$/,
        oneOf: [
          // Vue SFC styles - use vue-style-loader for Shadow DOM
          {
            resourceQuery: /\?vue/,
            use: [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ]
          },
          // Regular SCSS files
          {
            use: [
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
          }
        ]
      },
      
      // CSS files
      {
        test: /\.css$/,
        oneOf: [
          // Vue SFC styles
          {
            resourceQuery: /\?vue/,
            use: [
              'vue-style-loader',
              'css-loader'
            ]
          },
          // Regular CSS files
          {
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
      }
    ]
  },
  
  plugins: [
    new VueLoaderPlugin(),
    
    // ✅ Dotenv plugin - .env faylni o'qiydi
    // defaults: false - avtomatik DefinePlugin yaratmasligi uchun
    new Dotenv({
      path: './.env',
      safe: false,
      systemvars: true,
      silent: false,
      defaults: false // ✅ Avtomatik DefinePlugin yaratmasligi uchun
    }),
    
    // ✅ DefinePlugin - barcha o'zgaruvchilar va Vue flags
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify(API_BASE_URL),
      'process.env.API_WEATHER_KEY': JSON.stringify(API_WEATHER_KEY),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }),
    
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    
    // Note: Not using MiniCssExtractPlugin because custom elements use Shadow DOM
    // Styles are injected inline via style-loader
  ],
  
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProd
          }
        }
      })
    ]
  },
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    hot: true,
    port: 8080,
    open: true,
    historyApiFallback: true
  },
  
  devtool: isProd ? false : 'eval-source-map',
  
  performance: {
    hints: false
  }
}


