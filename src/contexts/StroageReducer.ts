import _ from "lodash";
import { StorageInterface, initialState, Action } from "./StorageContext";

export function stroageReducer(state: StorageInterface, action: Action) {
    switch (action.type) {
        case 'increase': //login with user info
            return {
                ...state,
                totalAmount: action.payload
            }
        case 'setList':
            return {
                ...state,
                list: action.payload,
                totalAmount: _.sumBy(action.payload, (o) => o.total)
            }
        case 'setSelectedRecord':
            return {
                ...state,
                selectedRecord: action.payload
            }
        case 'unSetSelectedRecord':
            return {
                ...state,
                selectedRecord: initialState.selectedRecord
            }
        case 'init':
            return initialState;
        default:
            return state;
    }
}