import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../../../context/auth";
import { useEffect } from "react";
import { editStyle } from "./style";
import userService from "./../../../service/UserService";
import * as Yup from "yup";
import ValidationErrorMessage from "../../../component/ValidationErrorMessage";
import { Formik } from "formik";
import { toast } from "react-toastify";
import shared from "../../../utils/shared";
import { materialCommonStyles } from "../../../utils/materialCommonStyles"


import {
  
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,

 
} from "@material-ui/core";

const EditUser = () => {
  const classes = editStyle();
  const materialClasses = materialCommonStyles();
  const authContext = useAuthContext();
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const initialValues = {
    firstName: "",
    lastName: "",
    roleId: 3,
    email: "",
    id: 0,
  };

  const [initialValueState, setInitialValueState] = useState(initialValues);

  const { id } = useParams();
  const getUserById = () => {
    userService.getUserById(Number(id)).then((res) => {
      setUser(res.data.result);
    });
  };
  const getRoles = () => {
    userService.getAllRoles().then((res) => {
      if (res) {
        setRoles(res.data.result);
      }
    });
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (id) {
      getUserById();
    }
  }, [id]);

 useEffect(() => {
  if(user && roles.length) {
    const roleId = roles.find((role) => role.name === user?.role )?.id
    setInitialValueState({
      id: user.id,
      email: user.email,
      lastName : user.lastName,
      firstName : user.firstName,
      roleId,
      password: user.password,
    })
  }
 },[user,roles])

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    roleId: Yup.number().required("Role is required"),
  });

  const onSubmit = (values) => {
    const updatedValue = {
      ...values,
      role: roles.find((r) => r.id == values.roleId).name,
    };
    userService
      .update(updatedValue)
      .then((res) => {
        if (res) {
          toast.success(shared.messages.UPDATED_SUCCESS);
          navigate("/user");
        }
      })
      .catch((e) => toast.error(shared.messages.UPDATED_FAIL));
  };

  return (
    <div className={classes.editWrapper}>
      <div className="container">
       <h1>update Profile</h1>
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-row-wrapper">
                <div className="form-col">
                  <TextField
                    id="first-name"
                    name="firstName"
                    label="Book Name *"
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <ValidationErrorMessage
                    message={errors.name}
                    touched={touched.name}
                  />
                </div>
                <div className="form-col">
                  <TextField
                    id="last-name"
                    name="lastName"
                    label="Last Name *"
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    value={values.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <ValidationErrorMessage
                    message={errors.lastName}
                    touched={touched.lastName}
                  />
                </div>
                <div className="form-col">
                  <TextField
                    id="email"
                    name="email"
                    label="Email *"
                    variant="outlined"
                    inputProps={{ className: "small" }}
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <ValidationErrorMessage
                    message={errors.email}
                    touched={touched.email}
                  />
                </div>

                {values.id !== authContext.user.id && (
                  <div className="form-col">
                  <FormControl className="dropdown-wrapper" variant="outlined" disabled={values.id === authContext.user.id}>
                    <InputLabel htmlFor="select">Roles *</InputLabel>
                    <Select
                      name="roleId"
                      id={"roleId"}
                      onChange={handleChange}
                      disabled={values.id === authContext.user.id}
                      className={materialClasses.customSelect}
                      MenuProps={{
                        classes: { paper: materialClasses.customSelect },
                      }}
                      value={values.roleId}
                    >
                      {roles.length > 0  && roles.map((rl) => (
                        <MenuItem value={rl.id} key={"category" + rl.id}>
                          {rl.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <ValidationErrorMessage
                    message={errors.roleId}
                    touched={touched.roleId}
                  />
                </div>
                )}

                
                {/* <img src={values.imageSrc} alt="asa" /> */}
              
              
              </div>
              <div className="btn-wrapper">
                <Button
                  className="green-btn btn"
                  variant="contained"
                  type="submit"
                  color="primary"
                  disableElevation
                >
                  Save
                </Button>
                <Button
                  className="pink-btn btn"
                  variant="contained"
                  type="button"
                  color="primary"
                  disableElevation
                  onClick={() => {
                    navigate("/user");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditUser;
