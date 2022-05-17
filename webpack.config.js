
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  // entry: path.resolve(__dirname, "src/index.js"),
  entry:"./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js",
    clean: true,
  },
  /* đoạn code sau sẽ load các gói babel vào webpack */
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
        
      },
      {
        test: /\.css$/,
        use: [
          
            "css-loader", // 2. Turns css into commonjs
            // "style-loader"

        
        ],
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-url-loader',
          options: {
            limit: 10000,
          },
        },
      ],
    },
      
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // template: path.join(__dirname, "public", "index.html"),
      template:"./public/index.html"
    }),
  //   new webpack.ProvidePlugin({
  //     "React": "react",
  //  }),
  ],
 
};