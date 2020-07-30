import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
    return(
        <nav id="snav" className="navbar navbar-expand-lg navbar-light  bg-light sticky-top" >
            <ul className="nav nav-tabs">
                <Link to='/'>
                    <li className="nav-item nav-link">Home</li>
                </Link>
                <Link to='/user'>
                    <li className="nav-item nav-link">User</li>
                </Link>
                <Link to='/project'>
                    <li className="nav-item nav-link">Projects</li>
                </Link>
                <Link to='/faculty'>
                    <li className="nav-item nav-link">Faculty Members</li>
                </Link>
                <Link to='/comments'>
                    <li className="nav-item nav-link">Comments</li>
                </Link>
                <Link to='/useraccessrole'>
                    <li className="nav-item nav-link">user access role</li>
                </Link>

            </ul>
    
    </nav>
    )
}

export default Nav