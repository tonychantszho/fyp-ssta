import _ from "lodash";
import { StorageInterface, initialState, Action } from "./StorageContext";

export function stroageReducer(state: StorageInterface, action: Action) {
    switch (action.type) {
        case 'setTempTotal':
            return {
                ...state,
                tempNewRecordTotal: action.payload
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
        case 'setShoppingCart':
            return {
                ...state,
                shoppingCart: action.payload,
            }
        case 'setBookKeeping':
            return {
                ...state,
                bookKeeping: action.payload,
            }
        case 'setTempBookKeeping':
            return {
                ...state,
                tempBookKeeping: action.payload,
            }
        case 'init':
            return initialState;
        default:
            return state;
    }
}