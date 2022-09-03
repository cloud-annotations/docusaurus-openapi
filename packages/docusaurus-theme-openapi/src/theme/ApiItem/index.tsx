/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { PageMetadata } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Store } from "@reduxjs/toolkit";
import type { Props } from "@theme/ApiItem";
import DocPaginator from "@theme/DocPaginator";
import clsx from "clsx";
import { ParameterObject } from "docusaurus-plugin-openapi/src/openapi/types";
import { Provider } from "react-redux";

import { ThemeConfig } from "../../types";
import { createAuth } from "../ApiDemoPanel/Authorization/slice";
import { createPersistanceMiddleware } from "../ApiDemoPanel/persistanceMiddleware";
import { createServer } from "../ApiDemoPanel/Server/slice";
import { createStoreWithState } from "../ApiDemoPanel/store";
import styles from "./styles.module.css";

let ApiDemoPanel = (_: { item: any }) => <div style={{ marginTop: "3.5em" }} />;
if (ExecutionEnvironment.canUseDOM) {
  ApiDemoPanel = require("@theme/ApiDemoPanel").default;
}

function ApiItem(props: Props): JSX.Element {
  const { content: ApiContent } = props;
  const { metadata, frontMatter } = ApiContent;
  const { image, keywords } = frontMatter;
  const { description, title, api, previous, next } = metadata;

  const { siteConfig } = useDocusaurusContext();
  const themeConfig = siteConfig.themeConfig as ThemeConfig;
  const options = themeConfig.api;

  let store2!: Store;

  if (ExecutionEnvironment.canUseDOM) {
    const acceptArray = Array.from(
      new Set(
        Object.values(api?.responses ?? {})
          .map((response) => Object.keys(response.content ?? {}))
          .flat()
      )
    );

    const content = api?.requestBody?.content ?? {};

    const contentTypeArray = Object.keys(content);

    const servers = api?.servers ?? [];

    const params = {
      path: [] as ParameterObject[],
      query: [] as ParameterObject[],
      header: [] as ParameterObject[],
      cookie: [] as ParameterObject[],
    };

    api?.parameters?.forEach((param) => {
      params[param.in].push(param);
    });

    const auth = createAuth({
      security: api?.security,
      securitySchemes: api?.securitySchemes,
      options,
    });

    const server = createServer({
      servers,
      options,
    });

    const persistanceMiddleware = createPersistanceMiddleware(options);

    store2 = createStoreWithState(
      {
        accept: { value: acceptArray[0], options: acceptArray },
        contentType: { value: contentTypeArray[0], options: contentTypeArray },
        server: server,
        response: { value: undefined },
        body: { type: "empty" },
        params,
        auth,
      },
      [persistanceMiddleware]
    );
  }

  return (
    <>
      <PageMetadata {...{ title, description, keywords, image }} />
      {ExecutionEnvironment.canUseDOM && (
        <Provider store={store2}>
          <div className="row">
            <div className="col">
              <div className={styles.apiItemContainer}>
                <article>
                  <div className={clsx("theme-api-markdown", "markdown")}>
                    <ApiContent />
                  </div>
                </article>

                <DocPaginator previous={previous} next={next} />
              </div>
            </div>
            <div className={clsx("col", api ? "col--5" : "col--3")}>
              {api && <ApiDemoPanel item={api} />}
            </div>
          </div>
        </Provider>
      )}
    </>
  );
}

export default ApiItem;
