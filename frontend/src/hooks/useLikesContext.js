import { LikesContext } from "../contexts/likesContext";
import { useContext } from "react";

export const useLikesContext = () => {
    const context = useContext(LikesContext);
    
    if (!context) {
        throw Error("useLikesContext must be used inside a LikesContextProvider")
    }

    return context
}