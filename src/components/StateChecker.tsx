import state0 from '../image/state0.png';
import state1 from '../image/state1.png';
import state2 from '../image/state2.png';
import state3 from '../image/state3.png';
import state4 from '../image/state4.png';
import state5 from '../image/state5.png';

export const StateChecker = (record: number) => {
    let state: string = "";
    if (record == 0) {
        state = state0;
    } else if (record >= 1 && record < 4) {
        state = state1;
    } else if (record >= 4 && record < 10) {
        state = state2;
    } else if (record >= 10 && record < 15) {
        state = state3;
    } else if (record < 15 && record < 21) {
        state = state4;
    } else if (record >= 21) {
        state = state5;
    }
    return state;
};

