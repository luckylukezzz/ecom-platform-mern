import axios from 'axios';
import {SyntheticEvent, useContext, useState} from 'react';
import { UserErrors } from '../../models/errors';
import {useCookies} from 'react-cookie';
import {useNavigate} from "react-router-dom";
import { IShopContext, ShopContext } from '../../context/shop-context';
import "./styles.css";

const AuthPage = () => {
    return ( <div>
        <Register />
        <Login />
    </div> );
}
 
export default AuthPage;

const Register = () => {
    const [username , setUsername] = useState<string>("");
    const [password , setPassword] = useState<string>("");

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        try{
            await axios.post("http://localhost:3001/user/register",{
                username,
                password
            });
            alert("reg completed successfully");
    

        }catch(err){
            console.log(err);
            if (err?.response?.data?.type === UserErrors.USERNAME_ALREADY_EXISTS) {
                alert("User already exist");
            }else{
                alert("something went wrong");
            }
        }
    }

    return ( 
    <div className="auth-container">
        <form onSubmit={handleSubmit}>
            <h2>register</h2>
            <div className="form-Group">
                <label htmlFor="username">Username :</label>
                <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)}  />
            </div>
            <div className="form-Group">
                <label htmlFor="password">Password :</label>
                <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <button type="submit">
                Register
            </button>
        </form>
    </div>);
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////

const Login = () => {
    const [username , setUsername] = useState<string>("");
    const [password , setPassword] = useState<string>("");
    const [_, setCookies] = useCookies(["access_token"]);
    const { setIsAuthenticated} = useContext<IShopContext>(ShopContext);

    const navigate = useNavigate();

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        try{
            const result = await axios.post("http://localhost:3001/user/login",{
                username,
                password
            });
            setCookies("access_token" , result.data.token);
            localStorage.setItem("userID", result.data.userID);
            // localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);  // setting isAuthenticated value to true
            navigate("/");

        }catch(err){
            
            let errorMessage: string = "";
            switch (err?.response?.data?.type) {
                case UserErrors.USERNAME_ALREADY_EXISTS:
                    errorMessage = "User already exists";
                    break;
                case UserErrors.WRONG_CREDENTIALS:
                    errorMessage = "Wrong username/password combination";
                    break;
                default:
                    errorMessage = "Something went wrong";
            }
            alert("ERROR: " + errorMessage);
        }
    }
    return ( 
    <div className="auth-container">
        <form onSubmit={handleSubmit}>
            <h2>login</h2>
            <div className="form-Group">
                <label htmlFor="username">Username :</label>
                <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)}  />
            </div>
            <div className="form-Group">
                <label htmlFor="password">Password :</label>
                <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <button type="submit">
                Login
            </button>
        </form>
    </div>);
};

