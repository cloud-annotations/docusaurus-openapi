/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import styles from "./styles.module.css";

interface Props {
  /**
   * The title of the section.
   */
  title: string;
  children?: React.ReactNode;
}

/**
 * Renders a section with a title and optional content.
 */
function ContentSection({ title, children }: Props): JSX.Element {
  return (
    <>
      <header className={styles.sectionHeader}>
        <strong className={styles.sectionHeaderTitle}>{title}</strong>
      </header>
      <div className={styles.sectionContent}>{children}</div>
    </>
  );
}

export default ContentSection;
