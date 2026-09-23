import { IUserProfile } from "@/interface/user.model";
import { SAVE_USER_DATA, SAVE_SESSION_STATUS } from "../types";
interface IInitialState {
  userDetails: IUserProfile | null;
  isSessionExpired: boolean;
}
const initialState: IInitialState = {
  userDetails: null,
  isSessionExpired: false,
};
interface ISaveUserDataAction {
  type: typeof SAVE_USER_DATA;
  payload: IUserProfile;
  [key: string]: any;
}
interface ISaveSessionStatusAction {
  type: typeof SAVE_SESSION_STATUS;
  payload: boolean;
  [key: string]: any;
}
type TAction = ISaveUserDataAction | ISaveSessionStatusAction;
const reducers = (state = initialState, action: TAction) => {
  switch (action.type) {
    case SAVE_USER_DATA:
      return {
        ...state,
        userDetails: action.payload,
      };
    case SAVE_SESSION_STATUS:
      return {
        ...state,
        isSessionExpired: action?.payload,
      };
    default:
      return state;
  }
};
export default reducers;
