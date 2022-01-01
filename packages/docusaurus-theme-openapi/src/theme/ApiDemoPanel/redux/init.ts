/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ThemeConfig } from "../../../types";
import { loadAuth, loadSelectedAuth } from "./persistance";

function init(
  {
    requestBody = {},
    "x-code-samples": codeSamples = [],
    postman,
    jsonRequestBodyExample,
    security,
    securitySchemes,
  }: any,
  options: ThemeConfig["api"] = {}
) {
  const auth = loadAuth({
    securitySchemes,
    security: security ?? [],
    persistance: options.authPersistance,
  });

  function createOptionIDs(auth: any): string[] {
    return auth
      .map((a: { key: string }[]) =>
        a.reduce((acc, cur) => {
          if (acc === undefined) {
            return cur.key;
          }
          return `${acc} and ${cur.key}`;
        }, undefined as string | undefined)
      )
      .filter(Boolean);
  }
  const authOptionIDs = createOptionIDs(auth);
  const _uniqueAuthKey = authOptionIDs.join("&");

  const selectedAuthID =
    loadSelectedAuth({
      key: _uniqueAuthKey,
      persistance: options.authPersistance,
    }) ?? authOptionIDs[0];

  return {
    jsonRequestBodyExample,
    requestBodyMetadata: requestBody, // TODO: no...
    codeSamples,
    postman,
    auth,
    selectedAuthID,
    authOptionIDs,
    _uniqueAuthKey,
    options,
  };
}

export default init;
