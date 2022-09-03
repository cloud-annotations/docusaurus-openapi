/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiItem } from "../types";
import { createDescription } from "./createDescription";
import { create } from "./utils";

/**
 * Renders the Header component from @theme/ApiItem/Header.
 *
 * The header component is used to display the title, method, path of an API
 * and the formatted description.
 */
export function createHeader(
  title: string,
  { method, path, description }: ApiItem
) {
  return create("Header", {
    title,
    method,
    path,
    children: [createDescription(description)],
  });
}
