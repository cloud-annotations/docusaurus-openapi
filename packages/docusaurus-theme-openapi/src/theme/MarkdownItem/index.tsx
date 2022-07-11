/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { PageMetadata } from "@docusaurus/theme-common";
import DocPaginator from "@theme/DocPaginator";
import MDXContent from "@theme/MDXContent";
import clsx from "clsx";

import styles from "../ApiItem/styles.module.css";

export default function MarkdownItem(props: any) {
  const { content: MDXPageContent } = props;
  const {
    metadata: { title, description, frontMatter, previous, next },
  } = MDXPageContent;
  const { image, keywords } = frontMatter;

  return (
    <>
      <PageMetadata {...{ title, description, keywords, image }} />

      <div className="row">
        <div className="col">
          <div className={styles.apiItemContainer}>
            <article>
              <div className={clsx("theme-api-markdown", "markdown")}>
                <MDXContent>
                  <MDXPageContent />
                </MDXContent>
              </div>
            </article>
            <DocPaginator previous={previous} next={next} />
          </div>
        </div>
      </div>
    </>
  );
}
