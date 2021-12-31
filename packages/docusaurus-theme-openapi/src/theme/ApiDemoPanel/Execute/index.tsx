/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { useOldSelector, useTypedDispatch, useTypedSelector } from "../hooks";
import { setResponse } from "../Response/slice";
import buildPostmanRequest from "./../buildPostmanRequest";
import makeRequest from "./makeRequest";

function validateRequest(params: {
  [key: string]: { required?: boolean; value: unknown }[];
}) {
  for (let paramList of Object.values(params)) {
    for (let param of paramList) {
      if (param.required && !param.value) {
        return false;
      }
    }
  }
  return true;
}

function Execute() {
  const postman = useOldSelector((state: any) => state.postman);

  const pathParams = useOldSelector((state: any) => state.params.path);
  const queryParams = useOldSelector((state: any) => state.params.query);
  const cookieParams = useOldSelector((state: any) => state.params.cookie);
  const headerParams = useOldSelector((state: any) => state.params.header);
  const contentType = useTypedSelector((state) => state.contentType.value);
  const body = useTypedSelector((state) => state.body);
  const accept = useTypedSelector((state) => state.accept.value);
  const server = useTypedSelector((state) => state.server.value);
  const auth = useOldSelector((state: any) => state.auth);
  const selectedAuthID = useOldSelector((state: any) => state.selectedAuthID);
  const authOptionIDs = useOldSelector((state: any) => state.authOptionIDs);
  const proxy = useOldSelector((state: any) => state.options.proxy);

  const params = useOldSelector((state: any) => state.params);
  const isValidRequest = validateRequest(params);

  const dispatch = useTypedDispatch();

  const postmanRequest = buildPostmanRequest(postman, {
    queryParams,
    pathParams,
    cookieParams,
    contentType,
    accept,
    headerParams,
    body,
    server,
    auth,
    selectedAuthID,
    authOptionIDs,
  });

  return (
    <button
      className="button button--block button--primary"
      style={{ height: "48px", marginBottom: "var(--ifm-spacing-vertical)" }}
      disabled={!isValidRequest}
      onClick={async () => {
        dispatch(setResponse("loading..."));
        try {
          const res = await makeRequest(postmanRequest, proxy, body);
          dispatch(setResponse(res));
        } catch (e: any) {
          dispatch(setResponse(e.message ?? "Error fetching."));
        }
      }}
    >
      Execute
    </button>
  );
}

export default Execute;
