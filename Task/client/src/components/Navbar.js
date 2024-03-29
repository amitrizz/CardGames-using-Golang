import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./css/Navbar.css"

function Navbar() {

    const navigate = useNavigate();
    function logoutUser() {
        localStorage.removeItem('token')
        navigate("/login")
    }
    return (
        <div className='navstyle'>
            <h3>Logo</h3>
            <nav className='navbarlink'>
                <ul className="nav-link">
                    <li className="link" >
                        <Link to="/" className={"link-styles"}>Home</Link>
                    </li>

                    <li className="link" >
                        <Link to="/leaderboard" className={"link-styles"}>leaderBoard</Link>
                    </li>
                    <li className="link" >
                        <Link to="/cardgame" className={"link-styles"}>CardGame</Link>
                    </li>

                    <li className="link">
                        <button className='logoutbtn' onClick={logoutUser}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
