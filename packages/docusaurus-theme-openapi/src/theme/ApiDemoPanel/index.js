/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import sdk from "postman-collection";
import { Provider } from "react-redux";

import Accept from "./Accept";
import Authorization from "./Authorization";
import Body from "./Body";
import Curl from "./Curl";
import Endpoint from "./Endpoint";
import Execute from "./Execute";
import MethodEndpoint from "./MethodEndpoint";
import ParamOptions from "./ParamOptions";
import init from "./redux/init";
import { createStoreWithState } from "./redux2/store";
import Response from "./Response";
import styles from "./styles.module.css";

function ApiDemoPanel({ item }) {
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

  const store2 = createStoreWithState({
    accept: { value: acceptArray[0], options: acceptArray },
    contentType: { value: contentTypeArray[0], options: contentTypeArray },
    old: init(item, options),
  });

  console.log(store2.getState());

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

        <MethodEndpoint />

        <div className={styles.optionsPanel}>
          <ParamOptions />
          <Body />
          <Accept />
        </div>

        <Endpoint />

        <Curl />

        <Execute />

        <Response />
      </div>
    </Provider>
  );
}

export default ApiDemoPanel;
