/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { ThemeClassNames } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import DocPaginator from "@theme/DocPaginator";
import Seo from "@theme/Seo";
import clsx from "clsx";

import styles from "./styles.module.css";
import "./styles.css";

let ApiDemoPanel: any = () => <div />;
if (ExecutionEnvironment.canUseDOM) {
  ApiDemoPanel = require("@theme/ApiDemoPanel").default;
}

export default function ApiItem(props: any): JSX.Element {
  const { openapi, content: DocContent } = props;
  // const { metadata, frontMatter } = DocContent;
  // const { image, keywords } = frontMatter;
  // const { description, title } = metadata;

  // TODO: OLD
  const { siteConfig } = useDocusaurusContext();
  const { title: siteTitle } = siteConfig;

  const { summary, description, next, previous } = openapi;

  const title = summary ? `${summary} | ${siteTitle}` : siteTitle;

  const metadata = { next, previous };
  // OLD

  return (
    <>
      {/* TODO */}
      {/* <Seo {...{ title, description, keywords, image }} /> */}
      <Seo {...{ title, description }} />

      <div className="row">
        <div className="col">
          <div className={styles.docItemContainer}>
            <article>
              <div
                className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}
              >
                <DocContent />
              </div>
            </article>

            <DocPaginator metadata={metadata} />
          </div>
        </div>
        <div className="col col--5">
          <ApiDemoPanel item={openapi} />
        </div>
      </div>
    </>
  );
}
