/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, { useState } from "react";

import {
  RequestBodyObject,
  SchemaObject as OpenApiSchemaObject,
} from "docusaurus-plugin-openapi/src/openapi/types";

import { getSchemaQualifiedType } from "../../../utils";
import { useTypedSelector } from "../../ApiDemoPanel/hooks";
import ContentSection from "../ContentSection";
import ListItem from "../ListItem";
import SchemaObject from "../SchemaObject";
import styles from "./styles.module.css";

interface Props {
  requestBody: RequestBodyObject;
}

interface SchemaTableProps {
  properties: { [key: string]: OpenApiSchemaObject } | undefined;
  /**
   * Indicates if the property is required. For request bodies,
   * this is specified in the `requestBody` object or at the individual
   * property level.
   */
  required?: boolean;
}

function renderSchemaTable({ properties, required }: SchemaTableProps) {
  if (properties === undefined) {
    return null;
  }
  return Object.keys(properties).map((propertyName: string) => {
    const section = properties[propertyName];
    const propertyRequired = required ?? section.required;
    return (
      <ListItem key={propertyName}>
        <div className={styles.propertySection}>
          <div className={styles.paramHeader}>
            <strong>{propertyName}</strong>
            <span className={styles.paramType}>
              {getSchemaQualifiedType(section)}
            </span>
            {propertyRequired && (
              <div className={styles.paramRequired}>required</div>
            )}
          </div>
          {section.description && <div>{section.description}</div>}
          {section.enum && <SchemaObject object={section} />}
          <div className={styles.propertyList}>
            {section.properties &&
              renderSchemaTable({ properties: section.properties })}
            {section.items &&
              renderSchemaTable({ properties: section.items.properties })}
          </div>
        </div>
      </ListItem>
    );
  });
}

function RequestBodyTable({ requestBody }: Props): JSX.Element | null {
  const selectedContentType = useTypedSelector(
    (state) => state.contentType.value
  );
  const [contentType] = useState(
    selectedContentType ?? Object.keys(requestBody?.content)[0]
  );

  if (requestBody === undefined) {
    return null;
  }

  const schema = requestBody.content[contentType]?.schema;
  const properties = requestBody.content[contentType]?.schema?.properties;

  return (
    <ContentSection title="Body params">
      {properties ? (
        renderSchemaTable({ properties, required: requestBody.required })
      ) : (
        <ListItem>
          <div className={styles.propertySection}>
            <div>
              <strong>{schema?.type}</strong>
              <span className={styles.paramType}>{schema?.format}</span>
            </div>
          </div>
        </ListItem>
      )}
    </ContentSection>
  );
}

export default RequestBodyTable;
