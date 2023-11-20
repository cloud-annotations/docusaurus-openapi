/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

export function createDescription(description: string | undefined) {
  if (!description) {
    return "";
  }
  // Replace usages of <= or >= with \<= or \>= to avoid MDX3 parsing issues.
  return `\n\n${description.replace(/([<>]=?)/g, "\\$1")}\n\n`;
}
