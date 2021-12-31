/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Metadata } from "@theme/ApiItem";
import sdk from "postman-collection";
import { Provider } from "react-redux";

import Accept from "./Accept";
import Authorization from "./Authorization";
// @ts-ignore
import Body from "./Body";
// @ts-ignore
import Curl from "./Curl";
// @ts-ignore
import Execute from "./Execute";
import MethodEndpoint from "./MethodEndpoint";
// @ts-ignore
import ParamOptions from "./ParamOptions";
import init from "./redux/init";
import Response from "./Response";
import Server from "./Server";
import { createStoreWithState } from "./store";
import styles from "./styles.module.css";

function ApiDemoPanel({ item }: { item: NonNullable<Metadata["api"]> }) {
  const { siteConfig } = useDocusaurusContext();
  const { api: options } = siteConfig.themeConfig;

  item.postman = new sdk.Request(item.postman);

  const acceptArray = Array.from(
    new Set(
      Object.values(item.responses)
        .map((response) => Object.keys(response.content ?? {}))
        .flat()
    )
  );

  const content = item.requestBody?.content ?? {};

  const contentTypeArray = Object.keys(content);

  const servers = item.servers ?? [];

  const store2 = createStoreWithState({
    accept: { value: acceptArray[0], options: acceptArray },
    contentType: { value: contentTypeArray[0], options: contentTypeArray },
    server: { value: servers[0], options: servers },
    response: { value: undefined },
    old: init(item, options as any),
  });

  const { path, method } = item;

  return (
    <Provider store={store2}>
      <div style={{ marginTop: "3.5em" }}>
        <Authorization />

        {item.operationId !== undefined && (
          <div style={{ marginBottom: "var(--ifm-table-cell-padding)" }}>
            <code>
              <b>{item.operationId}</b>
            </code>
          </div>
        )}

        <MethodEndpoint method={method} path={path} />

        <div className={styles.optionsPanel}>
          <ParamOptions />
          <Body />
          <Accept />
        </div>

        <Server />

        <Curl />

        <Execute />

        <Response />
      </div>
    </Provider>
  );
}

export default ApiDemoPanel;
