import { createContext, useReducer } from "react";

export const FollowContext = createContext()

export const followReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FOLLOW':
            return {
                following: action.payload
            }
        case 'ADD_FOLLOW':
            return {
                following: [action.payload, ...state.following]
            }
        case 'REMOVE_FOLLOW':
            return {
                following: state.following.filter(userId => userId !== action.payload)
            }
        default:
            return state
    }
}

export const FollowContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(followReducer, {
        following: []
    })
    return (
        <FollowContext.Provider value={{...state, dispatch}}>
            {children}
        </FollowContext.Provider>
    )
}