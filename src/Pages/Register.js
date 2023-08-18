import React from 'react'
import * as Yup from "yup"
import { Formik } from 'formik'
import axios from 'axios'
import { btn, div, label, input, h1, hr1, h2, hr2, p } from './LRStyle'
import { NavLink, useNavigate } from 'react-router-dom'
import { url } from '../constant'
import ValidationErrorMessage from '../component/ValidationErrorMessage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("FirstName is Required"),
        lastName: Yup.string().required("LastName is Required"),
        email: Yup.string().required("Email is Required").email("Email is invalid"),
        roleId: Yup.number().required("Role is Required"),
        password: Yup.string().required("Password is Required").min(8, "Password must be more than 8 charecter"),
        confirmPassword: Yup.string().required("ConfirmPassword is Required").oneOf([Yup.ref("password"), null], "Password and ConfirmPassword must be match")
    })
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        delete data.confirmPassword;
        console.log(data)
        axios.post(`${url}api/user`, data).catch(err => {
            console.log(err)
            console.log(err.response.data.error)
            toast.error(err.response.data.error, { theme: "colored" });
            navigate("/register")
        })
            // .then(
            //     toast.success("Register Successfully", { theme: "colored" }),
            //     navigate("/login"))
            .then((res) => {
                if (res == undefined) {
                    console.log(true)
                } else {
                    toast.success("Register Successfully", { theme: "colored" })
                    navigate("/login")
                }
            })

    }

    return (
        <div style={div}>
            <h1 style={h1}>Login or Create an Account</h1>
            <hr style={hr1} />
            <h2 style={h2}>Personal Information</h2>
            <hr style={hr2} />
            <p style={p}>Please enter the following information to create your account.</p>
            <Formik initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                roleId: 0,
                password: "",
                confirmPassword: ""

            }} validationSchema={validationSchema}
                // onSubmit={(data) => alert(JSON.stringify(data))}
                onSubmit={onSubmit}
            >
                {
                    ({ values, errors, touched, handleChange, handleSubmit }) => {
                        return (
                            <form onSubmit={handleSubmit}>

                                <label for='firstName' style={label}>FirstName : </label>
                                <input name='firstName' id='firstName' value={values.firstName} onChange={handleChange} style={input} />
                                {/* {(errors.firstName && touched.firstName) ? errors.firstName : ""} */}
                                <ValidationErrorMessage
                                    message={errors.firstName}
                                    touched={touched.firstName}
                                />

                                <label for='lastName' style={label}> LastName :</label>
                                <input name='lastName' id='lastName' value={values.lastName} onChange={handleChange} style={input} />
                                {/* {(errors.lastName && touched.lastName) ? errors.lastName : ""} */}
                                <ValidationErrorMessage
                                    message={errors.lastName}
                                    touched={touched.lastName}
                                />

                                <label for='email' style={label}>Email :</label>
                                <input name='email' id='email' value={values.email} onChange={handleChange} style={input} />
                                {/* {(errors.email && touched.email) ? errors.email : ""} */}
                                <ValidationErrorMessage
                                    message={errors.email}
                                    touched={touched.email}
                                />

                                <label for='roleId' style={label}>select Role :</label>
                                <select name='roleId' id='roleId' onChange={handleChange} style={input}>
                                    <option
                                        value={3} onChange={handleChange}
                                    >Buyer</option>
                                    <option
                                        value={2} onChange={handleChange}
                                    >Seller</option>
                                </select>
                                {/* {(errors.roleId && touched.roleId) ? errors.roleId : ""} */}
                                <ValidationErrorMessage
                                    message={errors.roleId}
                                    touched={touched.roleId}
                                />
                                <label for='password' style={label}>Password :</label>
                                <input name='password' id='password' value={values.password} onChange={handleChange} style={input} />
                                {(errors.password && touched.password) ? errors.password : ""}
                                <ValidationErrorMessage
                                    message={errors.password}
                                    touched={touched.password}
                                />
                                <label for='confirmPassword' style={label}>ConfirmPassword :</label>
                                <input name='confirmPassword' id='confirmPassword' value={values.confirmPassword} onChange={handleChange} style={input} />
                                {/* {(errors.confirmPassword && touched.confirmPassword) ? errors.confirmPassword : ""} */}
                                <ValidationErrorMessage
                                    message={errors.confirmPassword}
                                    touched={touched.confirmPassword}
                                />
                                <br />
                                <button type='submit'
                                    style={btn}
                                    className="search-button login-btn btn"
                                >Submit</button>
                                <br />
                                <p style={{ marginLeft: "155px" }} >Already have an account? <NavLink to="/login">Login</NavLink> </p>
                            </form>
                        )
                    }
                }
            </Formik>
            <ToastContainer />
        </div>
    )
}

export default Register