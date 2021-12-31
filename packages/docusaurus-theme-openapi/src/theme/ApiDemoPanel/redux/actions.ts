/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import { useDispatch } from "react-redux";

export const types = {
  updateParam: "UPDATE_PARAM",
  setBody: "SET_BODY",
  setForm: "SET_FORM",
  setAuth: "SET_AUTH",
  setSelectedAuthID: "SET_SELECTED_AUTH_ID",
};

export function useActions() {
  const dispatch = useDispatch();

  function updateParam(param: any) {
    dispatch({ type: types.updateParam, param });
  }

  function setBody(body: any) {
    dispatch({ type: types.setBody, body });
  }

  function setForm(body: any) {
    dispatch({ type: types.setForm, body });
  }

  function setAuth(auth: any) {
    dispatch({ type: types.setAuth, auth });
  }

  function setSelectedAuthID(selectedAuthID: string) {
    dispatch({ type: types.setSelectedAuthID, selectedAuthID });
  }

  return {
    updateParam,
    setBody,
    setForm,
    setAuth,
    setSelectedAuthID,
  };
}
