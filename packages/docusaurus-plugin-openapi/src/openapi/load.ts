/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { normalizeUrl } from "@docusaurus/utils";
import fs from "fs-extra";
import yaml from "js-yaml";
import JsonRefs from "json-refs";
import { kebabCase } from "lodash";
import Converter from "openapi-to-postmanv2";
import sdk, { Collection } from "postman-collection";

import { ApiItem, ApiSection } from "../types";
import { sampleFromSchema } from "./createExample";
import { OpenApiObject, OpenApiObjectWithRef } from "./types";

function getPaths(spec: OpenApiObject): ApiItem[] {
  const seen: { [key: string]: number } = {};
  return Object.entries(spec.paths)
    .map(([path, pathObject]) => {
      const entries = Object.entries(pathObject);
      return entries.map(([key, val]) => {
        let method = key;
        let operationObject = val;

        const title =
          operationObject.summary ??
          operationObject.operationId ??
          "Missing summary";
        if (operationObject.description === undefined) {
          operationObject.description =
            operationObject.summary ?? operationObject.operationId ?? "";
        }

        const baseId = kebabCase(title);
        let count = seen[baseId];

        let id;
        if (count) {
          id = `${baseId}-${count}`;
          seen[baseId] = count + 1;
        } else {
          id = baseId;
          seen[baseId] = 1;
        }

        const servers =
          operationObject.servers ?? pathObject.servers ?? spec.servers;

        // TODO: Don't include summary temporarilly
        const { summary, ...defaults } = operationObject;

        return {
          ...defaults,
          id,
          title,
          method,
          path,
          servers,
        };
      });
    })
    .flat()
    .filter((item) => item !== undefined) as ApiItem[];
}

function organizeSpec(spec: OpenApiObject) {
  const paths = getPaths(spec);

  let tagNames: string[] = [];
  let tagged: ApiSection[] = [];
  if (spec.tags) {
    tagged = spec.tags
      .map((tag) => {
        return {
          title: tag.name,
          description: tag.description || "",
          items: paths.filter((p) => p.tags && p.tags.includes(tag.name)),
        };
      })
      .filter((i) => i.items.length > 0);
    tagNames = tagged.map((t) => t.title);
  }

  const all = [
    ...tagged,
    {
      title: "API",
      description: "",
      items: paths.filter((p) => {
        if (p.tags === undefined || p.tags.length === 0) {
          return true;
        }
        for (let tag of p.tags) {
          if (tagNames.includes(tag)) {
            return false;
          }
        }
        return true;
      }),
    },
  ];

  return all;
}

async function convertToPostman(
  openapiData: OpenApiObjectWithRef
): Promise<Collection> {
  // The conversions mutates whatever you pass here, create a new object.
  const openapiClone = JSON.parse(
    JSON.stringify(openapiData)
  ) as OpenApiObjectWithRef;

  // seems to be a weird bug with postman and servers...
  delete openapiClone.servers;
  for (let pathItemObject of Object.values(openapiClone.paths)) {
    delete pathItemObject.servers;
    delete pathItemObject.get?.servers;
    delete pathItemObject.put?.servers;
    delete pathItemObject.post?.servers;
    delete pathItemObject.delete?.servers;
    delete pathItemObject.options?.servers;
    delete pathItemObject.head?.servers;
    delete pathItemObject.patch?.servers;
    delete pathItemObject.trace?.servers;
  }

  return await new Promise((resolve, reject) => {
    Converter.convert(
      {
        type: "json",
        data: openapiClone,
      },
      {},
      (_: any, conversionResult: any) => {
        if (!conversionResult.result) {
          reject(conversionResult.reason);
          return;
        } else {
          return resolve(new sdk.Collection(conversionResult.output[0].data));
        }
      }
    );
  });
}

export async function _loadOpenapi(
  openapiData: OpenApiObjectWithRef,
  baseUrl: string,
  routeBasePath: string
) {
  // Attach a postman request object to the openapi spec.
  const postmanCollection = await convertToPostman(openapiData);
  postmanCollection.forEachItem((item) => {
    const method = item.request.method.toLowerCase();
    // NOTE: This doesn't catch all variables for some reason...
    // item.request.url.variables.each((pathVar) => {
    //   pathVar.value = `{${pathVar.key}}`;
    // });
    const path = item.request.url
      .getPath({ unresolved: true })
      .replace(/:([a-z0-9-_]+)/gi, "{$1}");

    switch (method) {
      case "get":
      case "put":
      case "post":
      case "delete":
      case "options":
      case "head":
      case "patch":
      case "trace":
        if (!openapiData.paths[path]) {
          break;
        }

        const operationObject = openapiData.paths[path][method];
        if (operationObject) {
          // TODO
          (operationObject as any).postman = item.request;
        }
        break;
      default:
        break;
    }
  });

  // TODO: Why do we dereff here and not earlier? I think it had something to do with object names?
  const { resolved: dereffed } = await JsonRefs.resolveRefs(openapiData);

  const dereffedSpec = dereffed as OpenApiObject;

  const order = organizeSpec(dereffedSpec);

  order.forEach((category, i) => {
    category.items.forEach((item, ii) => {
      // don't override already defined servers.
      if (item.servers === undefined) {
        item.servers = dereffedSpec.servers;
      }

      if (item.security === undefined) {
        item.security = dereffedSpec.security;
      }

      // Add security schemes so we know how to handle security.
      item.securitySchemes = dereffedSpec.components?.securitySchemes;

      // Make sure schemes are lowercase. See: https://github.com/cloud-annotations/docusaurus-plugin-openapi/issues/79
      Object.values(item.securitySchemes ?? {}).forEach((auth) => {
        if (auth.type === "http") {
          auth.scheme = auth.scheme.toLowerCase();
        }
      });

      item.permalink = normalizeUrl([baseUrl, routeBasePath, item.id]);

      const prev =
        order[i].items[ii - 1] ||
        order[i - 1]?.items[order[i - 1].items.length - 1];
      const next =
        order[i].items[ii + 1] || (order[i + 1] ? order[i + 1].items[0] : null);

      if (prev) {
        item.previous = {
          title: prev.title,
          permalink: normalizeUrl([baseUrl, routeBasePath, prev.id]),
        };
      }

      if (next) {
        item.next = {
          title: next.title,
          permalink: normalizeUrl([baseUrl, routeBasePath, next.id]),
        };
      }

      const content = item.requestBody?.content;
      const schema = content?.["application/json"]?.schema;
      if (schema) {
        item.jsonRequestBodyExample = sampleFromSchema(schema);
      }
    });
  });

  return order;
}

