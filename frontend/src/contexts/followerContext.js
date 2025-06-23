import { createContext, useReducer } from "react";

export const FollowerContext = createContext()

export const followerReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FOLLOWER':
            return {
                follower: action.payload
            }
        case 'ADD_FOLLOWER':
            return {
                follower: [action.payload, ...state.follower]
            }
        case 'REMOVE_FOLLOWER':
            return {
                follower: state.follower.filter(userId => userId !== action.payload)
            }
        default:
            return state
    }
}

export const FollowerContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(followerReducer, {
        follower: []
    })
    return (
        <FollowerContext.Provider value={{...state, dispatch}}>
            {children}
        </FollowerContext.Provider>
    )
}