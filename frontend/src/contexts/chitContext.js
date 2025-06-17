import { createContext, useReducer } from "react";

export const ChitContext = createContext()

export const chitsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CHITS':
            return {
                chits: action.payload
            }
        case 'CREATE_CHIT':
            return {
                chits: [action.payload, ...state.chits]
            }
        case 'REMOVE_CHIT':
            return {
                chits: state.chits.filter(chit => chit._id !== action.payload)
            }
        default:
            return state
    }
}

export const ChitContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(chitsReducer, {
        chits: null
    })
    return (
        <ChitContext.Provider value={{...state, dispatch}}>
            {children}
        </ChitContext.Provider>
    )
}