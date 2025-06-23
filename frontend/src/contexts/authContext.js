import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {user: action.payload}
        case "LOGOUT":
            return {user: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect(() => {
        async function fetchData() {
            const user = await JSON.parse(localStorage.getItem('user'))
            if (user) {
                dispatch({type : 'LOGIN', payload: user})
            }
        }
        fetchData();
    }, [])

    console.log("AuthContext state ", state)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}