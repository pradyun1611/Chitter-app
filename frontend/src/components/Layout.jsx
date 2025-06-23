import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import Account from '../components/Account';
import { useLogout } from '../hooks/useLogout';
import { useChitContext } from '../hooks/useChitContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Loading from '../pages/Loading';

function Layout({children, activeTab}) {

    // dark mode
    const [darkMode, setDarkMode] = useState(undefined);

    const switchMode = () => {
        setDarkMode(prev => !prev);
    };

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

    const {user} = useAuthContext()

    //logout
    const {logout} = useLogout()

    const handleLogout = (e) => {
        logout();
    }

    // create post
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)
    const {dispatch} = useChitContext()

    const handleTextSubmit = async (e) => {
        e.preventDefault();

        console.log('submitting')

        const response = await fetch(`${process.env.REACT_APP_API_URL}/chit`, {
            method: 'POST',
            body: JSON.stringify({content}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setContent('')
            setError(null)
            dispatch({type: 'CREATE_CHIT', payload: json})
            console.log('new chit added ', json)
        }
    }

    // get users
    const [users, setUsers] = useState(null)
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                setUsers(json);
            }
        }

        fetchUsers();
    }, [user.token])

    // fetch current user
    const [curUser, setCurUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${user._id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                setCurUser(json);
            }
        }

        fetchUser();
    }, [user.token, user._id])

    // searching
    const [searching, setSearching] = useState(false);
    const [searchItem, setSearchItem] = useState('')
    var [filteredUsers, setFilteredUsers] = useState(null)
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearching(true);
        console.log(searchItem);
        setFilteredUsers(users.filter(user =>
            (user.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            user.username.toLowerCase().includes(searchItem.toLowerCase())) &&
            user._id !== curUser._id
        ));
    };

    // active tab
    // const [activeTab, setActiveTab] = useState("")

    if (!curUser) {
        return (<Loading />)
    }

    return (
        <div className="flex h-screen overflow-hidden dark:text-white dark:bg-stone-900">
            <div onClick={() => setSearching(false)} className="flex flex-col w-2/3 border-r border-black">
                <div className="flex h-16 shrink-0">
                    <Link to='/'><img src='/logo.png' className='h-full w-auto' alt='logo'/></Link>
                    <div className='flex font-semibold text-xl grow border-l border-black'>
                        <Link className={`${activeTab !== "following" && "underline underline-offset-8 decoration-4 decoration-yellow-500"} topbar h-full grow flex justify-center items-center`} to={'/?tab=foryou'}>For you</Link>
                        <Link className={`${activeTab === "following" && "underline underline-offset-8 decoration-4 decoration-yellow-500"} topbar h-full grow flex justify-center items-center`} to={'/?tab=following'}>Following</Link>
                    </div>
                </div>
                <div className="flex flex-col border-t border-black overflow-y-scroll">
                    { children }
                </div>
            </div>
            <div className="side w-1/3 sticky top-0 flex flex-col">
                <div className='flex h-16 shrink-0 items-center py-2 px-2'>
                    <form onSubmit={handleSearchSubmit} className="flex grow items-center">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search"
                            className="h-10 border w-full rounded-xl px-2 mr-2 text-black"
                            onChange={(e) => setSearchItem(e.target.value)}
                        />
                        <button type="submit" className="hidden" />
                    </form>
                    <div className='m-2 mt-3.5'>
                        <button onClick={switchMode}>
                            {darkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>

                            )}
                        </button>
                    </div>
                    <div className='m-2'><a target='blank' href='https://github.com/pradyun1611'>{darkMode ? (
                        <img className='h-7 w-7' src='/github-mark/github-mark-white.svg' alt='github'/>
                    ) : (
                        <img className='h-7 w-7' src='/github-mark/github-mark.svg' alt='github'/>
                    )}</a></div>
                    {user ? (
                        <>
                        <Link className='h-full m-2 flex items-center justify-center' to={`/user/${curUser._id}`}><img src={curUser.pfp} alt='pfp' className='h-8 w-8 object-cover rounded-full mt-1'/></Link>
                        <button onClick={handleLogout} className='bg-red-500 w-1/5 h-9 rounded-xl text-white m-2'>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className='w-1/5 m-2'><button className='bg-yellow-500 w-full h-9 rounded-xl '>Login</button></Link>
                    )}
                </div>
                <div className='h-full w-full flex flex-col'>
                    {searching ? (
                        <div>
                            {filteredUsers.map(user => (
                                <Account
                                key={user._id}
                                id={user._id}
                                name={user.name}
                                username={user.username}
                                pfp={user.pfp}
                                />
                            ))}
                        </div>
                        ) : (
                        <>
                            <form onSubmit={handleTextSubmit} className='grow w-full p-2'>
                                <textarea onChange={(e) => setContent(e.target.value)} value={content} className='h-full w-full dark:bg-zinc-800 rounded-xl p-5 text-xl border border-yellow-500 resize-none mb-1' placeholder="What's happening? Post a chit!"></textarea>
                                <div className='flex justify-between px-5'>
                                    {!error ? (
                                        <div></div>
                                    ) : (
                                    <div className='error'>{error}</div>
                                )}
                                    <button type='submit' className='bg-yellow-500 h-10 w-20 rounded-lg'>Post</button>
                                </div>
                            </form>
                            <h1 className='text-2xl font-bold mt-10 mx-2'>Who to Follow</h1>
                            <div className='flex flex-col dark:bg-zinc-800 border border-yellow-500 m-2 pb-2 rounded-xl'>
                                {users && users.filter((u) => u._id !== user._id).sort((a, b) => b.followers.length - a.followers.length).slice(0, 5).map((user) => (
                                    <Account id={user._id} name={user.name} username={user.username} pfp={user.pfp} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Layout;