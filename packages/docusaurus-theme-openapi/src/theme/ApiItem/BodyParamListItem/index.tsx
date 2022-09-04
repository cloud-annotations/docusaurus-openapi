/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { SchemaObject as OpenApiSchemaObject } from "docusaurus-plugin-openapi/src/openapi/types";

import { getSchemaQualifiedType } from "../../../utils";
import ListItem from "../ListItem";
import styles from "./styles.module.css";

interface Props {
  propertyName: string;
  required?: boolean;
  schema: OpenApiSchemaObject;
  paramType?: string;
  children?: React.ReactNode;
}

function BodyParamListItem({
  propertyName,
  required,
  schema,
  children,
}: Props): JSX.Element | null {
  return (
    <ListItem>
      <div className={styles.propertySection}>
        <div className={styles.paramHeader}>
          <strong>{propertyName}</strong>
          <span className={styles.paramType}>
            {getSchemaQualifiedType(schema)}
          </span>
          {required && <div className={styles.paramRequired}>required</div>}
        </div>
        {/* Renders the description, schema object and nested properties */}
        {children}
      </div>
    </ListItem>
  );
}

export default BodyParamListItem;
