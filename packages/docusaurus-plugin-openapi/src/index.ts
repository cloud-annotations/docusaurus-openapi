/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import path from "path";

import {
  LoadContext,
  Plugin,
  RouteConfig,
  ConfigureWebpackUtils,
} from "@docusaurus/types";
import {
  normalizeUrl,
  docuHash,
  addTrailingPathSeparator,
  posixPath,
} from "@docusaurus/utils";
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

  const pluginDataDirRoot = path.join(
    generatedFilesDir,
    "docusaurus-plugin-openapi"
  );

  const aliasedSource = (source: string) =>
    `~api/${posixPath(path.relative(pluginDataDirRoot, source))}`;

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

      // TODO: This should be unique so it doesn't clash with other sidebar keys for react render
      const SIDEBAR_NAME = "openapi-sidebar";

      const sidebar = openapiData.map((category) => {
        return {
          type: "category",
          label: category.title,
          collapsible: options.sidebarCollapsible,
          collapsed: options.sidebarCollapsed,
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

            await createData(
              `${docuHash(pageId)}.json`,
              JSON.stringify(
                {
                  unversionedId: item.hashId,
                  id: item.hashId,
                  isDocsHomePage: false, // TODO: Where does this come from?
                  title: item.summary,
                  description: item.description,
                  // source: "@site/docs/tutorial-basics/congratulations.md",
                  // sourceDirName: "tutorial-basics",
                  slug: "/" + item.hashId, // TODO: Should this really be prepended with "/"?
                  permalink: item.permalink,
                  frontMatter: {},
                  sidebar: SIDEBAR_NAME,
                  previous: item.previous,
                  next: item.next,
                  api: item,
                },
                null,
                2
              )
            );

            // TODO: "-content" should be inside hash to prevent name too long errors.
            const markdown = await createData(
              `${docuHash(pageId)}-content.mdx`,
              createMD(item)
            );
            return {
              path: item.permalink,
              component: apiItemComponent,
              exact: true,
              modules: {
                content: markdown,
              },
              sidebar: SIDEBAR_NAME,
            };
          });
        })
        .flat();

      const routes = (await Promise.all(promises)) as RouteConfig[];

      // Important: the layout component should not end with /,
      // as it conflicts with the home doc
      // Workaround fix for https://github.com/facebook/docusaurus/issues/2917
      const apiBaseRoute = normalizeUrl([baseUrl, routeBasePath]);
      const basePath = apiBaseRoute === "/" ? "" : apiBaseRoute;

      const apiBaseMetadataPath = await createData(
        `${docuHash(`api-metadata-prop`)}.json`,
        JSON.stringify(
          {
            apiSidebars: {
              [SIDEBAR_NAME]: sidebar,
            },
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
              include: [pluginDataDirRoot].map(addTrailingPathSeparator),
              use: [
                getJSLoader({ isServer }),
                {
                  loader: require.resolve("@docusaurus/mdx-loader"),
                  options: {
                    remarkPlugins,
                    rehypePlugins,
                    beforeDefaultRehypePlugins,
                    beforeDefaultRemarkPlugins,
                    metadataPath: (mdxPath: string) => {
                      return mdxPath.replace(/(-content\.mdx?)$/, ".json");
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
