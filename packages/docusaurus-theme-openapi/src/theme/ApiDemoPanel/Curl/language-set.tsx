/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React from "react";

// @ts-ignore
import codegen from "postman-code-generators";

import CIcon from "./icons/c.svg";
import CSharpIcon from "./icons/csharp.svg";
import CurlIcon from "./icons/curl.svg";
import DartIcon from "./icons/dart.svg";
import GoIcon from "./icons/go.svg";
import HttpIcon from "./icons/http.svg";
import JavaIcon from "./icons/java.svg";
import JavascriptIcon from "./icons/javascript.svg";
import NodeJsIcon from "./icons/nodejs.svg";
import ObjectiveCIcon from "./icons/objectivec.svg";
import OCamlLogo from "./icons/ocaml.svg";
import PHPIcon from "./icons/php.svg";
import PowershellIcon from "./icons/powershell.svg";
import PythonIcon from "./icons/python.svg";
import RubyIcon from "./icons/ruby.svg";
import ShellIcon from "./icons/shell.svg";
import SwiftIcon from "./icons/swift.svg";

interface Language {
  tabName: string;
  highlight: string;
  language: string;
  variant: string;
  options: { [key: string]: boolean };
}

function getOptionsForLanguage(language: string) {
  switch (language) {
    case "curl":
      return {
        longFormat: false,
        followRedirect: true,
        trimRequestBody: true,
      };
    case "nodejs":
      return {
        ES6_enabled: true,
        followRedirect: true,
        trimRequestBody: true,
      };
    case "go":
      return {
        followRedirect: true,
        trimRequestBody: true,
      };
    case "python":
      return {
        followRedirect: true,
        trimRequestBody: true,
      };
    default:
      return {};
  }
}

const DEFAULT_TOP_LANGUAGES = ["shell", "nodejs", "ruby", "php"];

/**

var clientrect = temp1.getBBox();
var viewBox = clientrect.x+' '+clientrect.y+' '+clientrect.width+' '+clientrect.height;
console.log(viewBox);

*/

const availableLanguages: Language[] = codegen
  .getLanguageList()
  .map((language: any) => {
    console.log("language", language);
    return {
      tabName: language.name ?? language.label,
      highlight: language.syntax_mode,
      language: language.key,
      variant: language.variants[0]?.key ?? "",
      options: getOptionsForLanguage(language.key),
    };
  });

export const languageTabItems = availableLanguages.filter((language) =>
  DEFAULT_TOP_LANGUAGES.includes(language.language)
);

export const languageMenuItems = availableLanguages.filter(
  (language) => !DEFAULT_TOP_LANGUAGES.includes(language.language)
);

export const getIconForLanguage = (language: string): JSX.Element | null => {
  switch (language) {
    case "curl":
      return <CurlIcon />;
    case "c":
      return <CIcon />;
    case "csharp":
      return <CSharpIcon />;
    case "dart":
      return <DartIcon />;
    case "http":
      return <HttpIcon />;
    case "go":
      return <GoIcon />;
    case "java":
      return <JavaIcon />;
    case "javascript":
      return <JavascriptIcon />;
    case "nodejs":
      return <NodeJsIcon />;
    case "objective-c":
      return <ObjectiveCIcon />;
    case "ocaml":
      return <OCamlLogo />;
    case "php":
      return <PHPIcon />;
    case "powershell":
      return <PowershellIcon />;
    case "python":
      return <PythonIcon />;
    case "ruby":
      return <RubyIcon />;
    case "shell":
      return <ShellIcon />;
    case "swift":
      return <SwiftIcon />;
  }
  return null;
};
