import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { checkCard, changeValidation } from '../features/cardSlices';
import Login from '../loginsignup/Login';
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./css/LeaderBoard.css"
import Navbar from './Navbar';

function Leaderboard() {
  const [data, setdata] = useState([])
  const isvalid = useSelector(state => state.isvalid)
  // const token =useSelector(state=>state.token)
  const game = useSelector(state => state.game)
  const dispatch = useDispatch();
  useEffect(() => {
    const checkauth = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        const headers = {
          'authorization': `Bearer ${token}`, // Replace 'your_token_here' with the actual token
          'Content-Type': 'application/json'
          // Add any other headers you need
        };

        // Send the request with the configured headers
        const response = await axios.get(`http://localhost:8000`, { headers: headers });
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

    checkauth();
    // handleSelectChange();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Send the request with the configured headers
        const response = await axios.get(`http://localhost:8000/leaderboard`);
        console.log(response);
        setdata(response.data)
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
          <div className='leaderboardbody'>


            <h2 className="link" >
              LeaderBoard
            </h2>
            <table>
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>UserName</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.score}</td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
          </div>
        </div>) : (
        <Login />
      )}

    </div>
  )
}

export default Leaderboard
