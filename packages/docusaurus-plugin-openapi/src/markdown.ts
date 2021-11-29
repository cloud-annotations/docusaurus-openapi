/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiItem, ExampleObject, ParameterObject } from "./types";

export function createMD(item: ApiItem) {
  return finalize([
    item.description,
    createParamsTable(item.parameters, "path"),
    createParamsTable(item.parameters, "query"),
    createParamsTable(item.parameters, "header"),
    createParamsTable(item.parameters, "cookie"),
  ]);
}

function create(tag: string, props: any, children: string | string[]): string {
  let propString = "";
  for (const [key, value] of Object.entries(props)) {
    propString += ` ${key}={${JSON.stringify(value)}}`;
  }

  if (Array.isArray(children)) {
    children = children.join("");
  }

  return `<${tag}${propString}>${children}</${tag}>`;
}

function cond<T>(
  shouldRender: T | undefined,
  cb: (x: T) => string | string[]
): string {
  if (shouldRender) {
    let children = cb(shouldRender);
    if (Array.isArray(children)) {
      children = children.join("");
    }
    return children;
  }
  return "";
}

function parseFinalSchema(schema: any) {
  if (schema.$ref) {
    return schema.$ref.replace("#/components/schemas/", "");
  }
  if (schema.format) {
    return schema.format;
  }
  return schema.type;
}

function getSchemaName(schema: any) {
  if (schema.type === "array") {
    return parseFinalSchema(schema.items) + "[]";
  }

  return parseFinalSchema(schema) ?? "";
}

function createParamsTable(
  parameters: ApiItem["parameters"],
  type: "path" | "query" | "header" | "cookie"
) {
  if (parameters === undefined) {
    return undefined;
  }
  const params = parameters.filter(
    (param: any) => param?.in === type
  ) as ParameterObject[];
  if (params.length === 0) {
    return undefined;
  }

  return create("table", { style: { display: "table", width: "100%" } }, [
    create(
      "thead",
      {},
      create(
        "tr",
        {},
        create(
          "th",
          { style: { textAlign: "left" } },
          `${type.charAt(0).toUpperCase() + type.slice(1)} Parameters`
        )
      )
    ),
    create(
      "tbody",
      {},
      params.map((param) =>
        create(
          "tr",
          {},
          create("td", {}, [
            create("code", {}, param.name),
            create(
              "span",
              { style: { opacity: "0.6" } },
              ` ${getSchemaName(param.schema)}`
            ),
            cond(param.required, () => [
              create("span", { style: { opacity: "0.6" } }, " - "),
              create(
                "strong",
                {
                  style: {
                    fontSize: "var(--ifm-code-font-size)",
                    color: "var(--openapi-required)",
                  },
                },
                " REQUIRED"
              ),
            ]),
            cond(param.description, (description) =>
              create("div", {}, `\n${description}\n`)
            ),
            cond(param.example, (example) =>
              create("div", {}, `Example: ${example}`)
            ),
            cond(param.examples, (examples) =>
              Object.entries(examples).map(([k, v]) =>
                create(
                  "div",
                  {},
                  `Example (${k}): ${(v as ExampleObject).value}`
                )
              )
            ),
          ])
        )
      )
    ),
  ]);
}

function finalize(items: (string | undefined)[]) {
  return items.filter((i) => i !== undefined).join("\n\n");
}
