/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { ApiItem } from "./types";

export function createMD(item: ApiItem) {
  return finalize([
    item.description,
    createParamsTable(item.parameters, "path"),
    createParamsTable(item.parameters, "query"),
    createParamsTable(item.parameters, "header"),
    createParamsTable(item.parameters, "cookie"),
  ]);
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

  return parseFinalSchema(schema);
}

function createParamsTable(
  parameters: ApiItem["parameters"],
  type: "path" | "query" | "header" | "cookie"
) {
  if (parameters === undefined) {
    return undefined;
  }
  const params = parameters.filter((param: any) => param.in === type);
  if (params.length === 0) {
    return undefined;
  }

  return `
  <table style={{ display: "table", width: "100%" }}>
    <thead>
      <tr>
        <th style={{ textAlign: "left" }}>
          ${type.charAt(0).toUpperCase() + type.slice(1)} Parameters
        </th>
      </tr>
    </thead>
    <tbody>
${params
  .map((param: any) => {
    return `<tr>
<td>
<code>${param.name}</code>
<span style={{ opacity: "0.6" }}>&nbsp;${
      getSchemaName(param.schema) || ""
    }</span>
${
  (param.required &&
    `<span style={{ opacity: "0.6" }}> — </span>
<strong style={{ fontSize: "var(--ifm-code-font-size)", color: "var(--openapi-required)" }}>&nbsp;REQUIRED</strong>`) ||
  ""
}
${
  (param.description &&
    `<div>
${param.description}
</div>`) ||
  ""
}
${(param.example && `<div>Example: ${param.example}</div>`) || ""}
${
  (param.examples &&
    Object.keys(param.examples)
      .map((key) => `<div>Example (${key}): ${param.examples[key].value}</div>`)
      .join("")) ||
  ""
}
</td>
</tr>`;
  })
  .join("")}
</tbody>
</table>`;
}

function finalize(items: (string | undefined)[]) {
  return items.filter((i) => i !== undefined).join("\n\n");
}
