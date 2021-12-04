/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import path from "path";

import { DEFAULT_PLUGIN_ID } from "@docusaurus/core/lib/constants";
import {
  LoadContext,
  Plugin,
  RouteConfig,
  ConfigureWebpackUtils,
} from "@docusaurus/types";
import { normalizeUrl, docuHash } from "@docusaurus/utils";
import fs from "fs-extra";
import { Configuration } from "webpack";

import { createMD } from "./markdown";
import { loadOpenapi } from "./openapi";
import { PluginOptions, LoadedContent, ApiSection } from "./types";

export default function pluginOpenAPI(
  context: LoadContext,
  options: PluginOptions
): Plugin<LoadedContent | null> {
  const { baseUrl, generatedFilesDir } = context;

  const pluginId = options.id ?? DEFAULT_PLUGIN_ID;

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    "docusaurus-plugin-openapi"
  );
  const dataDir = path.join(pluginDataDirRoot, pluginId);
  // TODO
  // const aliasedSource = (source: string) =>
  //   `~api/${posixPath(path.relative(pluginDataDirRoot, source))}`;

  const contentPath = path.resolve(context.siteDir, options.path);

  return {
    name: "docusaurus-plugin-openapi",

    getPathsToWatch() {
      return [contentPath];
    },

    async loadContent() {
      const { routeBasePath } = options;

      if (!contentPath || !fs.existsSync(contentPath)) {
        return null;
      }

      const openapiData = await loadOpenapi(
        contentPath,
        baseUrl,
        routeBasePath
      );

      // TODO
      // versionPath: string;
      // mainDocId: string;
      // docs: DocMetadata[];
      // sidebars: Sidebars;
      // versionName: VersionName; // 1.0.0
      // versionLabel: string; // Version 1.0.0
      // versionPath: string; // /baseUrl/docs/1.0.0
      // tagsPath: string;
      // versionEditUrl?: string | undefined;
      // versionEditUrlLocalized?: string | undefined;
      // versionBanner: VersionBanner | null;
      // versionBadge: boolean;
      // versionClassName: string;
      // isLast: boolean;
      // sidebarFilePath: string | false | undefined; // versioned_sidebars/1.0.0.json
      // routePriority: number | undefined; // -1 for the latest docs
      // contentPath: string;
      // contentPathLocalized: string;

      return { openapiData };
    },

    async contentLoaded({ content, actions }) {
      if (!content || Object.keys(content.openapiData).length === 0) {
        return;
      }

      const openapiData = content.openapiData as ApiSection[];
      const { routeBasePath, apiLayoutComponent, apiItemComponent } = options;
      const { addRoute, createData } = actions;

      const sidebar = openapiData.map((category) => {
        return {
          type: "category",
          label: category.title,
          collapsible: true,
          collapsed: true,
          items: category.items.map((item) => {
            return {
              href: item.permalink,
              label: item.summary,
              type: "link",
              className: item.deprecated
                ? "menu__list-item--deprecated"
                : undefined,
            };
          }),
        };
      });

      const promises = openapiData
        .map((section) => {
          return section.items.map(async (item) => {
            const pageId = `site-${routeBasePath}-${item.hashId}`;
            const openapiDataPath = await createData(
              `${docuHash(pageId)}.json`,
              JSON.stringify(item)
            );

            const markdown = await createData(
              `${docuHash(pageId)}-description.mdx`,
              createMD(item)
            );
            return {
              path: item.permalink,
              component: apiItemComponent,
              exact: true,
              modules: {
                openapi: openapiDataPath,
                content: markdown,
              },
            };
          });
        })
        .flat();

      const routes = (await Promise.all(promises)) as RouteConfig[];

      const permalinkToSidebar = routes.reduce(
        (acc: { [key: string]: string }, item) => {
          acc[item.path] = "sidebar";
          return acc;
        },
        {}
      );

      // Important: the layout component should not end with /,
      // as it conflicts with the home doc
      // Workaround fix for https://github.com/facebook/docusaurus/issues/2917
      const apiBaseRoute = normalizeUrl([baseUrl, routeBasePath]);
      const basePath = apiBaseRoute === "/" ? "" : apiBaseRoute;

      const docsBaseMetadataPath = await createData(
        `${docuHash(normalizeUrl([apiBaseRoute, ":route"]))}.json`,
        JSON.stringify(
          {
            docsSidebars: {
              sidebar: sidebar,
            },
            permalinkToSidebar: permalinkToSidebar,
          },
          null,
          2
        )
      );

      addRoute({
        path: basePath,
        exact: false, // allow matching /docs/* as well
        component: apiLayoutComponent, // main docs component (DocPage)
        routes, // subroute for each doc
        modules: {
          docsMetadata: docsBaseMetadataPath,
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

      const wp: Configuration = {
        resolve: {
          alias: {
            "~api": dataDir,
          },
        },
        module: {
          rules: [
            {
              test: /(\.mdx?)$/,
              include: [dataDir],
              use: compact([
                getJSLoader({ isServer }),
                {
                  loader: require.resolve("@docusaurus/mdx-loader"),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    beforeDefaultRehypePlugins,
                    beforeDefaultRemarkPlugins,
                  },
                },
              ]),
            },
          ],
        },
      };

      return wp;
    },
  };
}

function compact<T>(elems: (T | null)[]): T[] {
  return elems.filter((t) => !!t) as T[];
}

export { validateOptions } from "./options";
