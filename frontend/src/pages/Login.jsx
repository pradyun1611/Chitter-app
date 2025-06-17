import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import Loading from "./Loading";

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const {login, isLoading, error} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(username, password)
    }
    if (isLoading) {
        return <Loading />
    }
    return (
        <div className="flex h-screen w-full bg-yellow-100 dark:bg-stone-900 justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col h-auto w-1/3 bg-white dark:bg-yellow-100 items-center rounded-xl border-2 border-yellow-500">
                <img src="logo.png" alt="logo"/>
                <input onChange={(e) => setUsername(e.target.value)} type="text" className="w-5/6 border h-10 p-2 mb-2 rounded-lg" placeholder="Username"/>
                <input onChange={(e) => setPassword(e.target.value)} type="password" className="w-5/6 border mb-5 h-10 p-2 rounded-lg" placeholder="Password"/>
                <button disabled={isLoading} type="submit" className="bg-yellow-500 h-10 w-16 rounded-lg mb-5 text-white">Login</button>
                {error && <div className="error mb-2">{error}</div>}
                <div className="flex h-10 w-full justify-center">
                    <div className="w-1/3 h-5 border-b border-gray-500"></div>
                    <div className="pt-1.5"><p className="text-center mx-4 text-gray-500">new user?</p></div>
                    <div className="w-1/3 h-5 border-b border-gray-500"></div>
                </div>
                <p className="text-gray-500 mt-4 mb-10">click <Link to={'/signup'} className="underline underline-offset-2 italic">here</Link> to sign up</p>
            </form>
        </div>
    )
}

export default Login;