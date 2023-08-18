import React, { useContext, useState } from "react"
import { editStyle } from "./style";
import { AuthContext, useAuthContext } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import userService from "../../service/UserService"
import { toast } from "react-toastify";
import shared from "../../utils/shared";
import { TextField, Typography } from "@material-ui/core";
import { Formik } from "formik";
import ValidationErrorMessage from "../../component/ValidationErrorMessage";
import { Button } from "@material-ui/core"

const UpdateProfile = () => {
    const authContext = useAuthContext();
    const classes = editStyle();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);


    const initialValues = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        newPassword: "",
        confirmpass: ""
    }

    const [updatePass, setUpdatePass] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email Add.")
            .required("Email is required"),

        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        newPassword: Yup.string().min(5, "Minimum 5 charatcter is required"),
        confirmpass: updatePass ? Yup.string()
            .required("Must required")
            .oneOf([Yup.ref("newPassword")], "Password is not match")
            : Yup.string().oneOf([Yup.ref("newPasword")], "Password is not match"),
    });

    const onSubmit = async (values) => {
        const password = values.newPassword ? values.newPassword : user.password;
        delete values.confirmpass;
        delete values.newPassword;

        const data = Object.assign(user, { ...values, password });
        const res = await userService.updatePass(data);


        if (res) {
            authContext.setUser(res);
            toast.success(shared.messages.UPDATED_SUCCESS);
            navigate("/");
        }
    };

    return (
        <div className={classes.editWrapper}>
            <div className="container">
                <Typography variant="h1">Update Profile</Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitializa={true}
                    onSubmit={onSubmit}
                    validator={() => ({})}
                >

                    {
                        (
                            {
                                values,
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                            }
                        ) => (
                            <>
                                <form action="" onSubmit={handleSubmit}>
                                    <div className="form-row-wrapper">
                                        <div className="form-col">
                                            <TextField
                                                id="first-name"
                                                name="firstName"
                                                label="First Name *"
                                                variant="outlined"
                                                value={values.firstName}
                                                inputProps={{ className: "small" }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <ValidationErrorMessage
                                                messages={errors.firstName}
                                                touched={touched.firstName}
                                            />
                                        </div>
                                        <div className="form-col">
                                            <TextField
                                                id="last-name"
                                                name="lastName"
                                                label="Last Name *"
                                                variant="outlined"
                                                value={values.lastName}
                                                inputProps={{ className: "small" }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <ValidationErrorMessage
                                                messages={errors.lastName}
                                                touched={touched.lastName}
                                            />
                                        </div>

                                        <div className="form-col">
                                            <TextField
                                                id="email"
                                                name="email"
                                                label="Email *"
                                                variant="outlined"
                                                value={values.email}
                                                inputProps={{ className: "small" }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <ValidationErrorMessage
                                                message={errors.email}
                                                touched={touched.email}
                                            />

                                        </div>

                                        <div className="form-col">
                                            <TextField
                                                id="newPassword"
                                                name="newPassword"
                                                label="New Password "
                                                variant="outlined"
                                                value={values.newPassword}
                                                inputProps={{ className: "small" }}
                                                onChange={(e) => {
                                                    e.target.value !== ""
                                                        ? setUpdatePass(true)
                                                        : setUpdatePass(false);
                                                    handleChange(e);
                                                }}
                                                onBlur={handleBlur}
                                            />
                                            <ValidationErrorMessage
                                                message={errors.newPassword}
                                                touched={touched.newPassword}
                                            />
                                        </div>

                                        <div className="form-col">
                                            <TextField
                                                id="confirmpass"
                                                name="confirmpass"
                                                label='Confirm Password'
                                                variant="outlined"
                                                value={values.confirmpass}
                                                inputProps={{ className: "small" }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <ValidationErrorMessage
                                                message={errors.confirmpass}
                                                touched={touched.confirmpass}
                                            />
                                        </div>
                                    </div>
                                    <div className="btn-wrapper">
                                        <Button
                                            className="green-btn btn"
                                            variant="contained"
                                            type="submit"
                                            color="primary"
                                            disableElevation


                                        // onClick={() => {
                                        //  navigate("/");
                                        // }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            className="pink-btn btn"
                                            variant="contained"
                                            type="submit"
                                            color="primary"
                                            disableElevation
                                            onClick={() => {
                                                navigate("/");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>


                                </form>
                            </>
                        )
                    }

                </Formik>
            </div>
        </div>
    )
}

export default UpdateProfile