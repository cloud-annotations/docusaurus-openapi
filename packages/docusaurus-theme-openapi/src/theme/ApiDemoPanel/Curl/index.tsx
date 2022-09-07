/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import React, { useRef, useState, useEffect } from "react";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
// @ts-ignore
import codegen from "postman-code-generators";
import sdk from "postman-collection";
import Highlight, { defaultProps } from "prism-react-renderer";

import { useTypedSelector } from "../hooks";
import buildPostmanRequest from "./../buildPostmanRequest";
import FloatingButton from "./../FloatingButton";
import {
  getIconForLanguage,
  languageMenuItems,
  languageTabItems,
} from "./language-set";
import styles from "./styles.module.css";

interface Language {
  tabName: string;
  highlight: string;
  language: string;
  variant: string;
  options: { [key: string]: boolean };
}

const languageTheme = {
  plain: {
    color: "var(--ifm-code-color)",
  },
  styles: [
    {
      types: ["inserted", "attr-name"],
      style: {
        color: "var(--openapi-code-green)",
      },
    },
    {
      types: ["string", "url"],
      style: {
        color: "var(--openapi-code-green)",
      },
    },
    {
      types: ["builtin", "char", "constant", "function"],
      style: {
        color: "var(--openapi-code-blue)",
      },
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "var(--openapi-code-dim)",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "var(--openapi-code-orange)",
      },
    },
    {
      types: ["tag", "arrow", "keyword"],
      style: {
        color: "var(--openapi-code-purple)",
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "var(--openapi-code-red)",
      },
    },
  ],
};

interface Props {
  postman: sdk.Request;
  codeSamples: any; // TODO: Type this...
}

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  lineHeight: "1.25",
}));

function Curl({ postman, codeSamples }: Props) {
  // TODO: match theme for vscode.

  const { siteConfig } = useDocusaurusContext();

  const [copyText, setCopyText] = useState("Copy");

  const contentType = useTypedSelector((state) => state.contentType.value);
  const accept = useTypedSelector((state) => state.accept.value);
  const server = useTypedSelector((state) => state.server.value);
  const body = useTypedSelector((state) => state.body);

  const pathParams = useTypedSelector((state) => state.params.path);
  const queryParams = useTypedSelector((state) => state.params.query);
  const cookieParams = useTypedSelector((state) => state.params.cookie);
  const headerParams = useTypedSelector((state) => state.params.header);

  const auth = useTypedSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // TODO
  const langs = [
    ...((siteConfig?.themeConfig?.languageTabs as Language[] | undefined) ?? [
      ...languageMenuItems,
      ...languageTabItems,
    ]),
    ...codeSamples,
  ];

  const [language, setLanguage] = useState(langs[0]);
  const [activeMenuLanguage, setActiveMenuLanguage] = useState(
    languageMenuItems[0]
  );

  const [codeText, setCodeText] = useState("");

  useEffect(() => {
    if (language && !!language.options) {
      const postmanRequest = buildPostmanRequest(postman, {
        queryParams,
        pathParams,
        cookieParams,
        contentType,
        accept,
        headerParams,
        body,
        server,
        auth,
      });

      codegen.convert(
        language.language,
        language.variant,
        postmanRequest,
        language.options,
        (error: any, snippet: string) => {
          if (error) {
            return;
          }
          setCodeText(snippet);
        }
      );
    } else if (language && !!language.source) {
      setCodeText(language.source);
    } else {
      setCodeText("");
    }
  }, [
    accept,
    body,
    contentType,
    cookieParams,
    headerParams,
    language,
    pathParams,
    postman,
    queryParams,
    server,
    auth,
  ]);

  const ref = useRef<HTMLDivElement>(null);

  const handleCurlCopy = () => {
    setCopyText("Copied");
    setTimeout(() => {
      setCopyText("Copy");
    }, 2000);
    if (ref.current?.innerText) {
      navigator.clipboard.writeText(ref.current.innerText);
    }
  };

  if (language === undefined) {
    return null;
  }

  const activeMenuIcon = getIconForLanguage(activeMenuLanguage.language);

  return (
    <>
      <div className={clsx(styles.buttonGroup, "api-code-tab-group")}>
        {languageTabItems.map((lang) => {
          const icon = getIconForLanguage(lang.language);
          return (
            <button
              key={lang.tabName}
              className={clsx(
                language === lang ? styles.selected : undefined,
                language === lang ? "api-code-tab--active" : undefined,
                "api-code-tab"
              )}
              onClick={() => setLanguage(lang)}
            >
              {icon && <div className={styles.apiCodeTabIcon}>{icon}</div>}
              {lang.tabName}
            </button>
          );
        })}
        {activeMenuLanguage && (
          <button
            className={clsx(
              language === activeMenuLanguage ? styles.selected : undefined,
              language === activeMenuLanguage
                ? "api-code-tab--active"
                : undefined,
              "api-code-tab"
            )}
            onClick={() => setLanguage(activeMenuLanguage)}
          >
            {activeMenuIcon && (
              <div className={styles.apiCodeTabIcon}>{activeMenuIcon}</div>
            )}
            {activeMenuLanguage.tabName}
          </button>
        )}
        <IconButton
          className="api-code-tab"
          aria-label="more"
          id="language-set-button"
          aria-controls={open ? "language-set-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="language-set-menu"
          MenuListProps={{
            "aria-labelledby": "language-set-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: "20ch",
            },
          }}
        >
          {languageMenuItems.map((lang) => {
            const icon = getIconForLanguage(lang.language);
            return (
              <MenuItem
                key={lang.tabName}
                onClick={() => {
                  setLanguage(lang);
                  setActiveMenuLanguage(lang);
                }}
              >
                {icon && <div className={styles.apiCodeTabIcon}>{icon}</div>}
                {lang.tabName}
              </MenuItem>
            );
          })}
        </Menu>
      </div>

      <Highlight
        {...defaultProps}
        theme={languageTheme}
        code={codeText}
        language={language.highlight || language.lang}
      >
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <FloatingButton onClick={handleCurlCopy} label={copyText}>
            <pre
              className={className}
              style={{
                background: "var(--openapi-card-background-color)",
                paddingRight: "60px",
                borderRadius:
                  "2px 2px var(--openapi-card-border-radius) var(--openapi-card-border-radius)",
              }}
            >
              <code ref={ref}>
                {tokens.map((line, i) => (
                  <span {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => {
                      if (token.types.includes("arrow")) {
                        token.types = ["arrow"];
                      }
                      return <span {...getTokenProps({ token, key })} />;
                    })}
                    {"\n"}
                  </span>
                ))}
              </code>
            </pre>
          </FloatingButton>
        )}
      </Highlight>
    </>
  );
}

export default Curl;
