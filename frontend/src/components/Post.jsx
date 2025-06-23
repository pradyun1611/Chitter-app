import { useState, useEffect } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useChitContext } from '../hooks/useChitContext.js';

function Post(props) {
    const { user } = useAuthContext();

    const [curChit, setCurChit] = useState(null);

    // like chit
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        const fetchChit = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/chit/${props.id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                setCurChit(json);
                setLikes(json.likes || []);
                setHasLiked(json.likes.includes(user._id));
            }
        };

        fetchChit();
    }, [props.id, user.token, user._id]);

    const handleLike = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chit/like/${curChit._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            if (hasLiked) {
                setLikes(likes.filter(id => id !== user._id));
            } else {
                setLikes([user._id, ...likes]);
            }
            setHasLiked(!hasLiked);
        }
    };

    // delete chit
    const {dispatch} = useChitContext()
    const handleDelete = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chit/${curChit._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            dispatch({ type: 'REMOVE_CHIT', payload: curChit._id})
        }
    }

    if (!curChit || !props.user) return null;

    return (
        <div className="post p-4">
            <div className="flex mb-3 w-full justify-between pr-2">
                <Link className='flex' to={`/user/${props.user._id}`}>
                    <div>
                        <img src={`${process.env.REACT_APP_API_URL}/pfp/${props.user.pfp}`} alt="pfp" className="h-12 w-12 object-cover mt-1 ml-1 rounded-full"/>
                    </div>
                    <div className="ml-3">
                        <p className="text-xl">{props.user.name}</p>
                        <p className="text-gray-500">{props.user.username} | {formatDistanceToNow(new Date(props.time), {addSuffix: true})}</p>
                    </div>
                </Link>
                {props.user._id === user._id && <div className='cursor-pointer'><svg onClick={handleDelete} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></div>}
            </div>
            <div className='flex'>
                <p className="w-11/12 ml-1">{props.content}</p>
                <div className='grow flex justify-center cursor-pointer'>
                    <svg
                        onClick={handleLike}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={hasLiked ? "#ff2696" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke={hasLiked ? "" : "currentColor"}
                        className="size-7"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    <p className='ml-1 mt-0.5'>{likes.length}</p>
                </div>
            </div>
        </div>
    );
}

export default Post;
