/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { PropsWithChildren, useState } from "react";

import clsx from "clsx";
import { useSelector } from "react-redux";

// @ts-ignore
import FloatingButton from "../FloatingButton";
// @ts-ignore
import FormItem from "../FormItem";
// @ts-ignore
import FormTextInput from "../FormTextInput";
import { useActions } from "../redux/actions";

type Props = PropsWithChildren<{
  mode: "locked" | "unlocked";
  onClick?(): any;
}>;

function LockButton({ mode, onClick, children }: Props) {
  return (
    <button
      className={clsx("button", "button--primary", {
        "button--outline": mode !== "locked",
      })}
      style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        marginBottom: "var(--ifm-spacing-vertical)",
      }}
      onClick={onClick}
    >
      <span>{children}</span>

      <svg
        style={{
          marginLeft: "12px",
          width: "18px",
          height: "18px",
          fill: "currentColor",
        }}
        viewBox="0 0 20 20"
        id={mode}
      >
        {mode === "locked" ? (
          <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8zM12 8H8V5.199C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8z"></path>
        ) : (
          <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path>
        )}
      </svg>
    </button>
  );
}

function Authorization() {
  const auth = useSelector((state: any) => state.auth);
  // const security = useSelector((state: any) => state.security);
  // const bearerToken = useSelector((state: any) => state.bearerToken);
  const { setAuth } = useActions();
  const [editing, setEditing] = useState(false);
  // const [basicMode, setBasicMode] = useState(true);
  // const [token, setToken] = useState(null);
  // const [password, setPassword] = useState(null);
  // const requiresAuthorization = security?.length > 0;

  console.log(auth);

  if (editing) {
    return (
      <button
        onClick={() => {
          setAuth(auth);
        }}
      >
        persist
      </button>
    );
  }

  // if (!requiresAuthorization) {
  //   return null;
  // }

  // if (editing) {
  //   return (
  //     <div style={{ display: "flex", flexDirection: "column" }}>
  //       <LockButton
  //         mode="unlocked"
  //         onClick={() => {
  //           setBearerToken(
  //             `${basicMode ? "Basic" : "Bearer"} ${
  //               basicMode ? btoa(`${token}:${password}`) : token
  //             }`
  //           );
  //           setEditing(false);
  //         }}
  //       >
  //         Save
  //       </LockButton>
  //       <FloatingButton
  //         onClick={() => setBasicMode((mode) => !mode)}
  //         label="Switch Mode"
  //       >
  //         <pre>
  //           {!basicMode ? (
  //             <FormItem label="Bearer Token">
  //               <FormTextInput
  //                 placeholder="Bearer Token"
  //                 value={token}
  //                 onChange={(e: any) => {
  //                   setToken(e.target.value);
  //                 }}
  //               />
  //             </FormItem>
  //           ) : (
  //             <>
  //               <FormItem label="Username">
  //                 <FormTextInput
  //                   placeholder="Username"
  //                   value={token}
  //                   onChange={(e: any) => {
  //                     setToken(e.target.value);
  //                   }}
  //                 />
  //               </FormItem>
  //               <FormItem label="Password">
  //                 <FormTextInput
  //                   password
  //                   placeholder="Password"
  //                   value={password}
  //                   onChange={(e: any) => {
  //                     setPassword(e.target.value);
  //                   }}
  //                 />
  //               </FormItem>
  //             </>
  //           )}
  //         </pre>
  //       </FloatingButton>
  //     </div>
  //   );
  // }

  // if (!!bearerToken) {
  //   return (
  //     <div style={{ display: "flex" }}>
  //       <LockButton
  //         mode="locked"
  //         onClick={() => {
  //           // clearSession();
  //           setEditing(true);
  //         }}
  //       >
  //         Authorized
  //       </LockButton>
  //     </div>
  //   );
  // }

  return (
    <div style={{ display: "flex" }}>
      <LockButton
        mode="unlocked"
        onClick={() => {
          setEditing(true);
        }}
      >
        Authorize
      </LockButton>
    </div>
  );
}

export default Authorization;
