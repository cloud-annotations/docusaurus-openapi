/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import styles from "./styles.module.css";

function styleForMethod(method: string): React.CSSProperties | undefined {
  switch (method.toLowerCase()) {
    case "get":
      return {
        background: "var(--openapi-api-method-get-background)",
        textShadow: "var(--openapi-api-method-get-shadow)",
      };
    case "put":
      return {
        background: "var(--openapi-api-method-put-background)",
        textShadow: "var(--openapi-api-method-put-shadow)",
      };
    case "post":
      return {
        background: "var(--openapi-api-method-post-background)",
        textShadow: "var(--openapi-api-method-post-shadow)",
      };
    case "delete":
      return {
        background: "var(--openapi-api-method-delete-background)",
        textShadow: "var(--openapi-api-method-delete-shadow)",
      };
    default:
      return undefined;
  }
}

interface Props {
  /**
   * The API method: GET, POST, PUT, DELETE, etc.
   */
  method: string;
}

/**
 * Displays a color coded pill with the method name.
 */
function ApiMethodPill({ method }: Props) {
  const methodToLower = method.toLowerCase();
  return (
    <span className={styles.apiMethod} style={styleForMethod(methodToLower)}>
      {method}
    </span>
  );
}

export default ApiMethodPill;
