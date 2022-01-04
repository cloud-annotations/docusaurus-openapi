/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, { useState } from "react";

import Editor, { Monaco } from "@monaco-editor/react";
import useThemeContext from "@theme/hooks/useThemeContext";

import styles from "./styles.module.css";

interface Props {
  value?: string;
  language?: string;
  onChange(value: string): any;
}

function VSCode({ value, language, onChange }: Props) {
  const [focused, setFocused] = useState(false);

  const { isDarkTheme } = useThemeContext();

  function handleEditorWillMount(monaco: Monaco) {
    const styles = getComputedStyle(document.documentElement);
    function getColor(property: string) {
      // Weird chrome bug, returns " #ffffff " instead of "#ffffff", see: https://github.com/cloud-annotations/docusaurus-openapi/issues/144
      return styles.getPropertyValue(property).trim();
    }

    const LIGHT_BRIGHT = "#1c1e21";
    const LIGHT_SELECT = "#ebedef";

    const DARK_BRIGHT = "#f5f6f7";
    const DARK_SELECT = "#515151";

    const DIM = getColor("--openapi-code-dim");
    const BLUE = getColor("--openapi-code-blue");
    const GREEN = getColor("--openapi-code-green");
    const BACKGROUND = getColor("--openapi-monaco-background-color");

    monaco.editor.defineTheme("OpenApiDark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: DARK_BRIGHT },
        { token: "string.key.json", foreground: DARK_BRIGHT },
        { token: "string.value.json", foreground: GREEN },
        { token: "number", foreground: BLUE },
        { token: "keyword.json", foreground: BLUE },
        { token: "delimiter", foreground: DIM },
        { token: "tag.xml", foreground: DIM },
        { token: "metatag.xml", foreground: DIM },
        { token: "attribute.name.xml", foreground: DARK_BRIGHT },
        { token: "attribute.value.xml", foreground: GREEN },
        { token: "metatag.xml", foreground: BLUE },
        { token: "tag.xml", foreground: BLUE },
      ],
      colors: {
        "editor.background": BACKGROUND,
        "editor.lineHighlightBackground": BACKGROUND,
        "editorBracketMatch.background": BACKGROUND,
        "editorBracketMatch.border": BACKGROUND,
        "editor.selectionBackground": DARK_SELECT,
      },
    });
    monaco.editor.defineTheme("OpenApiLight", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "", foreground: LIGHT_BRIGHT },
        { token: "string.key.json", foreground: LIGHT_BRIGHT },
        { token: "string.value.json", foreground: GREEN },
        { token: "number", foreground: BLUE },
        { token: "keyword.json", foreground: BLUE },
        { token: "delimiter", foreground: DIM },
        { token: "tag.xml", foreground: DIM },
        { token: "metatag.xml", foreground: DIM },
        { token: "attribute.name.xml", foreground: LIGHT_BRIGHT },
        { token: "attribute.value.xml", foreground: GREEN },
        { token: "metatag.xml", foreground: BLUE },
        { token: "tag.xml", foreground: BLUE },
      ],
      colors: {
        "editor.background": BACKGROUND,
        "editor.lineHighlightBackground": BACKGROUND,
        "editorBracketMatch.background": BACKGROUND,
        "editorBracketMatch.border": BACKGROUND,
        "editor.selectionBackground": LIGHT_SELECT,
      },
    });
  }

  return (
    <div className={focused ? styles.monacoFocus : styles.monaco}>
      <Editor
        value={value}
        language={language}
        theme={isDarkTheme ? "OpenApiDark" : "OpenApiLight"}
        beforeMount={handleEditorWillMount}
        options={{
          lineNumbers: "off",
          scrollBeyondLastLine: false,
          scrollBeyondLastColumn: 3,
          readOnly: false,
          minimap: { enabled: false },
          fontFamily:
            "SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
          fontSize: 14.4,
          overviewRulerLanes: 0,
          folding: false,
          lineDecorationsWidth: 0,
          contextmenu: false,
          scrollbar: {
            horizontal: "hidden",
          },
        }}
        onMount={(editor) => {
          editor.onDidFocusEditorText(() => {
            setFocused(true);
          });
          editor.onDidBlurEditorText(() => {
            setFocused(false);
          });
          editor.onDidChangeModelDecorations(() => {
            updateEditorHeight(); // typing
            requestAnimationFrame(updateEditorHeight); // folding
          });

          let prevHeight = 0;

          const updateEditorHeight = () => {
            onChange(editor.getValue());
            const editorElement = editor.getDomNode();

            if (!editorElement) {
              return;
            }

            const lineHeight = 22;
            const lineCount = editor.getModel()?.getLineCount() || 1;
            const height =
              editor.getTopForLineNumber(lineCount + 1) + lineHeight;

            const clippedHeight = Math.min(height, 500);

            if (prevHeight !== clippedHeight) {
              prevHeight = clippedHeight;
              editorElement.style.height = `${clippedHeight}px`;
              editor.layout();
            }
          };

          updateEditorHeight();
        }}
      />
    </div>
  );
}

export default VSCode;
