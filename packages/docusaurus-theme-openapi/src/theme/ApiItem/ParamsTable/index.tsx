/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { ParameterObject } from "docusaurus-plugin-openapi/src/openapi/types";
import type { ApiItem } from "docusaurus-plugin-openapi/src/types";

import ContentSection from "../ContentSection";
import styles from "./styles.module.css";

interface Props {
  parameters: ApiItem["parameters"];
  type: "path" | "query" | "header" | "cookie";
  title: string;
}

function renderSchema(schema: ParameterObject["schema"]): JSX.Element | null {
  if (!schema?.items) {
    return null;
  }
  if (schema.items.enum) {
    return (
      <div>
        <strong>
          Possible values: [
          {schema.items.enum.map((value, index) => (
            <React.Fragment key={index}>
              <code>{value}</code>
              {index !== schema.items!.enum!.length - 1 && ", "}
            </React.Fragment>
          ))}
          ]
        </strong>
      </div>
    );
  }
  return null;
}

function getSchemaQualifiedType(schema: ParameterObject["schema"]): string {
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
            {renderSchema(param.schema)}
            <div>{param.description}</div>
          </div>
        </div>
      ))}
    </ContentSection>
  );
}

export default ParamsTable;
