/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import path from "path";

import type { PropSidebarItem } from "@docusaurus/plugin-content-docs-types";
import clsx from "clsx";
import _ from "lodash";

import { ApiPageMetadata } from "../types";

interface Options {
  sidebarCollapsible: boolean;
  sidebarCollapsed: boolean;
}

export type BaseItem = {
  [key: string]: any;
  title: string;
  permalink: string;
  id: string;
  source: string;
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

export function generateSidebars(
  items: Item[],
  options: Options
): PropSidebarItem[] {
  const sections = _(items)
    .groupBy((item) => item.source)
    .mapValues((items, source) => {
      const prototype = items.find((x) => {
        return x.api?.info != null;
      });
      const info = prototype?.api?.info;
      const fileName = path.basename(source).split(".")[0];
      return {
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

  return sections;
}

function groupByTags(
  items: Item[],
  { sidebarCollapsible, sidebarCollapsed }: Options
): PropSidebarItem[] {
  const intros = items
    .filter((item) => {
      if (item.type === "info") {
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
        type: "category" as const,
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
      type: "category" as const,
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

  return [...intros, ...tagged, ...untagged[0].items];
}
