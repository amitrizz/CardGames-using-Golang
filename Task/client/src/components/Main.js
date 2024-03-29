import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { checkCard, changeValidation } from '../features/cardSlices';
import Login from '../loginsignup/Login';
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from './Navbar';
import "./css/Main.css"
function Main() {
    const isvalid = useSelector(state => state.isvalid)
    // const token =useSelector(state=>state.token)
    const game = useSelector(state => state.game)
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log(token);
                const headers = {
                    'authorization': `Bearer ${token}`, // Replace 'your_token_here' with the actual token
                    'Content-Type': 'application/json'
                    // Add any other headers you need
                };

                // Send the request with the configured headers
                const response = await axios.get(`https://react-golangproject-2.onrender.com`, { headers: headers });
                if (response.status === 200) {
                    dispatch(changeValidation(true))
                    console.log(response);
                } else {
                    dispatch(changeValidation(false))
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        // handleSelectChange();
    }, []);



    return (
        <div>
            {isvalid ? (
                <div>
                    <Navbar />
                    <div className='mainpage'>
                        <li className="link" >
                            <Link to="/cardgame" className={"link-styles"}>Start Game</Link>
                        </li>
                    </div>

                </div>
            ) : (
                <Login />
            )}

        </div>
    )
}

export default Main
