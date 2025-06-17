import { FollowContext } from "../contexts/followContext";
import { useContext } from "react";

export const useFollowContext = () => {
    const context = useContext(FollowContext);
    
    if (!context) {
        throw Error("useFollowContext must be used inside a FollowContextProvider")
    }

    return context
}