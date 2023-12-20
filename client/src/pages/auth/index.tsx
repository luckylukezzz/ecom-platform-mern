import axios from 'axios';
import {SyntheticEvent, useState} from 'react';
import { UserErrors } from '../../errors';

const AuthPage = () => {
    return ( <div>
        <Register />
        
    </div> );
}
 
export default AuthPage;

const Register = () => {
    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        console.log(username,password);
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


const Login = () => {
    return ( <div> login</div>);
};
