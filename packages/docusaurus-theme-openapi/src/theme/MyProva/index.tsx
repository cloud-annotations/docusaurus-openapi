import React from "react";
import clsx from "clsx";
import MDXContent from "@theme/MDXContent";
import TOC from "@theme/TOC";

import styles from "./styles.module.css";

export default function MyProva(props: any) {
  const { content: MDXPageContent } = props;
  const {
    metadata: { title, description, frontMatter },
  } = MDXPageContent;
  const { wrapperClassName, hide_table_of_contents: hideTableOfContents } =
    frontMatter;

  return (
    <>
      Ciao: <pre>{JSON.stringify(props, null, 2)}</pre>
      <pre>{Object.keys(props).join("\n")}</pre>
      <pre>{Object.keys(MDXPageContent).join("\n")}</pre>
      <main className="container container--fluid margin-vert--lg">
        <div className={clsx("row", styles.mdxPageWrapper)}>
          <div className={clsx("col", !hideTableOfContents && "col--8")}>
            <article>
              <MDXContent>
                <MDXPageContent />
              </MDXContent>
            </article>
          </div>
          {!hideTableOfContents && MDXPageContent.toc.length > 0 && (
            <div className="col col--2">
              <TOC
                toc={MDXPageContent.toc}
                minHeadingLevel={frontMatter.toc_min_heading_level}
                maxHeadingLevel={frontMatter.toc_max_heading_level}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
