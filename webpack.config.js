const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@services": path.resolve(__dirname, "src/services"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@routes": path.resolve(__dirname, "src/routes"),
    },
  },
};
