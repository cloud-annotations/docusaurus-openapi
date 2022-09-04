/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import ApiMethodPill from "../ApiMethodPill";
import styles from "./styles.module.css";

interface Props {
  method: string;
  path: string;
  serverUrl: string;
}

function MethodEndpoint({ method, path, serverUrl }: Props) {
  const url = serverUrl + path.replace(/{([a-z0-9-_]+)}/gi, ":$1");
  return (
    <div className={styles.headlineContainerArticleInfo}>
      <ApiMethodPill method={method} />
      <span className={styles.apiUrl} title={url}>
        {url}
      </span>
    </div>
  );
}

export default MethodEndpoint;
