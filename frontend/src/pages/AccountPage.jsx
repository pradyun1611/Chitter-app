import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChitContext } from "../hooks/useChitContext";
import { useFollowContext } from "../hooks/useFollowContext";
import { useFollowerContext } from "../hooks/useFollowerContext";
import { Link } from "react-router-dom";
import Loading from "./Loading";

function AccountPage() {
    const {id} = useParams()
    const {user} = useAuthContext()

    // fetch target user
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            setUserData(null);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })

            const json = await response.json()

            if (response.ok) {
                setUserData(json);
            }
        }

        fetchUser();
    }, [id, user.token])

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

    // fetch chits
    var {chits, dispatch} = useChitContext()

    useEffect(() => {
        const fetchChits = async () => {
            dispatch({ type: 'SET_CHITS', payload: [] });
            const response = await fetch(`${process.env.REACT_APP_API_URL}/chit`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_CHITS', payload: json})
            }
        }
        
        if (user) {
            fetchChits();
        }
    }, [dispatch, user])

    // get followers (target user)
    const {follower, dispatch: followerDispatch} = useFollowerContext()
    useEffect(() => {
        if (userData && userData.followers) {
            followerDispatch({ type: 'SET_FOLLOWER', payload: userData.followers });
        }
    }, [followerDispatch, userData]);

    // get following
    const {following, dispatch: followDispatch} = useFollowContext()
    const [isFollowing, setIsFollowing] = useState(false);
    useEffect(() => {
        if (curUser && curUser.following) {
            followDispatch({ type: 'SET_FOLLOW', payload: curUser.following });
        }
    }, [curUser, followDispatch]);
    useEffect(() => {
        if (userData && following) {
            setIsFollowing(following.includes(userData._id));
        }
    }, [userData, following]);


    if (!curUser || !userData || !chits || isFollowing === null) {
        return (<Loading />)
    }

    const dob = new Date(userData.dob);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    chits = chits.filter((c) => c.user._id === userData._id)

    const handleFollow = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/follow/${userData._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            if (isFollowing) {
                followDispatch({ type: 'REMOVE_FOLLOW', payload: userData._id })
                followerDispatch({ type: 'REMOVE_FOLLOWER', payload: curUser._id })
            }
            else {
                followDispatch({ type: 'ADD_FOLLOW', payload: userData._id})
                followerDispatch({ type: 'ADD_FOLLOWER', payload: curUser._id })
            }
        }
    };


    return (
        <Layout>
        <div className="flex h-80">
            <div className='flex flex-col w-1/3 items-center'>
                <img src={userData.pfp} alt='pfp' className='h-48 w-48 object-cover my-5 rounded-full'/>
                <p className='text-2xl'>{userData.name}</p>
                <p className='text-gray-400'>@{userData.username}</p>
            </div>
            <div className='w-1/2 flex flex-col ml-14 '>
                <div className='flex h-1/2 justify-between items-center'>
                    <div className='flex flex-col items-center'>
                        <p className='text-4xl'>{chits.length}</p>
                        <p className='text-2xl'>{chits.length === 1 ? 'chit' : 'chits'}</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p className='text-4xl'>{follower.length}</p>
                        <p className='text-2xl'>followers</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p className='text-4xl'>{userData.following.length}</p>
                        <p className='text-2xl'>following</p>
                    </div>
                </div>
                <div className="flex mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" /></svg> 
                    <p className="ml-2">{`${dob.getDate()} ${months[dob.getMonth()]}`}</p>
                </div>
                <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                    <p className="ml-2">{userData.location}</p>
                </div>
                <div className='w-full grow flex items-center'>
                    {curUser._id !== userData._id ? (
                        isFollowing ? (
                            <button onClick={handleFollow} className='w-1/2 h-1/2 bg-white border-2 border-blue-500 flex justify-center items-center rounded-lg shadow-md'>
                                <p className='text-2xl text-black'>Following</p>
                            </button>
                        ) : (
                            <button onClick={handleFollow} className='w-1/2 h-1/2 bg-blue-500 flex justify-center items-center rounded-lg shadow-md'>
                                <p className='text-2xl text-white'>{userData.following.includes(curUser._id) ? "Follow Back" : "Follow"}</p>
                            </button>
                        )
                    ) : (
                        <>
                            <Link className="h-1/2 w-1/3" to={`/edit`}><button className='w-full h-full bg-yellow-500 flex justify-center items-center rounded-lg shadow-md'>
                                <p className="text-2xl text-black dark:text-white">Edit Profile</p>
                            </button></Link>
                        </>
                    )}
                </div>
            </div>
        </div>
        <div className="">
            {chits && chits.map((chit) => (
                <Post id={chit._id} user={chit.user} time={chit.time} content={chit.content}/>
            ))}
        </div>
        <div className="mt-10"></div>
        </Layout>
    )
}

export default AccountPage;