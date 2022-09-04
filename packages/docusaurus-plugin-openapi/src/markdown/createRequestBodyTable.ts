/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import type { RequestBodyObject, SchemaObject } from "../openapi/types";
import { createDescription } from "./createDescription";
import { create, guard } from "./utils";

interface Props {
  requestBody?: RequestBodyObject;
}

function createBodyParamListItem(
  properties: SchemaObject["properties"]
): string[] | undefined {
  if (properties === undefined) {
    return undefined;
  }
  return Object.keys(properties).map((prop) => {
    const section = properties![prop];
    return create("BodyParamListItem", {
      propertyName: prop,
      required: section.required,
      schema: section,
      children: [
        create("SchemaObject", {
          object: section,
          children: [],
        }),
        createDescription(section.description),
        guard(section.properties || section.items, () => {
          return create("div", {
            children: [
              guard(section.properties, () => {
                return createBodyParamListItem(section.properties);
              }),
              guard(section.items, () => {
                return createBodyParamListItem(section.items?.properties);
              }),
            ],
          });
        }),
      ],
    });
  });
}

export function createRequestBodyTable({ requestBody }: Props) {
  if (requestBody === undefined) {
    return undefined;
  }
  return create("ContentSection", {
    title: "Body params",
    children: Object.keys(requestBody.content).map((contentType) => {
      const { schema } = requestBody.content[contentType];
      return create("RequestBody", {
        contentType: contentType,
        children: schema?.properties
          ? createBodyParamListItem(schema.properties)
          : create("BodyParamListItem", {
              propertyName: schema?.type,
              schema: schema,
              children: [],
            }),
      });
    }),
  });
}
