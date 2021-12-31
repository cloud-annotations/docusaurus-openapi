/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import {
  ParameterObject,
  ServerObject,
} from "docusaurus-plugin-openapi/src/openapi/types";
import cloneDeep from "lodash/cloneDeep";
import sdk from "postman-collection";

type Param = {
  value?: string | string[];
} & ParameterObject;

interface BearerAuth {
  type: "http";
  scheme: "bearer";
  data: {
    token?: string;
  };
}

interface BasicAuth {
  type: "http";
  scheme: "basic";
  data: {
    username?: string;
    password?: string;
  };
}

type Auth = BasicAuth | BearerAuth;

function setQueryParams(postman: sdk.Request, queryParams: Param[]) {
  postman.url.query.clear();

  const qp = queryParams
    .map((param) => {
      if (!param.value) {
        return undefined;
      }

      if (Array.isArray(param.value)) {
        return new sdk.QueryParam({
          key: param.name,
          value: param.value.join(","),
        });
      }

      // Parameter allows empty value: "/hello?extended"
      if (param.allowEmptyValue) {
        if (param.value === "true") {
          return new sdk.QueryParam({
            key: param.name,
            value: null,
          });
        }
        return undefined;
      }

      return new sdk.QueryParam({
        key: param.name,
        value: param.value,
      });
    })
    .filter((item): item is sdk.QueryParam => item !== undefined);

  if (qp.length > 0) {
    postman.addQueryParams(qp);
  }
}

function setPathParams(postman: sdk.Request, queryParams: Param[]) {
  const source = queryParams.map((param) => {
    return new sdk.Variable({
      key: param.name,
      value: param.value || `:${param.name}`,
    });
  });
  postman.url.variables.assimilate(source, false);
}

function buildCookie(cookieParams: Param[]) {
  const cookies = cookieParams
    .map((param) => {
      if (param.value && !Array.isArray(param.value)) {
        return new sdk.Cookie({
          // TODO: Is this right?
          path: "",
          domain: "",
          key: param.name,
          value: param.value,
        });
      }
      return undefined;
    })
    .filter((item): item is sdk.Cookie => item !== undefined);
  const list = new sdk.CookieList(null, cookies);
  return list.toString();
}

function setHeaders(
  postman: sdk.Request,
  contentType: string,
  accept: string,
  cookie: string,
  headerParams: Param[],
  other: { key: string; value: string }[]
) {
  postman.headers.clear();
  if (contentType) {
    postman.addHeader({ key: "Content-Type", value: contentType });
  }
  if (accept) {
    postman.addHeader({ key: "Accept", value: accept });
  }
  headerParams.forEach((param) => {
    if (param.value && !Array.isArray(param.value)) {
      postman.addHeader({ key: param.name, value: param.value });
    }
  });

  other.forEach((header) => {
    postman.addHeader(header);
  });

  if (cookie) {
    postman.addHeader({ key: "Cookie", value: cookie });
  }
}

// TODO: this is all a bit hacky
function setBody(clonedPostman: sdk.Request, body: unknown) {
  if (clonedPostman.body === undefined) {
    return;
  }

  if ((body as any)?.type === "file") {
    // treat it like file.
    clonedPostman.body.mode = "file";
    clonedPostman.body.file = { src: (body as any).src };
    return;
  }

  switch (clonedPostman.body.mode) {
    case "raw": {
      // TODO: not really sure of the logic behind this...
      if (body === "") {
        clonedPostman.body = undefined;
        return;
      }
      if (body !== undefined && typeof body !== "string") {
        clonedPostman.body = undefined;
        return;
      }
      clonedPostman.body.raw = body ?? "";
      return;
    }
    case "formdata": {
      clonedPostman.body.formdata?.clear();
      if (body == null) {
        return;
      }
      if (typeof body !== "object") {
        // treat it like raw.
        clonedPostman.body.mode = "raw";
        clonedPostman.body.raw = `${body}`;
        return;
      }
      const params = Object.entries(body as any)
        .filter(([_, val]) => val)
        .map(([key, val]) => {
          if ((val as any).type === "file") {
            return new sdk.FormParam({ key: key, ...(val as any) });
          }
          return new sdk.FormParam({ key: key, value: val });
        });
      clonedPostman.body.formdata?.assimilate(params, false);
      return;
    }
    case "urlencoded": {
      clonedPostman.body.urlencoded?.clear();
      if (body == null) {
        return;
      }
      if (typeof body !== "object") {
        // treat it like raw.
        clonedPostman.body.mode = "raw";
        clonedPostman.body.raw = `${body}`;
        return;
      }
      const params = Object.entries(body as any)
        .filter(([_, val]) => val)
        .map(
          ([key, val]) => new sdk.QueryParam({ key: key, value: val as any })
        );
      clonedPostman.body.urlencoded?.assimilate(params, false);
      return;
    }
    default:
      return;
  }
}

// TODO: finish these types
interface Options {
  server: ServerObject;
  queryParams: Param[];
  pathParams: Param[];
  cookieParams: Param[];
  headerParams: Param[];
  contentType: string;
  accept: string;
  body: unknown;
  auth: Auth[][];
  selectedAuthID?: string;
  authOptionIDs: string[];
}

function buildPostmanRequest(
  postman: sdk.Request,
  {
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
  }: Options
) {
  const clonedPostman = cloneDeep(postman);

  clonedPostman.url.protocol = undefined;
  clonedPostman.url.host = [window.location.origin];

  if (server) {
    let url = server.url.replace(/\/$/, "");
    const variables = server.variables;
    if (variables) {
      Object.keys(variables).forEach((variable) => {
        url = url.replace(`{${variable}}`, variables[variable].default);
      });
    }
    clonedPostman.url.host = [url];
  }

  setQueryParams(clonedPostman, queryParams);
  setPathParams(clonedPostman, pathParams);

  const cookie = buildCookie(cookieParams);
  let otherHeaders = [];

  let selectedAuth: Auth[] = [];
  if (selectedAuthID !== undefined) {
    const selectedAuthIndex = authOptionIDs.indexOf(selectedAuthID);
    selectedAuth = auth[selectedAuthIndex];
  }

  for (const a of selectedAuth) {
    // Bearer Auth
    if (a.type === "http" && a.scheme === "bearer") {
      const { token } = a.data;
      if (token === undefined) {
        continue;
      }
      otherHeaders.push({
        key: "Authorization",
        value: `Bearer ${token}`,
      });
      continue;
    }

    // Basic Auth
    if (a.type === "http" && a.scheme === "basic") {
      const { username, password } = a.data;
      if (username === undefined || password === undefined) {
        continue;
      }
      otherHeaders.push({
        key: "Authorization",
        value: `Basic ${window.btoa(`${username}:${password}`)}`,
      });
      continue;
    }
  }

  setHeaders(
    clonedPostman,
    contentType,
    accept,
    cookie,
    headerParams,
    otherHeaders
  );

  setBody(clonedPostman, body);

  return clonedPostman;
}

export default buildPostmanRequest;
