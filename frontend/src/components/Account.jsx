import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFollowContext } from "../hooks/useFollowContext";
// import { useFollowerContext } from "../hooks/useFollowerContext";

function Account(props) {
    const {user} = useAuthContext()

    // fetch target user
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${props.id}`, {
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
    }, [props.id, user.token])

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

    // follower dispatch
    // const {dispatch: followerDispatch} = useFollowerContext()

    // get following
    const {following, dispatch: followDispatch} = useFollowContext()
    const [isFollowing, setIsFollowing] = useState(false);
    const [followBack, setFollowBack] = useState(false);
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
    useEffect(() => {
        if (userData && curUser) {
            setFollowBack(userData.following.includes(curUser._id))
        }
    }, [curUser, userData])

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
                followDispatch({ type: 'REMOVE_FOLLOW', payload: userData._id})
                // followerDispatch({ type: 'REMOVE_FOLLOWER', payload: curUser._id})
            }
            else {
                followDispatch({ type: 'ADD_FOLLOW', payload: userData._id})
                // followerDispatch({ type: 'ADD_FOLLOWER', payload: curUser._id})
            }
        }
    };
    
    return (
        <div className="flex h-16 p-2 justify-between">
            <Link className="flex h-full w-auto" to={`/user/${props.id}`}>
                <img src={props.pfp} alt="pfp" className="m-2 h-12 w-12 object-cover rounded-full"/>
                <div className="grow flex flex-col justify-center">
                    <h1 className=" mt-2 text-lg font-bold">{props.name}</h1>
                    <p className="text-gray-500">{props.username}</p>
                </div>
            </Link>
            <div className="w-1/4 flex items-center">
                {isFollowing ? (
                    <button onClick={handleFollow} className="h-10 bg-white border-2 border-blue-500 grow rounded-lg text-blue-500 shadow-md">following</button>
                ) : (
                    <button onClick={handleFollow} className="h-10 bg-blue-500 grow rounded-lg text-white shadow-md">{followBack ? "follow back" : "follow"}</button>
                )}
            </div>
        </div>
    )
}

export default Account;