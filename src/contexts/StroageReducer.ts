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
                list: action.payload
            }
        case 'setSelectedRecordId':
            return {
                ...state,
                selectedRecordId: action.payload
            }
        case 'init':
            return initialState;
        default:
            return state;
    }
}