import {INCREMENT, DECREMENT} from '../formAdvanced/actionType'

const increment = () => {
    return {
     type: INCREMENT
    }
}

const decrement = () => {
    return {
     type: DECREMENT
    }
}


export {increment, decrement }