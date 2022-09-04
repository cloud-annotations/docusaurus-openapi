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

  // enum is a reserved word
  const { minLength, enum: objectEnum } = object;

  if (objectEnum) {
    return (
      <div>
        Possible values: [
        {objectEnum.map((value, index) => (
          <React.Fragment key={index}>
            <code>{value}</code>
            {index !== objectEnum!.length - 1 && ", "}
          </React.Fragment>
        ))}
        ]
      </div>
    );
  }
  if (minLength !== undefined) {
    return <div>Possible values: {minLength} ≤ length</div>;
  }
  return null;
}

export default SchemaObject;
