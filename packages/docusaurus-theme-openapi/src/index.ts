/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import path from "path";

import type { ConfigureWebpackUtils, Plugin } from "@docusaurus/types";
import type { Configuration as WebpackConfiguration } from "webpack";

export default function docusaurusThemeOpenAPI(): Plugin<void> {
  return {
    name: "docusaurus-theme-openapi",

    getThemePath() {
      return path.join(__dirname, "..", "lib-next", "theme");
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, "..", "src", "theme");
    },

    configureWebpack(
      _config: WebpackConfiguration,
      _isServer: boolean,
      { currentBundler }: ConfigureWebpackUtils
    ) {
      const bundler = currentBundler.instance ?? require("webpack");
      return {
        plugins: [
          new bundler.ProvidePlugin({
            Buffer: [require.resolve("buffer/"), "Buffer"],
            process: require.resolve("process/browser"),
          }),
        ],
        resolve: {
          fallback: {
            buffer: require.resolve("buffer/"),
            process: require.resolve("process/browser"),
          },
        },
      };
    },
  };
}
