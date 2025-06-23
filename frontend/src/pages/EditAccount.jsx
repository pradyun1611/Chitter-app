import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuthContext } from "../hooks/useAuthContext";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

function EditAccount() {
    const {user, dispatch} = useAuthContext()

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

    const[name, setName] = useState('')
    const[username, setUsername] = useState('')
    const[dob, setDob] = useState('')
    const[location, setLocation] = useState('')

    useEffect(() => {
        if (curUser) {
            setName(curUser.name || '');
            setUsername(curUser.username || '');
            setDob(curUser.dob ? curUser.dob.slice(0, 10) : '');
            setLocation(curUser.location || '');
        }
    }, [curUser]);


    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(name, username, dob, location);
    }

    const navigate = useNavigate()

    const updateUser = async (name, username, dob, location) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${curUser._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({name, username, dob, location})
        })

        const json = await response.json()

        if (response.ok) {
            const token = user.token
            const updatedUser = {...json, token}
            localStorage.setItem('user', JSON.stringify(updatedUser))
            navigate(`/user/${user._id}`);
        } else {
            console.error(json.error || json)
        }
    }

    const [upload, setUpload] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null)

    const handleImageUpload = async (e) => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('pfp', selectedFile);

        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/upload/${user._id}`, {
            method: 'PATCH',
            headers: {
            Authorization: `Bearer ${user.token}`
            },
            body: formData
        });

        if (res.ok) {
            const token = user.token;
            const updatedUser = { ...json, token };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setCurUser(json)
        } else {
            console.error(json.error || json);
        }
    };


    const [deleting, setDeleting] = new useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${user._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            dispatch({type: "LOGOUT"})
            setDeleting(false)
        }
    }

    const [confirmDelete, setConfirmDelete] = useState(false)

    if (!curUser || deleting) return <Loading />

    return (
        <Layout>
            <div className="h-screen w-full flex justify-center">
                <form onSubmit={handleSubmit} className="flex flex-col h-4/5 w-1/2 items-center justify-center">
                    <img className="object-cover mb-5 h-32 w-32 rounded-full" src={curUser.pfp} alt="pfp" />
                    <button type="button" onClick={() => setUpload(!upload)} className="px-3 py-2 mb-5 rounded-lg bg-yellow-500 text-white">change profile picture</button>
                    {upload && 
                        <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="px-3 py-2 mb-5 rounded-lg bg-yellow-500 text-white"></input>
                    }
                    {upload && selectedFile &&
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            className="px-3 py-2 mb-5 rounded-lg bg-green-500 text-white"
                        >
                            Upload new picture
                        </button>
                    }
                    <div className="editDiv"><label className="editLabel">Name</label><input onChange={(e) => setName(e.target.value)} className="editInput" type="text" value={name} /></div>
                    <div className="editDiv"><label className="editLabel">Username</label><input onChange={(e) => setUsername(e.target.value)} className="editInput" type="text" value={username} /></div>
                    <div className="editDiv"><label className="editLabel">DOB</label><input onChange={(e) => setDob(e.target.value)} className="editInput" type="date" value={dob} /></div>
                    <div className="editDiv"><label className="editLabel">Location</label><input onChange={(e) => setLocation(e.target.value)} className="editInput" value={location} /></div>
                    <button className="mt-2 bg-yellow-500 text-white px-2 py-1 rounded-md">Update details</button>
                    <button onClick={() => setConfirmDelete(!confirmDelete)} type="button" className="mt-5 bg-red-500 text-white px-2 py-1 rounded-md">Delete Account</button>
                    {confirmDelete && 
                    <div className="mt-5 p-3 border-2 border-red-500 rounded-lg">
                        <p>Are you sure you want to delete your account?</p>
                        <div className="flex justify-evenly mt-3">
                            <button onClick={() => setConfirmDelete(false)} className="text-white bg-yellow-500 w-1/5 py-1 rounded-md">no</button>
                            <button onClick={handleDelete} className="text-white bg-red-500 w-1/5 py-1 rounded-md">yes</button>
                        </div>
                    </div>}
                </form>
            </div>
        </Layout>
    )
}

export default EditAccount;