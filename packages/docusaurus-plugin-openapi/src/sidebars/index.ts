/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiPageMetadata } from "../types";

interface Options {
  sidebarCollapsible: boolean;
  sidebarCollapsed: boolean;
}
// todo: theme-common.d.ts
type NavbarItem = {
  type?: string | undefined;
  items?: NavbarItem[];
  label?: string;
  position?: "left" | "right";
} & Record<string, unknown>;

type Item =
  | {
      [key: string]: any;
      type: "info";
      info: any;
      title: string;
      permalink: string;
      id: string;
    }
  | {
      [key: string]: any;
      type: "api";
      api: {
        // todo: include info
        // info: {
        // title: string;
        // },
        tags?: string[] | undefined;
      };
      title: string;
      permalink: string;
      id: string;
    };

function groupByTags(
  items: Item[],
  { sidebarCollapsible, sidebarCollapsed }: Options
) {
  const intros = items
    .filter((item) => {
      if (item.type === "info") {
        return true;
      }
      return false;
    })
    .map((item) => {
      return {
        source: prototype?.source,
        sourceDirName: prototype?.sourceDirName ?? ".",

        collapsible: options.sidebarCollapsible,
        collapsed: options.sidebarCollapsed,
        type: "category" as const,
        label: info?.title || fileName,
        items: groupByTags(items, options),
      };
    })
    .values()
    .value();

  if (sections.length === 1) {
    return sections[0].items;
  }

  // group into folders and build recursive category tree
  const rootSections = sections.filter((x) => x.sourceDirName === ".");
  const childSections = sections.filter((x) => x.sourceDirName !== ".");

  const subCategories = [] as any;

  for (const childSection of childSections) {
    const basePathRegex = new RegExp(`${childSection.sourceDirName}.*$`);
    const basePath =
      childSection.source?.replace(basePathRegex, "").replace("@site", ".") ??
      ".";

    const dirs = childSection.sourceDirName.split("/");

    let root = subCategories;
    const parents: string[] = [];
    while (dirs.length) {
      const currentDir = dirs.shift() as string;
      // todo: optimize?
      const folderPath = path.join(basePath, ...parents, currentDir);
      const meta = await readCategoryMetadataFile(folderPath);
      const label = meta?.label ?? currentDir;
      const existing = root.find((x: any) => x.label === label);

      if (!existing) {
        const child = {
          collapsible: options.sidebarCollapsible,
          collapsed: options.sidebarCollapsed,
          type: "category" as const,
          label,
          items: [],
        };
        root.push(child);
        root = child.items;
      } else {
        root = existing.items;
      }
      parents.push(currentDir);
    }
    root.push(childSection);
  }

  return [...rootSections, ...subCategories];
}

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
          .filter((item) => {
            if (isInfoItem(item)) {
              return false;
            }
            return item.api.tags?.includes(tag);
          })
          .map((item) => {
            const apiPage = item as ApiPageMetadata; // TODO: we should have filtered out all info pages, but I don't like this
            return {
              type: "link" as const,
              label: apiPage.title,
              href: apiPage.permalink,
              docId: apiPage.id,
              className: clsx({
                "menu__list-item--deprecated": apiPage.api.deprecated,
                "api-method": !!apiPage.api.method,
                [apiPage.api.method]: !!apiPage.api.method,
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
        .filter((item) => {
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
          const apiPage = item as ApiPageMetadata; // TODO: we should have filtered out all info pages, but I don't like this
          return {
            type: "link",
            label: apiPage.title,
            href: apiPage.permalink,
            docId: apiPage.id,
            className: clsx({
              "menu__list-item--deprecated": apiPage.api.deprecated,
              "api-method": !!apiPage.api.method,
              [apiPage.api.method]: !!apiPage.api.method,
            }),
          };
        }),
    },
  ];

  return [...intros, ...tagged, ...untagged];
}

export function generateSidebars(
  items: Item[],
  options: Options
): NavbarItem[] {
  return groupByTags(items, options);
}
