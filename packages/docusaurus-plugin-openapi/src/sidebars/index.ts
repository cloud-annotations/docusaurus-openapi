/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiItemMetadata } from "../types";

interface Options {
  sidebarCollapsible: boolean;
  sidebarCollapsed: boolean;
}

function groupByTags(
  items: ApiItemMetadata[],
  { sidebarCollapsible, sidebarCollapsed }: Options
) {
  const tags = [
    ...new Set(
      items.flatMap((item) => item.data.tags).filter(Boolean) as string[]
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
          .filter((item) => item.data.tags?.includes(tag))
          .map((item) => {
            return {
              type: "link",
              label: item.title,
              href: item.permalink,
              docId: item.id,
              className: item.data.deprecated
                ? "menu__list-item--deprecated"
                : undefined,
            };
          }),
      };
    })
    .filter((item) => item.items.length > 0);

  return [
    ...tagged,
    {
      type: "category",
      label: "API",
      collapsible: sidebarCollapsible,
      collapsed: sidebarCollapsed,
      items: items
        .filter((item) => {
          if (item.data.tags === undefined || item.data.tags.length === 0) {
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
            className: item.data.deprecated
              ? "menu__list-item--deprecated"
              : undefined,
          };
        }),
    },
  ];
}

export function generateSidebars(items: ApiItemMetadata[], options: Options) {
  return groupByTags(items, options);
}
