import { useState, useEffect } from "react";

function Loading() {
    const [darkMode, setDarkMode] = useState(undefined);
        useEffect(() => {
            const stored = localStorage.getItem("darkMode");
            if (stored !== null) {
                const isDark = stored === "true";
                setDarkMode(isDark);
                document.documentElement.classList.toggle("dark", isDark);
            }
        }, []);
        useEffect(() => {
            if (darkMode !== undefined) {
                localStorage.setItem("darkMode", darkMode.toString());
                document.documentElement.classList.toggle("dark", darkMode);
            }
        }, [darkMode]);
    return (
        <div className="h-screen w-screen dark:bg-stone-900 dark:text-white flex items-center justify-center">
            <div className="w-16 h-16 border-8 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}

export default Loading;