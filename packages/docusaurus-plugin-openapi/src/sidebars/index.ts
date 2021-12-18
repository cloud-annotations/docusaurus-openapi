/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import path from "path";

import clsx from "clsx";

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

export type BaseItem = {
  [key: string]: any;
  title: string;
  permalink: string;
  id: string;
  source: string;
};

export type InfoItem = BaseItem & {
  type: "info";
  info: any;
};

export type ApiItem = BaseItem & {
  type: "api";
  api: {
    // todo: include info
    // info: {
    // title: string;
    // },
    tags?: string[] | undefined;
  };
};

type Item = InfoItem | ApiItem;

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
        type: "link",
        label: item.title,
        href: item.permalink,
        docId: item.id,
      };
    });

  const tags = [
    ...new Set(
      items
        .flatMap((item) => {
          if (item.type === "info") {
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
        type: "category",
        label: tag,
        collapsible: sidebarCollapsible,
        collapsed: sidebarCollapsed,
        items: items
          .filter((item) => {
            if (item.type === "info") {
              return false;
            }
            return item.api.tags?.includes(tag);
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
      };
    })
    .filter((item) => item.items.length > 0);

  const untagged = [
    {
      type: "category",
      label: "API",
      collapsible: sidebarCollapsible,
      collapsed: sidebarCollapsed,
      items: items
        .filter((item) => {
          // Filter out info pages and pages with tags
          if (item.type === "info") {
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
            source: item.source,
            info: item.api.info,

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
  ].map((categoryItem) => {
    const [prototype] = categoryItem.items;
    if (!prototype) {
      return categoryItem;
    }
    const { info } = prototype;
    const fileName = path.basename(prototype.source).split(".")[0];

    return {
      ...categoryItem,
      label: info?.title ?? fileName,
    };
  });

  return [...intros, ...tagged, ...untagged];
}

export function generateSidebars(
  items: Item[],
  options: Options
): NavbarItem[] {
  return groupByTags(items, options);
}