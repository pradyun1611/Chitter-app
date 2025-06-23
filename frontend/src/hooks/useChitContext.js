import { ChitContext } from "../contexts/chitContext";
import { useContext } from "react";

export const useChitContext = () => {
    const context = useContext(ChitContext);
    
    if (!context) {
        throw Error("useChitContext must be used inside a ChitContextProvider")
    }

    return context
}