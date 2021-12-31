/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { useOldSelector, useTypedSelector } from "../redux2/hooks";
import buildPostmanRequest from "./../buildPostmanRequest";
import { useActions } from "./../redux/actions";
import makeRequest from "./makeRequest";

function isRequestComplete(params) {
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
  const postman = useOldSelector((state) => state.postman);

  const pathParams = useOldSelector((state) => state.params.path);
  const queryParams = useOldSelector((state) => state.params.query);
  const cookieParams = useOldSelector((state) => state.params.cookie);
  const headerParams = useOldSelector((state) => state.params.header);
  const contentType = useTypedSelector((state) => state.contentType.value);
  const body = useOldSelector((state) => state.body);
  const accept = useTypedSelector((state) => state.accept.value);
  const endpoint = useOldSelector((state) => state.endpoint);
  const auth = useOldSelector((state) => state.auth);
  const selectedAuthID = useOldSelector((state) => state.selectedAuthID);
  const authOptionIDs = useOldSelector((state) => state.authOptionIDs);
  const proxy = useOldSelector((state) => state.options.proxy);

  const params = useOldSelector((state) => state.params);
  const finishedRequest = isRequestComplete(params);

  const { setResponse } = useActions();

  const postmanRequest = buildPostmanRequest(postman, {
    queryParams,
    pathParams,
    cookieParams,
    contentType,
    accept,
    headerParams,
    body,
    endpoint,
    auth,
    selectedAuthID,
    authOptionIDs,
  });

  return (
    <button
      className="button button--block button--primary"
      style={{ height: "48px", marginBottom: "var(--ifm-spacing-vertical)" }}
      disabled={!finishedRequest}
      onClick={async () => {
        setResponse("loading...");
        try {
          const res = await makeRequest(postmanRequest, proxy, body);
          setResponse(res);
        } catch (e) {
          setResponse(e.message ?? "Error fetching.");
        }
      }}
    >
      Execute
    </button>
  );
}

export default Execute;
