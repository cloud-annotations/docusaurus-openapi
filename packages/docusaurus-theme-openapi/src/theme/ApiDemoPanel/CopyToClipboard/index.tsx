/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, { useState } from "react";

import CheckIcon from "@mui/icons-material/Check";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { useTypedSelector } from "../hooks";

function CopyToClipboard() {
  const [copyText, setCopyText] = useState("Copy");
  const value = useTypedSelector((state) => state.code.value);

  const handleCopy = () => {
    setCopyText("Copied");
    setTimeout(() => {
      setCopyText("Copy");
    }, 2000);
    navigator.clipboard.writeText(value);
  };

  return (
    <Tooltip title={copyText}>
      <IconButton
        style={{
          color: "currentColor",
        }}
        onClick={handleCopy}
      >
        {copyText === "Copied" ? <CheckIcon /> : <ContentPasteIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default CopyToClipboard;
