import React from "react";
import clsx from "clsx";
import MDXContent from "@theme/MDXContent";
import DocPaginator from "@theme/DocPaginator";
import TOC from "@theme/TOC";

import styles from "../ApiItem/styles.module.css";
import { PageMetadata } from "@docusaurus/theme-common";

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
