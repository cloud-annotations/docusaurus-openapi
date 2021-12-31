/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import styles from "./styles.module.css";

interface Props {
  label: string;
  type?: string;
  children?: React.ReactNode;
}

function FormItem({ label, type, children }: Props) {
  return (
    <div className={styles.formItem}>
      <code>{label}</code>
      {type && <span style={{ opacity: 0.6 }}> — {type}</span>}
      <div>{children}</div>
    </div>
  );
}

export default FormItem;
