/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import { useTypedSelector } from "../../ApiDemoPanel/hooks";
import MethodEndpoint from "../MethodEndpoint";
import styles from "./styles.module.css";

interface Props {
  title?: string;
  method: string;
  serverUrl: string;
  path: string;
  children?: React.ReactNode;
}

function Header({ title, method, path, children }: Props) {
  const value = useTypedSelector((state) => state.server.value);

  let serverUrl: string = "";

  if (value) {
    serverUrl = value.url.replace(/\/$/, "");
    if (value.variables) {
      Object.keys(value.variables).forEach((variable) => {
        serverUrl = serverUrl.replace(
          `{${variable}}`,
          value.variables?.[variable].storedValue ?? ""
        );
      });
    }
  }

  return (
    <header className={styles.apiDocHeader}>
      <h1>{title}</h1>
      <MethodEndpoint method={method} path={path} serverUrl={serverUrl} />
      <div role="doc-subtitle" className={styles.apiDocDescription}>
        {children}
      </div>
    </header>
  );
}

export default Header;
