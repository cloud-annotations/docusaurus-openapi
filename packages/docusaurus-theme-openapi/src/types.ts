/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import type { Language } from "./theme/ApiDemoPanel/Curl/language";

export interface ThemeConfig {
  api?: {
    proxy?: string;
    authPersistance?: false | "localStorage" | "sessionStorage";
    serverVariablesPersistance?: false | "localStorage" | "sessionStorage";
  };
  /**
   * The button text to display in the request panel.
   * Defaults to "Execute" if not specified.
   */
  submitRequestButtonText?: string;
  /**
   * The language tabs to display request code snippets for.
   * Defaults to all languages if not specified.
   */
  languageTabs?: Language[];
}
