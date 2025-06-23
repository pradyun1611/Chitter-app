import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { useChitContext } from '../hooks/useChitContext';
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";

function Home() {
    const { user } = useAuthContext();
    const { chits, dispatch } = useChitContext();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab") || "foryou"; 

    // fetch all chits
    useEffect(() => {
        const fetchChits = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/chit`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_CHITS', payload: json });
            }
        };

        if (user) {
            fetchChits();
        }
    }, [dispatch, user]);

    // fetch current user
    const [curUser, setCurUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${user._id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            if (response.ok) {
                setCurUser(json);
            }
        };

        fetchUser();
    }, [user._id, user.token]);

    if (!curUser) return <Loading />;

    // filter chits based on tab
    const postsToShow = chits?.filter(c => {
        if (!c.user || c.user._id === curUser._id) return false;
        if (tab === "following") {
            return curUser.following.includes(c.user._id);
        }
        return true;
    });

    return (
        <Layout activeTab={tab}>
            {postsToShow?.length > 0 ? (
                postsToShow.map(chit => (
                    <Post
                        key={chit._id}
                        id={chit._id}
                        user={chit.user}
                        time={chit.time}
                        content={chit.content}
                    />
                ))
            ) : (
                <p className="text-lg text-center mt-5">no posts</p>
            )}
            <div className="mt-10" />
        </Layout>
    );
}

export default Home;
