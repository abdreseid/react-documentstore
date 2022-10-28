import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthenticationContext from "./auth/AuthenticationContext";
import Authorized from "./auth/Authorized";
import Button from "./auth/forms/Button";
import { logout } from "./auth/handleJWT";
import React from 'react';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';

export default function Menu(){
    const {update, claims} = useContext(AuthenticationContext);

    function getUserEmail(): string {
        return claims.filter(x => x.name === "email")[0]?.value;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light ">
            
            <div className="container-fluid">
            <Authorized 
                                authorized={<>
            <FolderSpecialIcon/>
                <NavLink className="navbar-brand" to="/home">DocStore</NavLink>
                </>}
                notAuthorized={<>
                <FolderSpecialIcon/>
                <NavLink className="navbar-brand" to="/">DocStore</NavLink></>}
                />
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <Authorized
                        role="admin"
                        authorized={<>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/document">
                                Document
                            </NavLink>
                        </li>
                        <li className="nav-item">
                                    <NavLink className="nav-link" to="/users">
                                        User
                                    </NavLink>
                                </li>
                        </>}
                        />
                        
                    </ul>
                    <div className="d-flex">
                            <Authorized 
                                authorized={<>
                                
                                <span className="nav-link">Hello, {getUserEmail()}</span>
                                    <Button
                                    onClick={() => {
                                        logout();
                                        update([]);
                                    }}
                                    className="nav-link btn btn-link"
                                    >Log out</Button>
                                </>}
                                notAuthorized={<>
                                    <Link to="/register" 
                                    className="nav-link btn btn-link">Register</Link>
                                    <Link to="/login" 
                                    className="nav-link btn btn-link">Login</Link>
                                </>}
                            />
                        </div>
                </div>
            </div>
        </nav>
    )
}