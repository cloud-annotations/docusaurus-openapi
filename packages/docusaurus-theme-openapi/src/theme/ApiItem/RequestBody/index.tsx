/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

import clsx from "clsx";

import { useTypedSelector } from "../../ApiDemoPanel/hooks";
import styles from "./styles.module.css";

interface Props {
  contentType: string;
  children?: React.ReactNode;
}

function RequestBody({ contentType, children }: Props): JSX.Element {
  const selectedContentType = useTypedSelector(
    (state) => state.contentType.value
  );

  const active = selectedContentType === contentType;

  return (
    <div
      className={clsx(
        styles.apiRequestBody,
        active ? styles.apiRequestBodyVisible : undefined
      )}
    >
      {children}
    </div>
  );
}

export default RequestBody;
