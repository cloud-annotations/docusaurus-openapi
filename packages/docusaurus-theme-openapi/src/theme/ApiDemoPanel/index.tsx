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

import { ThemeConfig } from "../../types";
import Accept from "./Accept";
import Authorization from "./Authorization";
import Body from "./Body";
import Curl from "./Curl";
import Execute from "./Execute";
import ParamOptions from "./ParamOptions";
import Response from "./Response";
import Server from "./Server";
import styles from "./styles.module.css";

function ApiDemoPanel({ item }: { item: NonNullable<Metadata["api"]> }) {
  const { siteConfig } = useDocusaurusContext();
  const themeConfig = siteConfig.themeConfig as ThemeConfig;
  const options = themeConfig.api;

  const postman = new sdk.Request(item.postman);

  return (
    <div style={{ marginTop: "3.5em" }}>
      <Authorization />

      {item.operationId !== undefined && (
        <div style={{ marginBottom: "var(--ifm-table-cell-padding)" }}>
          <code>
            <b>{item.operationId}</b>
          </code>
        </div>
      )}

      <div className={styles.optionsPanel}>
        <ParamOptions />
        <Body
          jsonRequestBodyExample={item.jsonRequestBodyExample}
          requestBodyMetadata={item.requestBody}
        />
        <Accept />
      </div>

      <Server />

      <Curl
        postman={postman}
        codeSamples={(item as any)["x-code-samples"] ?? []}
      />

      <Execute postman={postman} proxy={options?.proxy} />

      <Response />
    </div>
  );
}

export default ApiDemoPanel;
