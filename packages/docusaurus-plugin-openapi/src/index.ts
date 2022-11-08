/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import path from "path";

import type {
  LoadContext,
  Plugin,
  RouteConfig,
  ConfigureWebpackUtils,
} from "@docusaurus/types";
import {
  DEFAULT_PLUGIN_ID,
  normalizeUrl,
  docuHash,
  addTrailingPathSeparator,
  posixPath,
  aliasedSitePath,
  Globby,
} from "@docusaurus/utils";
import chalk from "chalk";
import fs from "fs-extra";
import { Configuration } from "webpack";

import { DocEnv, processDocMetadata } from "./docs/docs";
import { createApiPageMD, createInfoPageMD } from "./markdown";
import { readOpenapiFiles, processOpenapiFiles } from "./openapi";
import { generateSidebar } from "./sidebars";
import type { PluginOptions, LoadedContent, MdxPageMetadata } from "./types";
import { isURL } from "./util";

export default function pluginOpenAPI(
  context: LoadContext,
  options: PluginOptions
): Plugin<LoadedContent> {
  const { baseUrl, generatedFilesDir, siteDir } = context;

  const pluginId = options.id ?? DEFAULT_PLUGIN_ID;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    "docusaurus-plugin-openapi"
  );

  const dataDir = path.join(pluginDataDirRoot, pluginId);

  const aliasedSource = (source: string) =>
    `~api/${posixPath(path.relative(pluginDataDirRoot, source))}`;

  const contentPath = isURL(options.path)
    ? options.path
    : path.resolve(context.siteDir, options.path);

  return {
    name: "docusaurus-plugin-openapi",

    getPathsToWatch() {
      if (isURL(contentPath)) return [];
      return [contentPath];
    },

    async loadContent() {
      const { routeBasePath } = options;

      async function toMetadata(
        /** E.g. "api/plugins/myDoc.mdx" */
        relativeSource: string
      ): Promise<MdxPageMetadata> {
        const source = path.join(contentPath, relativeSource);
        const content = await fs.readFile(source, "utf-8");

        return {
          type: "mdx",
          ...(await processDocMetadata({
            docFile: {
              contentPath: contentPath,
              filePath: source,
              source: relativeSource,
              content: content,
            },
            relativeSource: relativeSource,
            context: context,
            options: options,
            env: process.env.NODE_ENV as DocEnv,
          })),
        };
      }

      try {
        const openapiFiles = await readOpenapiFiles(contentPath, {});
        const loadedApi = await processOpenapiFiles(openapiFiles, {
          baseUrl,
          routeBasePath,
          siteDir: context.siteDir,
        });

        const pagesFiles: string[] = [];
        if (
          !contentPath.endsWith(".json") &&
          !contentPath.endsWith(".yaml") &&
          !contentPath.endsWith(".yml")
        ) {
          pagesFiles.push(
            ...(await Globby(["**/*.{md,mdx}"], {
              cwd: contentPath,
              // ignore: options.exclude, // TODO
            }))
          );
        }

        loadedApi.push(...(await Promise.all(pagesFiles.map(toMetadata))));

        return { loadedApi };
      } catch (e) {
        console.error(chalk.red(`Loading of api failed for "${contentPath}"`));
        throw e;
      }
    },

    async contentLoaded({ content, actions }) {
      const { loadedApi } = content;
      const {
        routeBasePath,
        apiLayoutComponent,
        apiItemComponent,
        sidebarCollapsed,
        sidebarCollapsible,
      } = options;
      const { addRoute, createData } = actions;

      const sidebarName = `openapi-sidebar-${pluginId}`;

      const sidebar = await generateSidebar(loadedApi, {
        contentPath,
        sidebarCollapsible,
        sidebarCollapsed,
      });

      const promises = loadedApi.map(async (item) => {
        const pageId = `site-${routeBasePath}-${item.id}`;

        if (item.type === "api" || item.type === "info") {
          await createData(
            `${docuHash(pageId)}.json`,
            JSON.stringify(item, null, 2)
          );

          // TODO: "-content" should be inside hash to prevent name too long errors.
          const markdown = await createData(
            `${docuHash(pageId)}-content.mdx`,
            item.type === "api" ? createApiPageMD(item) : createInfoPageMD(item)
          );
          return {
            path: item.permalink,
            component: apiItemComponent,
            exact: true,
            modules: {
              content: markdown,
            },
            sidebar: sidebarName,
          };
        } else {
          await createData(
            // Note that this created data path must be in sync with
            // metadataPath provided to mdx-loader.
            `${docuHash(item.source)}.json`,
            JSON.stringify(item, null, 2)
          );

          return {
            path: item.permalink,
            component: "@theme/MarkdownItem", // "@theme/DocItem"
            exact: true,
            modules: {
              content: item.source,
            },
            sidebar: sidebarName,
          };
        }
      });

      // Important: the layout component should not end with /,
      // as it conflicts with the home doc
      // Workaround fix for https://github.com/facebook/docusaurus/issues/2917
      const apiBaseRoute = normalizeUrl([baseUrl, routeBasePath]);
      const basePath = apiBaseRoute === "/" ? "" : apiBaseRoute;

      // Generates a new root route using the first api item.
      async function rootRoute() {
        const item = loadedApi[0];
        const pageId = `site-${routeBasePath}-${item.id}`;

        return {
          path: basePath,
          component: apiItemComponent,
          exact: true,
          modules: {
            // TODO: "-content" should be inside hash to prevent name too long errors.
            content: path.join(dataDir, `${docuHash(pageId)}-content.mdx`),
          },
          sidebar: sidebarName,
        };
      }

      // Whether we already have a document whose permalink falls on the root route.
      const hasRootRoute = (await Promise.all(promises)).find(
        (d) => normalizeUrl([d.path, "/"]) === normalizeUrl([basePath, "/"])
      );

      const routes = (await Promise.all([
        ...promises,
        ...(hasRootRoute ? [] : [rootRoute()]),
      ])) as RouteConfig[];

      const apiBaseMetadataPath = await createData(
        `${docuHash(`api-metadata-prop`)}.json`,
        JSON.stringify(
          {
            apiSidebars: {
              [sidebarName]: sidebar,
            },
          },
          null,
          2
        )
      );

      addRoute({
        path: basePath,
        exact: false, // allow matching /api/* as well
        component: apiLayoutComponent, // main api component (ApiPage)
        routes, // subroute for each api
        modules: {
          apiMetadata: aliasedSource(apiBaseMetadataPath),
        },
      });

      return;
    },

    configureWebpack(
      _config: Configuration,
      isServer: boolean,
      { getJSLoader }: ConfigureWebpackUtils
    ) {
      const {
        rehypePlugins,
        remarkPlugins,
        beforeDefaultRehypePlugins,
        beforeDefaultRemarkPlugins,
      } = options;

      return {
        resolve: {
          alias: {
            "~api": pluginDataDirRoot,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [dataDir, contentPath].map(addTrailingPathSeparator),
              use: [
                getJSLoader({ isServer }),
                {
                  loader: require.resolve("@docusaurus/mdx-loader"),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    beforeDefaultRehypePlugins,
                    beforeDefaultRemarkPlugins,
                    // Docusaurus 2.2.0 has a regression that requires this option to be set.
                    markdownConfig: {},
                    metadataPath: (mdxPath: string) => {
                      if (mdxPath.startsWith(dataDir)) {
                        // The MDX file already lives in `dataDir`: this is an OpenAPI MDX
                        return mdxPath.replace(/(-content\.mdx?)$/, ".json");
                      } else {
                        // Standard resolution
                        const aliasedSource = aliasedSitePath(mdxPath, siteDir);
                        return path.join(
                          dataDir,
                          `${docuHash(aliasedSource)}.json`
                        );
                      }
                    },
                  },
                },
              ].filter(Boolean),
            },
          ],
        },
      };
    },
  };
}

export { validateOptions } from "./options";
