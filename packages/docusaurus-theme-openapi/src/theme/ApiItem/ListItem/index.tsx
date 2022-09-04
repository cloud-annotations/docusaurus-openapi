/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import styles from "./styles.module.css";

interface Props {
  children?: React.ReactNode;
}

function ListItem({ children }: Props): JSX.Element {
  return (
    <div className={styles.listItem}>
      <div className={styles.listItemLabel}>{children}</div>
    </div>
  );
}

export default ListItem;
