import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { checkCard, changeValidation, UpdateGame } from '../features/cardSlices';
import Login from '../loginsignup/Login';
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from './Navbar';
import "./css/CardGames.css"

function CardGames() {
    const isvalid = useSelector(state => state.isvalid)
    // const token =useSelector(state=>state.token)
    const cards = useSelector(state => state.cards)
    const game = useSelector(state => state.game)
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    useEffect(() => {
        // console.log("game is done");
        if (game === "Won") {
            // console.log("You Won Match");
            alert("You Won The Match Play Again")
            const addpointData = async () => {
                try {
                    console.log(token);
                    const headers = {
                        'authorization': `Bearer ${token}`, // Replace 'your_token_here' with the actual token
                        'Content-Type': 'application/json'
                        // Add any other headers you need
                    };

                    // Send the request with the configured headers
                    const response = await axios.get(`https://react-golangproject-2.onrender.com/update_score`, { headers: headers });
                    // game="Lost"
                    dispatch(UpdateGame())
                    // if (response.status === 200) {
                    //     // alert("Score added Sucessfully")
                    // }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            addpointData();
            // window.location.reload();

        } else if (game === "Lost") {
            alert("You Lost The Match Play Next Match")
            dispatch(UpdateGame())
            // console.log("You Lost Match");
            // window.location.reload();

        }
    }, [game])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const token = localStorage.getItem('token');
                // console.log(token);
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
                    <div className='cards'>
                        {
                            cards.map((card) => {
                                return (
                                    <li key={card.id} className='card' onClick={() => dispatch(checkCard(card.id))}>
                                        <h1 onClick={()=>alert(card.text)}>Click</h1>
                                    </li>
                                )
                            })
                        }

                    </div>
                </div>
            ) : (
                <Login />
            )}

        </div>
    )
}

export default CardGames
