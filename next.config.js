module.exports = {
  target: "serverless",
  future: {
    webpack5: true,
  },
  webpack: (config, { webpack }) => {
    config.node = {
      fs: "empty",
      net: "empty",
      child_process: "empty",
      readline: "empty",
    };
    config.plugins.push(new webpack.IgnorePlugin(/^electron$/));

    return config;
  },
};
