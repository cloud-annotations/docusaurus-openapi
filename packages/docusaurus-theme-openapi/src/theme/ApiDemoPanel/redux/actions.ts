/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { useDispatch } from "react-redux";

export const types = {
  setAuth: "SET_AUTH",
  setSelectedAuthID: "SET_SELECTED_AUTH_ID",
};

export function useActions() {
  const dispatch = useDispatch();

  function setAuth(auth: any) {
    dispatch({ type: types.setAuth, auth });
  }

  function setSelectedAuthID(selectedAuthID: string) {
    dispatch({ type: types.setSelectedAuthID, selectedAuthID });
  }

  return {
    setAuth,
    setSelectedAuthID,
  };
}
