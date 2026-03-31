const createConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async (env, argv) => {
  const config = await createConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["unity"],
      },
    },
    argv,
  );
  config.resolve.modules = [
    path.resolve(path.dirname(__dirname), "./node_modules"),
    path.resolve(path.dirname(__dirname), "../node_modules"),
  ];

  return config;
};
