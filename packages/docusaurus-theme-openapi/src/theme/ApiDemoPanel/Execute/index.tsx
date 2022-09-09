/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import sdk from "postman-collection";

import { useTypedDispatch, useTypedSelector } from "../hooks";
import { Param } from "../ParamOptions/slice";
import { setResponse } from "../Response/slice";
import buildPostmanRequest from "./../buildPostmanRequest";
import makeRequest from "./makeRequest";

function validateRequest(params: {
  path: Param[];
  query: Param[];
  header: Param[];
  cookie: Param[];
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

interface Props {
  postman: sdk.Request;
  proxy?: string;
}

function Execute({ postman, proxy }: Props) {
  const { siteConfig } = useDocusaurusContext();

  const pathParams = useTypedSelector((state) => state.params.path);
  const queryParams = useTypedSelector((state) => state.params.query);
  const cookieParams = useTypedSelector((state) => state.params.cookie);
  const headerParams = useTypedSelector((state) => state.params.header);
  const contentType = useTypedSelector((state) => state.contentType.value);
  const body = useTypedSelector((state) => state.body);
  const accept = useTypedSelector((state) => state.accept.value);
  const server = useTypedSelector((state) => state.server.value);
  const params = useTypedSelector((state) => state.params);
  const auth = useTypedSelector((state) => state.auth);

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
  });

  const buttonText =
    siteConfig?.themeConfig?.submitRequestButtonText ?? "Execute";

  return (
    <button
      className="button button--primary"
      style={{ height: "48px" }}
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
      {buttonText}
    </button>
  );
}

export default Execute;
