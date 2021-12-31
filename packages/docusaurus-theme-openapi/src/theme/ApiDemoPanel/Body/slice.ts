/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface File {
  src: string;
  content: Blob;
}

export interface FileContent {
  type: "file";
  value: File;
}

export interface StringContent {
  type: "string";
  value?: string;
}

export type Content = FileContent | StringContent | undefined;

export interface FormBody {
  type: "form";
  content: {
    [key: string]: Content;
  };
}

export interface RawBody {
  type: "raw";
  content: Content;
}

export interface EmptyBody {
  type: "empty";
}

export type Body = EmptyBody | FormBody | RawBody;

export type State = Body;

const initialState: State = {} as any;

export const slice = createSlice({
  name: "body",
  initialState,
  reducers: {
    clearRawBody: (_state) => {
      return {
        type: "empty",
      };
    },
    setStringRawBody: (_state, action: PayloadAction<string>) => {
      return {
        type: "raw",
        content: {
          type: "string",
          value: action.payload,
        },
      };
    },
    setFileRawBody: (_state, action: PayloadAction<File>) => {
      return {
        type: "raw",
        content: {
          type: "file",
          value: action.payload,
        },
      };
    },
    clearFormBodyKey: (state, action: PayloadAction<string>) => {
      if (state?.type === "form") {
        delete state.content[action.payload];
      }
    },
    setStringFormBody: (
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) => {
      if (state?.type !== "form") {
        return {
          type: "form",
          content: {
            [action.payload.key]: {
              type: "string",
              value: action.payload.value,
            },
          },
        };
      }
      state.content[action.payload.key] = {
        type: "string",
        value: action.payload.value,
      };
      return state;
    },
    setFileFormBody: (
      state,
      action: PayloadAction<{ key: string; value: File }>
    ) => {
      if (state?.type !== "form") {
        return {
          type: "form",
          content: {
            [action.payload.key]: {
              type: "file",
              value: action.payload.value,
            },
          },
        };
      }
      state.content[action.payload.key] = {
        type: "file",
        value: action.payload.value,
      };
      return state;
    },
  },
});

export const {
  clearRawBody,
  setStringRawBody,
  setFileRawBody,
  clearFormBodyKey,
  setStringFormBody,
  setFileFormBody,
} = slice.actions;

export default slice.reducer;
