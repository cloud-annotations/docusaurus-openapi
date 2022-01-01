/* ============================================================================
 * Copyright (c) Cloud Annotations
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * ========================================================================== */

import produce from "immer";

import { types } from "./actions";
import { persistAuth, persistSelectedAuth } from "./persistance";

const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.setAuth: {
      //  TODO: This is a side effect and shouldn't be done here.
      persistAuth({
        security: action.auth,
        persistance: draft.options.authPersistance,
      });
      draft.auth = action.auth;
      break;
    }
    case types.setSelectedAuthID: {
      //  TODO: This is a side effect and shouldn't be done here.
      persistSelectedAuth({
        key: draft._uniqueAuthKey,
        selectedAuthID: action.selectedAuthID,
        persistance: draft.options.authPersistance,
      });
      draft.selectedAuthID = action.selectedAuthID;
      break;
    }
    default:
      break;
  }
});

export default reducer;
