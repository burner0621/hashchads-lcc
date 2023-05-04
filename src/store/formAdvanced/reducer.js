import {INCREMENT, DECREMENT} from '../formAdvanced/actionType';

const initialState = {
    value: 0,
};

const changeNumber = (state = initialState, action) => {

    if(action.type === INCREMENT){
        return {
            ...state,
            value: state.value + 1
        };

    }else if(action.type === DECREMENT){
        return {
            ...state,
            value: state.value - 1
        };

    }else{
        return state;
    }

}

export default changeNumber;

// Export To rootReducer.js Component