/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { Middleware } from "@reduxjs/toolkit";

import { ThemeConfig } from "../../types";
import { setAuthData, setSelectedAuth } from "./Authorization/slice";
import { setServer, setServerVariable } from "./Server/slice";
import { createStorage, hashArray } from "./storage-utils";
import { AppDispatch, RootState } from "./store";

export function createPersistanceMiddleware(options: ThemeConfig["api"]) {
  const persistanceMiddleware: Middleware<{}, RootState, AppDispatch> =
    (storeAPI) => (next) => (action) => {
      const result = next(action);

      const state = storeAPI.getState();

      const storage = createStorage(options?.authPersistance);

      if (action.type === setAuthData.type) {
        for (const [key, value] of Object.entries(state.auth.data)) {
          if (Object.values(value).filter(Boolean).length > 0) {
            storage.setItem(key, JSON.stringify(value));
          } else {
            storage.removeItem(key);
          }
        }
      }

      if (action.type === setSelectedAuth.type) {
        if (state.auth.selected) {
          storage.setItem(
            hashArray(Object.keys(state.auth.options)),
            state.auth.selected
          );
        }
      }

      if (action.type === setServer.type) {
        if (state.server.value?.url) {
          // FIXME What to use as key?
          storage.setItem(
            `docusaurus.openapi.server/${state.server.value?.url}`,
            JSON.stringify(state.server.value)
          );
        }
      }

      if (action.type === setServerVariable.type) {
        if (state.server.value?.url) {
          storage.setItem(
            `docusaurus.openapi.server/${state.server.value?.url}`,
            JSON.stringify(state.server.value)
          );
        }
      }

      return result;
    };
  return persistanceMiddleware;
}