async function resolveRefs(openapiData: OpenApiObjectWithRef) {
  const { resolved } = await JsonRefs.resolveRefs(openapiData);
  return resolved as OpenApiObject;
}

function jsonToCollection(data: OpenApiObject): Promise<Collection> {
  return new Promise((resolve, reject) => {
    Converter.convert(
      { type: "json", data },
      {},
      (_err: any, conversionResult: any) => {
        if (!conversionResult.result) {
          return reject(conversionResult.reason);
        }
        return resolve(new sdk.Collection(conversionResult.output[0].data));
      }
    );
  });
}

async function createPostmanCollection(
  openapiData: OpenApiObject
): Promise<Collection> {
  const data = JSON.parse(JSON.stringify(openapiData)) as OpenApiObject;

  // Including `servers` breaks postman, so delete all of them.
  delete data.servers;
  for (let pathItemObject of Object.values(data.paths)) {
    delete pathItemObject.servers;
    delete pathItemObject.get?.servers;
    delete pathItemObject.put?.servers;
    delete pathItemObject.post?.servers;
    delete pathItemObject.delete?.servers;
    delete pathItemObject.options?.servers;
    delete pathItemObject.head?.servers;
    delete pathItemObject.patch?.servers;
    delete pathItemObject.trace?.servers;
  }

  return await jsonToCollection(data);
}

function findOperationObject(
  openapiData: OpenApiObject,
  method: string,
  path: string
) {
  //type narrowing
  switch (method) {
    case "get":
    case "put":
    case "post":
    case "delete":
    case "options":
    case "head":
    case "patch":
    case "trace":
      return openapiData.paths[path]?.[method];
  }

  return undefined;
}

export async function _newLoadOpenapi(
  openapiDataWithRefs: OpenApiObjectWithRef,
  baseUrl: string,
  routeBasePath: string
) {
  const openapiData = await resolveRefs(openapiDataWithRefs);

  // Attach a postman request object to the openapi spec.
  const postmanCollection = await createPostmanCollection(openapiData);

  postmanCollection.forEachItem((item) => {
    const method = item.request.method.toLowerCase();
    const path = item.request.url
      .getPath({ unresolved: true }) // unresolved returns "/:variableName" instead of "/<type>"
      .replace(/:([a-z0-9-_]+)/gi, "{$1}"); // replace "/:variableName" with "/{variableName}"

    const operationObject = findOperationObject(openapiData, method, path);
    if (operationObject) {
      // TODO
      (operationObject as any).postman = item.request;
    }
  });

  const order = organizeSpec(openapiData);

  order.forEach((category, i) => {
    category.items.forEach((item, ii) => {
      // don't override already defined servers.
      if (item.servers === undefined) {
        item.servers = openapiData.servers;
      }

      if (item.security === undefined) {
        item.security = openapiData.security;
      }

      // Add security schemes so we know how to handle security.
      item.securitySchemes = openapiData.components?.securitySchemes;

      // Make sure schemes are lowercase. See: https://github.com/cloud-annotations/docusaurus-plugin-openapi/issues/79
      Object.values(item.securitySchemes ?? {}).forEach((auth) => {
        if (auth.type === "http") {
          auth.scheme = auth.scheme.toLowerCase();
        }
      });

      item.permalink = normalizeUrl([baseUrl, routeBasePath, item.id]);

      const prev =
        order[i].items[ii - 1] ||
        order[i - 1]?.items[order[i - 1].items.length - 1];
      const next =
        order[i].items[ii + 1] || (order[i + 1] ? order[i + 1].items[0] : null);

      if (prev) {
        item.previous = {
          title: prev.title,
          permalink: normalizeUrl([baseUrl, routeBasePath, prev.id]),
        };
      }

      if (next) {
        item.next = {
          title: next.title,
          permalink: normalizeUrl([baseUrl, routeBasePath, next.id]),
        };
      }

      const content = item.requestBody?.content;
      const schema = content?.["application/json"]?.schema;
      if (schema) {
        item.jsonRequestBodyExample = sampleFromSchema(schema);
      }
    });
  });

  return order;
}

export async function loadOpenapi(
  openapiPath: string,
  baseUrl: string,
  routeBasePath: string
) {
  const openapiString = await fs.readFile(openapiPath, "utf-8");
  const openapiData = yaml.load(openapiString) as OpenApiObjectWithRef;

  return _loadOpenapi(openapiData, baseUrl, routeBasePath);
}
