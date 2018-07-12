module.exports = (storybookBaseConfig, configType) => {
  const newConfig = {
    ...storybookBaseConfig
  };

  // Add this:
  // Export bundles as libraries so we can access them on page scope.
  newConfig.output.library = "[name]";

  return newConfig;
};
