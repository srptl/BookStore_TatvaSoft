import React from 'react'
import * as Yup from "yup"
// import Formik from 'formik'
import { Formik } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { url } from '../constant'
import { useAuthContext } from '../context/auth'
import { btn, div, h1, h2, hr1, hr2, input, label, p } from './LRStyle'
import ValidationErrorMessage from '../component/ValidationErrorMessage'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const navigate = useNavigate();
    const authContext = useAuthContext();

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email is Required").email("Email is invalid"),
        password: Yup.string().required("Password is Required").min(8, "Password must be more than 8 charecter")
    })
    const onSubmit = async (data) => {
        console.log(data)

        let result = axios.post(
            // "http://localhost:5000/api/user/login"
            `${url}api/user/login`
            , data).catch((err,res) => {
                console.log(err);
                console.log("err");
                toast.error("Invalid Email or Password",{theme: "colored"});
                navigate("/login");
            })
            .then((res) => {
                if (res == undefined) {
                    console.log(true)
                } else {
                    toast.success("Login Successfully",{theme: "colored"});
                    authContext.setUser(res.data.result);
                }
            })
            .then(navigate("/"));
        console.log(result);
        // window.alert("successful");
    }

    return (
        <div style={div}>
            <h1 style={h1}>Login or Create an Account</h1>
            <hr style={hr1} />
            <h2 style={h2}>Registered Customers</h2>
            <hr style={hr2} />
            <p style={p}>If you have an account with us, please log in.</p>
            <Formik initialValues={{
                email: "",
                password: ""
            }} validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {
                    ({ values, errors, touched, handleChange, handleSubmit }) => {
                        return (
                            <form onSubmit={handleSubmit}>

                                <label for="email" style={label}>Email :</label>
                                <input name='email' id='email' value={values.email} onChange={handleChange} style={input} />
                                {/* {(errors.email && touched.email) ? errors.email : ""} */}
                                <ValidationErrorMessage
                                    message={errors.email}
                                    touched={touched.email}
                                />

                                <label for="password" style={label}>Password :</label>
                                <input name='password' id='password' value={values.password} onChange={handleChange} style={input} />
                                {/* {(errors.password && touched.password) ? errors.password : ""} */}
                                <ValidationErrorMessage
                                    message={errors.password}
                                    touched={touched.password}
                                />
                                <br />
                                <button type='submit'
                                    style={btn}
                                    className="search-button login-btn btn"
                                >Submit</button>

                            </form>
                        )
                    }
                }
            </Formik>
            <ToastContainer />
        </div>
    )
}

export default Login;;