/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

/**
 * The component imports for the custom components used in the markdown.
 */
export function createComponentImports() {
  return [
    'import Header from "@theme/ApiItem/Header";',
    'import ContentSection from "@theme/ApiItem/ContentSection";',
    'import ParamListItem from "@theme/ApiItem/ParamListItem";',
  ].join("\n");
}
