/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiItem } from "../types";
import { createDescription } from "./createDescription";
import { create } from "./utils";

interface Props {
  parameters: ApiItem["parameters"];
  type: "path" | "query" | "header" | "cookie";
  /**
   * The header text of the table section.
   */
  title: string;
}

export function createParamsTable({ parameters, type, title }: Props) {
  if (parameters === undefined) {
    return undefined;
  }
  const params = parameters.filter((param) => param?.in === type);
  if (params.length === 0) {
    return undefined;
  }
  return create("ContentSection", {
    title,
    children: params.map((param) =>
      create("ParamListItem", {
        param,
        children: [createDescription(param.description)],
      })
    ),
  });
}
