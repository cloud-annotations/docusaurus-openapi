/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import type { ParameterObject } from "docusaurus-plugin-openapi/src/openapi/types";

/**
 * Returns the schema qualified type, e.g. "string" or "string[]".
 * @param schema The schema to get the type from.
 * @returns The schema qualified type.
 */
export function getSchemaQualifiedType(
  schema: ParameterObject["schema"]
): string {
  if (!schema) {
    return "";
  }
  if (schema.format) {
    return schema.format;
  }
  if (schema.type) {
    if (schema.type === "array") {
      if (schema.items?.type) {
        /**
         * Displays the type of the array items, e.g. "string[]".
         */
        return `${schema.items.type}[]`;
      }
      return schema.type;
    }
    return schema.type;
  }
  return "";
}
