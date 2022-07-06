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
    <article>
      <MDXContent>
        <MDXPageContent />
      </MDXContent>
    </article>
  );
}
