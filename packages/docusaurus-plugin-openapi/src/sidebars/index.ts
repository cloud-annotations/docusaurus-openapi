/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import clsx from "clsx";

import { ApiMetadata, ApiPageMetadata } from "../types";

interface Options {
  sidebarCollapsible: boolean;
  sidebarCollapsed: boolean;
}

function groupByTags(
  items: ApiMetadata[],
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

export function generateSidebars(items: ApiMetadata[], options: Options) {
  return groupByTags(items, options);
}
