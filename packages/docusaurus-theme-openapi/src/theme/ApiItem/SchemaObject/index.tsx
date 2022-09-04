/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import type { SchemaObject as OpenApiSchemaObject } from "docusaurus-plugin-openapi/src/openapi/types";

interface Props {
  object?: OpenApiSchemaObject;
}

function SchemaObject({ object }: Props): JSX.Element | null {
  if (object === undefined) {
    return null;
  }
  if (object.enum) {
    return (
      <div>
        Possible values: [
        {object.enum.map((value, index) => (
          <React.Fragment key={index}>
            <code>{value}</code>
            {index !== object.enum!.length - 1 && ", "}
          </React.Fragment>
        ))}
        ]
      </div>
    );
  }
  return null;
}

export default SchemaObject;
