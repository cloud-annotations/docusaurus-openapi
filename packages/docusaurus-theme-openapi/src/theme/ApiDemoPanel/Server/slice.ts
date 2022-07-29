/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// TODO: we might want to export this
import {
  ServerObject,
  ServerVariable,
} from "docusaurus-plugin-openapi/src/openapi/types";
import { ThemeConfig } from "../../../types";
import { createStorage } from "../storage-utils";

interface Map<T> {
  [key: string]: T;
}

export type ServerObjectWithStorage = ServerObject & {
  variables?: Map<ServerVariable & { storedValue: string }>;
};

export function createServer({
  servers,
  options: opts,
}: {
  servers: ServerObject[];
  options?: ThemeConfig["api"];
}): State {
  const storage = createStorage(opts?.authPersistance);

  let options: ServerObjectWithStorage[] = servers.map((s) => {
    // A deep copy of the original ServerObject, augmented with `storedValue` props.
    const srv = JSON.parse(JSON.stringify(s)) as ServerObjectWithStorage;

    let persisted = undefined;
    try {
      persisted = JSON.parse(
        storage.getItem(`docusaurus.openapi.server/${s.url}`) ?? ""
      );
    } catch {}

    if (!persisted) {
      persisted = {};
    }

    if (!persisted.variables) {
      persisted.variables = {};
    }

    srv.variables = srv.variables ?? {};

    for (const v of Object.keys(srv.variables)) {
      if (v in persisted.variables) {
        if (
          persisted.variables[v].storedValue !== undefined &&
          persisted.variables[v].storedValue !== null &&
          persisted.variables[v].storedValue !== ""
        ) {
          srv.variables[v].storedValue = persisted.variables[v].storedValue;
        } else {
          srv.variables[v].storedValue = srv.variables[v].default;
        }
      }
    }

    return srv;
  });

  return { value: options[0], options: options };
}

export interface State {
  value?: ServerObjectWithStorage;
  options: ServerObjectWithStorage[];
}

const initialState: State = {} as any;

export const slice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setServer: (state, action: PayloadAction<string>) => {
      state.value = state.options.find((s) => s.url === action.payload);
    },
    setServerVariable: (
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) => {
      if (state.value?.variables) {
        state.value.variables[action.payload.key].storedValue =
          action.payload.value;
      }
    },
  },
});

export const { setServer, setServerVariable } = slice.actions;

export default slice.reducer;
