/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { Middleware } from "@reduxjs/toolkit";

import { ThemeConfig } from "../../types";
import { setAuthData, setSelectedAuth } from "./Authorization/slice";
import { AppDispatch, RootState } from "./store";

export function createPersistanceMiddleware(options: ThemeConfig["api"]) {
  const persistanceMiddleware: Middleware<{}, RootState, AppDispatch> =
    (_storeAPI) => (next) => (action) => {
      if (action.type === setAuthData.type) {
        console.log("PERSIST AUTH DATA");
      }

      if (action.type === setSelectedAuth.type) {
        console.log("PERSIST SELECTED AUTH");
      }

      return next(action);
    };
  return persistanceMiddleware;
}
