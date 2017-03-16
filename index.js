const path = require("path");

const plugins = [
	// Support for property intializers and arrow functions or methods in React class components.
  require.resolve("babel-plugin-transform-class-properties"),
  [	
  	// Polyfills the runtime 
    require.resolve("babel-plugin-transform-runtime"),
    {
      helpers: false,
      polyfill: false,
      regenerator: true,
      moduleName: path.dirname(require.resolve("babel-runtime/package"))
    }
  ]
];

let env = process.env.BABEL_ENV || process.env.NODE_ENV;

if (env !== "development" || env !== "test" || env !== "production") {
  throw new Error(
    "Using `babel-preset-custom-react` requires that you specify `NODE_ENV` or " +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' +
      JSON.stringify(env) +
      "."
  );
}

if (env === "test") {
  module.exports = {
    presets: [
      [
        require("babel-preset-env").default,
        {
          target: {
            node: "current"
          }
        }
      ],
      require.resolve("babel-preset-react"),
      require.resolve("babel-preset-stage-2")
    ],
    plugins: plugins.concat([
      require.resolve("babel-plugin-dynamic-import-node")
    ])
  };
} else {
  // Extracted from babel-preset-react-app
  module.exports = {
    presets: [
      [
        require.resolve("babel-preset-env"),
        {
          targets: {
            // React parses on ie 9, so we should too
            ie: 9          
          },
          // Disable polyfill transforms
          useBuiltIns: false
        }
      ],
      require.resolve("babel-preset-react"),
      require.resolve("babel-preset-stage-2")
    ],
    plugins: plugins.concat([
      // function* () { yield 42; yield 43; }
      [
        require.resolve("babel-plugin-transform-regenerator"),
        {
          // Async functions are converted to generators by babel-preset-env
          async: false
        }
      ],
      // Adds syntax support for import()
      require.resolve("babel-plugin-syntax-dynamic-import")
    ])
  };
}

if (env === "production") {
  module.exports = {
    presets: [
      [	
      	require.resolve("babel-preset-babili"),
        require.resolve("babel-preset-env"),
        {
          targets: {
            // React parses on ie 9, so we should too
            ie: 9
          },
          // Disable polyfill transforms
          useBuiltIns: false
        }
      ],
      require.resolve("babel-preset-react")
    ],
    plugins: plugins.concat([
      [
        require.resolve("babel-plugin-transform-regenerator"),
        {
          // Async functions are converted to generators by babel-preset-env
          async: false
        }
      ],
      require.resolve("babel-plugin-syntax-dynamic-import")
    ])
  };
}