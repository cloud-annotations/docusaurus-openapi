/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { configureStore, combineReducers } from "@reduxjs/toolkit";

import accept from "./Accept/slice";
import body from "./Body/slice";
import contentType from "./ContentType/slice";
import params from "./ParamOptions/slice";
import oldReducer from "./redux/reducer";
import response from "./Response/slice";
import server from "./Server/slice";

function old(state = {}, action: any) {
  return oldReducer(state, action);
}

const rootReducer = combineReducers({
  accept,
  contentType,
  response,
  server,
  body,
  params,
  old,
});

export type RootState = ReturnType<typeof rootReducer>;

export const createStoreWithState = (preloadedState: RootState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppDispatch = ReturnType<typeof createStoreWithState>["dispatch"];
