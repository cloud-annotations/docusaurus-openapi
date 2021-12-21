/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import path from "path";

import {
  CategoryMetadataFile,
  CategoryMetadataFilenameBase,
} from "@docusaurus/plugin-content-docs/lib/sidebars/generator";
import { validateCategoryMetadataFile } from "@docusaurus/plugin-content-docs/lib/sidebars/validation";
import { posixPath } from "@docusaurus/utils";
import chalk from "chalk";
import clsx from "clsx";
import fs from "fs-extra";
import Yaml from "js-yaml";
import { groupBy } from "lodash";

import type { PropSidebar, PropSidebarItemCategory } from "../types";
import { ApiPageMetadata } from "../types";

interface Options {
  contentPath: string;
  sidebarCollapsible: boolean;
  sidebarCollapsed: boolean;
}

export type BaseItem = {
  title: string;
  permalink: string;
  id: string;
  source: string;
  sourceDirName: string;
};

export type InfoItem = BaseItem & {
  type: "info";
};

export type ApiItem = BaseItem & {
  type: "api";
  api: {
    info?: {
      title?: string;
    };
    tags?: string[] | undefined;
  };
};

type Item = InfoItem | ApiItem;

function isApiItem(item: Item): item is ApiItem {
  return item.type === "api";
}

function isInfoItem(item: Item): item is InfoItem {
  return item.type === "info";
}

const Terminator = "."; // a file or folder can never be "."
const BreadcrumbSeparator = "/";
function getBreadcrumbs(dir: string) {
  if (dir === Terminator) {
    // this isn't actually needed, but removing would result in an array: [".", "."]
    return [Terminator];
  }
  return [...dir.split(BreadcrumbSeparator).filter(Boolean), Terminator];
}

export async function generateSidebars(
  items: Item[],
  options: Options
): Promise<PropSidebar> {
  const sourceGroups = groupBy(items, (item) => item.source);

  let res: PropSidebar = [];
  let current = res;
  for (const items of Object.values(sourceGroups)) {
    if (items.length === 0) {
      // Since the groups are created based on the items, there should never be a length of zero.
      console.warn(chalk.yellow(`Unnexpected empty group!`));
      continue;
    }

    const { sourceDirName, source } = items[0];

    const breadcrumbs = getBreadcrumbs(sourceDirName);

    let crumbs = [];
    for (const crumb of breadcrumbs) {
      crumbs.push(crumb);
      if (crumb === Terminator) {
        const title = items.filter(isApiItem)[0]?.api.info?.title;
        const fileName = path.basename(source, path.extname(source));
        // Title could be an empty string so `??` won't work here.
        const label = !title ? fileName : title;
        current.push({
          type: "category" as const,
          label,
          collapsible: options.sidebarCollapsible,
          collapsed: options.sidebarCollapsed,
          items: groupByTags(items, options),
        });
        current = res;
        break;
      }

      const categoryPath = path.join(options.contentPath, ...crumbs);
      const meta = await readCategoryMetadataFile(categoryPath);
      const label = meta?.label ?? crumb;

      let tmp = current
        .filter((c): c is PropSidebarItemCategory => c.type === "category")
        .find((c) => c.label === label);
      if (!tmp) {
        tmp = {
          type: "category" as const,
          label,
          collapsible: options.sidebarCollapsible,
          collapsed: options.sidebarCollapsed,
          items: [],
        };
        current.push(tmp);
      }
      current = tmp.items;
    }
  }

  // The first group should always be a category, but check for type narrowing
  if (res.length === 1 && res[0].type === "category") {
    return res[0].items;
  }

  return res;
}

/**
 * Takes a flat list of pages and groups them into categories based on there tags.
 */
function groupByTags(
  items: Item[],
  { sidebarCollapsible, sidebarCollapsed }: Options
): PropSidebar {
  const intros = items.filter(isInfoItem).map((item) => {
    return {
      type: "link" as const,
      label: item.title,
      href: item.permalink,
      docId: item.id,
    };
  });

  const tags = [
    ...new Set(
      items
        .flatMap((item) => {
          if (isInfoItem(item)) {
            return undefined;
          }
          return item.api.tags;
        })
        .filter(Boolean) as string[]
    ),
  ];

  const tagged = tags
    .map((tag) => {
      return {
        type: "category" as const,
        label: tag,
        collapsible: sidebarCollapsible,
        collapsed: sidebarCollapsed,
        items: items
          .filter((item): item is ApiPageMetadata => {
            if (isInfoItem(item)) {
              return false;
            }
            return !!item.api.tags?.includes(tag);
          })
          .map((item) => {
            return {
              type: "link" as const,
              label: item.title,
              href: item.permalink,
              docId: item.id,
              className: clsx({
                "menu__list-item--deprecated": item.api.deprecated,
                "api-method": !!item.api.method,
                [item.api.method]: !!item.api.method,
              }),
            };
          }),
      };
    })
    .filter((item) => item.items.length > 0);

  const untagged = [
    {
      type: "category" as const,
      label: "API",
      collapsible: sidebarCollapsible,
      collapsed: sidebarCollapsed,
      items: items
        .filter((item): item is ApiPageMetadata => {
          // Filter out info pages and pages with tags
          if (isInfoItem(item)) {
            return false;
          }
          if (item.api.tags === undefined || item.api.tags.length === 0) {
            // no tags
            return true;
          }
          return false;
        })
        .map((item) => {
          return {
            type: "link" as const,
            label: item.title,
            href: item.permalink,
            docId: item.id,
            className: clsx({
              "menu__list-item--deprecated": item.api.deprecated,
              "api-method": !!item.api.method,
              [item.api.method]: !!item.api.method,
            }),
          };
        }),
    },
  ];

  return [...intros, ...tagged, ...untagged];
}

/**
 * Taken from: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/sidebars/generator.ts
 */
async function readCategoryMetadataFile(
  categoryDirPath: string
): Promise<CategoryMetadataFile | null> {
  async function tryReadFile(filePath: string): Promise<CategoryMetadataFile> {
    const contentString = await fs.readFile(filePath, { encoding: "utf8" });
    const unsafeContent = Yaml.load(contentString);
    try {
      return validateCategoryMetadataFile(unsafeContent);
    } catch (e) {
      console.error(
        chalk.red(
          `The docs sidebar category metadata file path=${filePath} looks invalid!`
        )
      );
      throw e;
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const ext of [".json", ".yml", ".yaml"]) {
    // Simpler to use only posix paths for mocking file metadata in tests
    const filePath = posixPath(
      path.join(categoryDirPath, `${CategoryMetadataFilenameBase}${ext}`)
    );
    if (await fs.pathExists(filePath)) {
      return tryReadFile(filePath);
    }
  }
  return null;
}
