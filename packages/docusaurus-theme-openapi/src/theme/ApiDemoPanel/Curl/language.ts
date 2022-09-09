/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

export interface Language {
  tabName: string;
  highlight: string;
  language: string;
  variant: string;
  options: { [key: string]: boolean };
}
