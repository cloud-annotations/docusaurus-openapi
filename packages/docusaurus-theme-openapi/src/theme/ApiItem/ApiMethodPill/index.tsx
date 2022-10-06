/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import clsx from "clsx";

import styles from "./styles.module.css";

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
    <span
      className={clsx(`openapi-method-pill-${methodToLower}`, styles.apiMethod)}
      style={{
        color: `var(--openapi-api-method-${methodToLower}-color)`,
      }}
    >
      {method}
    </span>
  );
}

export default ApiMethodPill;
