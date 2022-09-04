/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { RequestBodyObject } from "../openapi/types";
import { create } from "./utils";

interface Props {
  requestBody?: RequestBodyObject;
}

export function createRequestBodyTable({ requestBody }: Props) {
  if (requestBody === undefined) {
    return undefined;
  }
  return create("RequestBodyTable", {
    requestBody,
    children: [],
  });
}
