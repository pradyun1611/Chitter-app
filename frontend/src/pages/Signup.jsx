import React, {useState} from "react";
import { useSignup } from "../hooks/useSignup";

function Signup() {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [date, setDate] = useState(null)
    const [location, setLocation] = useState('')

    const {signup, isLoading, error} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(name, username, password, password2, date, location)
    }

    return (
        <div className="flex h-screen w-full bg-yellow-100 dark:bg-stone-900 justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col h-auto w-1/3 bg-white dark:bg-yellow-100 items-center rounded-xl border-2 border-yellow-500 pb-10">
                <img src="logo.png" alt="logo" className=""/>
                <input onChange={(e) => setName(e.target.value)} type="text" className="w-5/6 border h-10 p-2 mb-2 rounded-lg" placeholder="Name"/>
                <input onChange={(e) => setUsername(e.target.value)} type="text" className="w-5/6 border h-10 p-2 mb-2 rounded-lg" placeholder="Username"/>
                <input onChange={(e) => setPassword(e.target.value)}  type="password" className="w-5/6 border h-10 p-2 mb-2 rounded-lg" placeholder="Password"/>
                <input onChange={(e) => setPassword2(e.target.value)} type="password" className="w-5/6 border h-10 p-2 mb-5 rounded-lg" placeholder="Confirm Password"/>
                <div className="flex w-5/6 pl-1 mb-5 items-center">
                    <p className="mr-3">Date of Birth</p>
                    <input onChange={(e) => setDate(e.target.value)} type="date" className="rounded-lg cursor-pointer p-1 text-gray-500 border"/>
                </div>
                <input onChange={(e) => setLocation(e.target.value)} type="text" className="w-5/6 border h-10 p-2 mb-5 rounded-lg" placeholder="Location"/>
                <button disabled={isLoading} type="submit" className="bg-red-500 h-10 rounded-lg p-2 text-white">Sign Up</button>
                {error && <div className="error mt-5">{error}</div>}
            </form>
        </div>
    )
}

export default Signup;