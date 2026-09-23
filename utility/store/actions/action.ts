import { callApi, IApiErrorResponse } from "@/utility/api/callApi";
import { SAVE_USER_DATA } from "../types";
import { API_ENDPOINT, API_URL } from "@/utility/api/constants";
import { AppDispatch } from "..";
import { showToastNotification } from "@/utility/helper";

/**
 * Async action to fetch and save the current user data.
 * Dispatches SAVE_USER_DATA with the retrieved user details if successful.
 */
export const saveUserData = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await callApi(API_URL + API_ENDPOINT.currentUser, {
        method: "GET",
      });
      if (response.status) {
        dispatch({
          type: SAVE_USER_DATA,
          payload: response.data,
        });
      }
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        showToastNotification("danger", (error as IApiErrorResponse).message);
      } else {
        showToastNotification("danger", "Something went wrong");
      }
    }
  };
};
