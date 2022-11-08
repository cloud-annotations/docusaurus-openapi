/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ParameterObject } from "docusaurus-plugin-openapi/src/openapi/types";
import cloneDeep from "lodash/cloneDeep";
import sdk from "postman-collection";

import { AuthState, Scheme } from "./Authorization/slice";
import { Body, Content } from "./Body/slice";
import { ServerObjectWithStorage } from "./Server/slice";

type Param = {
  value?: string | string[];
} & ParameterObject;

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
          value: param.value.map(encodeURIComponent).join(","),
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
        value: encodeURIComponent(param.value),
      });
    })
    .filter((item): item is sdk.QueryParam => item !== undefined);

  if (qp.length > 0) {
    postman.addQueryParams(qp);
  }
}

function setPathParams(postman: sdk.Request, queryParams: Param[]) {
  const recursiveEncodeURIComponent = (c: string | string[]) =>
    Array.isArray(c) ? c.map(encodeURIComponent) : encodeURIComponent(c);

  const source = queryParams.map((param) => {
    return new sdk.Variable({
      key: param.name,
      value: param.value
        ? recursiveEncodeURIComponent(param.value)
        : `:${param.name}`,
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
function setBody(clonedPostman: sdk.Request, body: Body) {
  if (clonedPostman.body === undefined) {
    return;
  }

  if (body.type === "empty") {
    clonedPostman.body = undefined;
    return;
  }

  if (body.type === "raw" && body.content?.type === "file") {
    // treat it like file.
    clonedPostman.body.mode = "file";
    clonedPostman.body.file = { src: body.content.value.src };
    return;
  }

  switch (clonedPostman.body.mode) {
    case "raw": {
      // check file even though it should already be set from above
      if (body.type !== "raw" || body.content?.type === "file") {
        clonedPostman.body = undefined;
        return;
      }
      clonedPostman.body.raw = body.content?.value ?? "";
      return;
    }
    case "formdata": {
      clonedPostman.body.formdata?.clear();
      if (body.type !== "form") {
        // treat it like raw.
        clonedPostman.body.mode = "raw";
        clonedPostman.body.raw = `${body.content?.value}`;
        return;
      }
      const params = Object.entries(body.content)
        .filter((entry): entry is [string, NonNullable<Content>] => !!entry[1])
        .map(([key, content]) => {
          if (content.type === "file") {
            return new sdk.FormParam({ key: key, ...content });
          }
          return new sdk.FormParam({ key: key, value: content.value });
        });
      clonedPostman.body.formdata?.assimilate(params, false);
      return;
    }
    case "urlencoded": {
      clonedPostman.body.urlencoded?.clear();
      if (body.type !== "form") {
        // treat it like raw.
        clonedPostman.body.mode = "raw";
        clonedPostman.body.raw = `${body.content?.value}`;
        return;
      }
      const params = Object.entries(body.content)
        .filter((entry): entry is [string, NonNullable<Content>] => !!entry[1])
        .filter(([_key, content]) => content.type !== "array")
        .map(([key, content]) => {
          if (
            content.type !== "file" &&
            content.type !== "array" &&
            content.value
          ) {
            return new sdk.QueryParam({ key: key, value: content.value });
          }
          return undefined;
        })
        .filter((item): item is sdk.QueryParam => item !== undefined);

      const arrayParams = Object.entries(body.content)
        .filter((entry): entry is [string, NonNullable<Content>] => !!entry[1])
        .filter(([_key, content]) => content.type === "array")
        .map(([key, content]) => {
          if (content.type === "array" && content.value) {
            return {
              key: key,
              values: content.value?.value?.map(
                (e) => new sdk.QueryParam({ key: key, value: e })
              ),
            };
          }
          return undefined;
        })
        .filter((item) => item !== undefined && item?.values !== undefined);

      clonedPostman.body.urlencoded?.assimilate(params, false);

      // Now let's append the array keys
      for (const arrayParam of arrayParams) {
        clonedPostman.body.urlencoded?.remove(
          (e) => e.key === arrayParam?.key,
          undefined
        );

        arrayParam?.values?.forEach((queryParam) =>
          clonedPostman.body?.urlencoded?.append(queryParam)
        );
      }

      console.log(clonedPostman.body.urlencoded);

      return;
    }
    default:
      return;
  }
}

// TODO: finish these types
interface Options {
  server?: ServerObjectWithStorage;
  queryParams: Param[];
  pathParams: Param[];
  cookieParams: Param[];
  headerParams: Param[];
  contentType: string;
  accept: string;
  body: Body;
  auth: AuthState;
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
        url = url.replace(`{${variable}}`, variables[variable].storedValue);
      });
    }
    clonedPostman.url.host = [url];
  }

  setQueryParams(clonedPostman, queryParams);
  setPathParams(clonedPostman, pathParams);

  const cookie = buildCookie(cookieParams);
  let otherHeaders = [];

  let selectedAuth: Scheme[] = [];
  if (auth.selected !== undefined) {
    selectedAuth = auth.options[auth.selected];
  }

  for (const a of selectedAuth) {
    // Bearer Auth
    if (a.type === "http" && a.scheme === "bearer") {
      const { token } = auth.data[a.key];
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
      const { username, password } = auth.data[a.key];
      if (username === undefined || password === undefined) {
        continue;
      }
      otherHeaders.push({
        key: "Authorization",
        value: `Basic ${window.btoa(`${username}:${password}`)}`,
      });
      continue;
    }

    if (a.type === "apiKey" && a.in === "header") {
      if (auth.data && auth.data[a.key]) {
        const value = auth.data[a.key][a.name];
        if (value) {
          otherHeaders.push({
            key: a.name,
            value,
          });
        }
      }
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
