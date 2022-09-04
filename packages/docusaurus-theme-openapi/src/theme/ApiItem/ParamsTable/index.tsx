/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import type { ApiItem } from "docusaurus-plugin-openapi/src/types";

import { getSchemaQualifiedType } from "../../../utils";
import ContentSection from "../ContentSection";
import SchemaObject from "../SchemaObject";
import styles from "./styles.module.css";

interface Props {
  parameters: ApiItem["parameters"];
  type: "path" | "query" | "header" | "cookie";
  title: string;
}

function ParamsTable({ parameters, type, title }: Props): JSX.Element | null {
  if (parameters === undefined) {
    return null;
  }

  const params = parameters.filter((param) => param?.in === type);
  if (params.length === 0) {
    return null;
  }

  return (
    <ContentSection title={title}>
      {params.map((param, index) => (
        <div key={index} className={styles.paramContainer}>
          <div className={styles.paramHeader}>
            <label className={styles.paramName}>{param.name}</label>
            {param.schema && (
              <div className={styles.paramType}>
                {getSchemaQualifiedType(param.schema)}
              </div>
            )}
            {param.required && (
              <div className={styles.paramRequired}>required</div>
            )}
          </div>
          <div className={styles.paramDescription}>
            {param.schema && <SchemaObject items={param.schema.items} />}
            <div>{param.description}</div>
          </div>
        </div>
      ))}
    </ContentSection>
  );
}

export default ParamsTable;
