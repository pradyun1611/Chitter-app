import { FollowerContext } from "../contexts/followerContext";
import { useContext } from "react";

export const useFollowerContext = () => {
    const context = useContext(FollowerContext);
    
    if (!context) {
        throw Error("useFollowerContext must be used inside a FollowerContextProvider")
    }

    return context
}