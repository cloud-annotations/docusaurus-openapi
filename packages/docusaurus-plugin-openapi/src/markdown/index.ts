/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { escape } from "lodash";

import { ApiPageMetadata, InfoPageMetadata } from "../types";
import { createComponentImports } from "./createComponentImports";
import { createDeprecationNotice } from "./createDeprecationNotice";
import { createDescription } from "./createDescription";
import { createHeader } from "./createHeader";
import { createParamsTable } from "./createParamsTable";
import { createRequestBodyTable } from "./createRequestBodyTable";
import { createStatusCodesTable } from "./createStatusCodesTable";
import { createVersionBadge } from "./createVersionBadge";
import { render } from "./utils";

export function createApiPageMD({ title, api }: ApiPageMetadata) {
  const {
    deprecated,
    "x-deprecated-description": deprecatedDescription,
    parameters,
    requestBody,
    responses,
  } = api;
  return render([
    createComponentImports(),
    createHeader(title, api),
    createDeprecationNotice({ deprecated, description: deprecatedDescription }),
    createParamsTable({ parameters, type: "path", title: "Path Params" }),
    createParamsTable({ parameters, type: "query", title: "Query Params" }),
    createParamsTable({ parameters, type: "header", title: "Headers" }),
    createParamsTable({ parameters, type: "cookie", title: "Cookies" }),
    createRequestBodyTable({ requestBody }),
    createStatusCodesTable({ responses }),
  ]);
}

export function createInfoPageMD({
  info: { title, version, description },
}: InfoPageMetadata) {
  return render([
    createVersionBadge(version),
    `# ${escape(title)}\n\n`,
    createDescription(description),
  ]);
}
