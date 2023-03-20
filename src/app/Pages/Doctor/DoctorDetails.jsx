import React,{useState} from 'react'
import { useLocation } from 'react-router-dom';
import { PatternFormat } from 'react-number-format';
import axios from 'axios';
import { createRoot } from 'react-dom/client'

import {
    NotificationContainer,
    NotificationManager,
  } from "react-notifications";
  import DemoApp from './DoctorSlots/DemoApp';
const DoctorDetails = () => {
    var doctor = useLocation()
    var doctorDetails = doctor.state.doctors
    const [disableFields, setDisableFields] = useState(true);

    const [data, setData] = useState({
        id: doctorDetails.id,
        first_name: doctorDetails.first_name,
        surname: doctorDetails.surname,
        middle_name: doctorDetails.middle_name,
        date_of_birth: doctorDetails.date_of_birth,
        age: doctorDetails.age,
        gender: doctorDetails.gender,
        address: doctorDetails.address,
        mobile_no: doctorDetails.mobile_no,
        email: doctorDetails.email,
        cnic: doctorDetails.cnic,
        home_phone:doctorDetails.home_phone,
        work_phone:doctorDetails.work_phone,
        practitioner_type: doctorDetails.practitioner_type,
    });


    const handleInput = (e) => {
        let name, value;

        console.log(e);
        name = e.target.name;
        value = e.target.value;
        setData({ ...data, [name]: value });
    };

       const updateDoctor = async () => {
        // e.preventDefault();
        // const url = `${data._id}`;

        try {
          const updateUser = await axios
            .put(`/api/users/${data.id}`, {
                id: data.id,
                first_name: data.first_name,
                surname: data.surname,
                middle_name: data.middle_name,
                date_of_birth: data.date_of_birth,
                age: data.age,
                gender: data.gender,
                address: data.address,
                mobile_no: data.mobile_no,
                email: data.email,
                cnic: data.cnic,
                home_phone:data.home_phone,
                work_phone:data.work_phone,
                practitioner_type:data.practitioner_type
            
            })
            .then((user) => {
              console.log("updateUser", user.data.updateData);
              data.first_name = user.data.updateData.first_name;
              data.surname = user.data.updateData.surname;
              data.middle_name = user.data.updateData.middle_name;
              data.date_of_birth = user.data.updateData.date_of_birth;
              data.age = user.data.updateData.age;
              data.gender = user.data.updateData.gender;
              data.address = user.data.updateData.address;
              data.practitioner_type = user.data.updateData.practitioner_type;
              data.address = user.data.updateData.address;
              data.mobile_no = user.data.updateData.mobile_no;
              data.email = user.data.updateData.email;
              data.cnic = user.data.updateData.cnic;
              data.home_phone = user.data.updateData.home_phone;
              data.work_phone = user.data.updateData.work_phone
            });
            updateUser && NotificationManager.success("Successfully Updated");

        } catch (error) {

        }
      };

    return (
        <>
        <section class="content">
        <div class="container-fluid">
          <div class="block-header">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <ul class="breadcrumb breadcrumb-style ">
                  <li class="breadcrumb-item">
                    <h4 class="page-title">Add Employee</h4>
                  </li>
                  <li class="breadcrumb-item bcrumb-1">
                    <a href="../../index.html">
                      <i class="fas fa-home"></i> Home
                    </a>
                  </li>
                  <li class="breadcrumb-item bcrumb-2">
                    <a href="#" >
                      Employee
                    </a>
                  </li>
                  <li class="breadcrumb-item active">Add Employee</li>
                </ul>
              </div>
            </div>
          </div>

          {/* <div class="row clearfix">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="card"> */}
<div className='card'> 
          <div class="card-body">
            <div class="body">
              {/* <!-- Nav tabs --> */}
              <ul class="nav nav-tabs" role="tablist">
                <li role="presentation">
                  <a href="#home" data-bs-toggle="tab" class="active show">
                    Doctor Information
                  </a>
                </li>
                <li role="presentation">
                  <a href="#profile" data-bs-toggle="tab">
                    Available Slots
                  </a>
                </li>
                {/* <li role="presentation">
                  <a href="#messages" data-bs-toggle="tab">
                    Education & Skills
                  </a>
                </li> */}
                {/* <li role="presentation">
                  <a href="#setting" data-bs-toggle="tab">
                    Work Experience
                  </a>
                </li> */}
                {/* <li role="presentation">
                  <a href="#other" data-bs-toggle="tab">
                    Other Details
                  </a>
                </li> */}
                {/* <li role="presentation">
                  <a href="#reference" data-bs-toggle="tab">
                    References
                  </a>
                </li> */}
                {/* <li role="presentation">
                  <a href="#bank" data-bs-toggle="tab">
                    Bank Details
                  </a>
                </li> */}
                {/* <li role="presentation">
                  <a href="#details" data-bs-toggle="tab">
                    Employement Details
                  </a>
                </li> */}
              </ul>
              </div>
              {/* <!-- Tab panes --> */}
              <div class="tab-content">
                <div
                  role="tabpanel"
                  class="tab-pane fade in active show"
                  id="home"
                >

                    {/* **************Doctor Information*********** */}

                    
                <div className="card">
                    <div className="card-body" style={{ margin: "10px" }}>
                        <h4>DOCTOR INFORMATION</h4>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                            <button style={{ padding: "0.5rem", border: "0.5px solid grey", borderRadius: "5px", fontWeight: "bold", background: "#365CAD", color: "white" }} onClick={() => {
                                setDisableFields(false);
                            }}>Edit</button>
                            <button style={{ marginLeft: '2rem', padding: "0.5rem", border: "0.5px solid grey", borderRadius: "5px", fontWeight: "bold", background: "#365CAD", color: "white" }} onClick={() => {
                                setDisableFields(true); updateDoctor()
                            }} >Save</button>


                        </div>
                        <div className="row" style={{ marginTop: "2rem" }}>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="surname">
                                    {" "}
                                    <strong>Surname:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border ">
                                {" "}
                                <input type="text" name="surname" placeholder="Surname..." value={data.surname} onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="first_name">
                                    {" "}
                                    <strong>First Name:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                {" "}
                                <input type="text" name="first_name" placeholder="First Name..." value={data.first_name} onChange={handleInput} disabled={disableFields} />

                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="middle_name">
                                    {" "}
                                    <strong>Middle Name:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                {" "}
                                <input type="text" name="middle_name" placeholder="Middle Name..." value={data.middle_name} onChange={handleInput} disabled={disableFields} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="date_of_birth">
                                    {" "}
                                    <strong>Date of Birth:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={handleInput}
                                    disabled={disableFields}
                                />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="age">
                                    {" "}
                                    <strong>Age:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                {" "}
                                <input
                                    name="age"
                                    type="text"
                                    placeholder="age..."
                                    onInput={(e) => {
                                        e.target.value = Math.max(0, parseInt(e.target.value))
                                            .toString()
                                            .slice(0, 3);
                                    }}
                                    value={data.age}
                                    onChange={handleInput}
                                    disabled={disableFields}
                                />

                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="gender">
                                    {" "}
                                    <strong>Gender:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                {" "}
                                <select name="gender" class="form-control dropdown" value={data.gender} onChange={handleInput} disabled={disableFields}>
                                    <option
                                        value=""
                                        selected="selected"
                                        disabled="disabled"
                                    >
                                        Select Gender...
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border  p-3">
                                <label htmlFor="address">
                                    {" "}
                                    <strong>Address:</strong>
                                </label>
                            </div>
                            <div className="col-xl-10 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="address" placeholder="Address..." value={data.address} onChange={handleInput} disabled={disableFields} />
                            </div>


                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border  p-3">
                                <label htmlFor="homephone">
                                    {" "}
                                    <strong>Home Phone:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="homephone" placeholder="Home Phone..." onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="workphone">
                                    {" "}
                                    <strong>Work Phone:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="workphone" placeholder="Work Phone..." onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="mobile_no">
                                    <strong>Mobile No:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="number" name="mobile_no" placeholder="Mobile No..." onInput={(e) => {
                                    e.target.value = Math.max(0, parseInt(e.target.value))
                                        .toString()
                                        .slice(0, 11);
                                }} value={data.mobile_no} onChange={handleInput} disabled={disableFields} />
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="email">
                                    <strong>Email:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="email" name="email" placeholder="Email..." value={data.email} onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="occupation">
                                    <strong>Occupation:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="occupation" placeholder="Occupation..." value={data.occupation} onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="designation">
                                    <strong>Designation:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="designation" placeholder="Designation..." onChange={handleInput} disabled={disableFields} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="doctorname">
                                    <strong>Your Doctor"s Name:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="doctorname" placeholder="Your Doctor Name..." onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="cnic">
                                    <strong>CNIC:</strong>
                                </label>
                            </div>


                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">

                                <PatternFormat
                                    style={{
                                        width: "100%",
                                        borderColor: "grey",
                                    }}
                                    required
                                    name="cnic"
                                    format="#####-#######-#"
                                    allowEmptyFormatting
                                    mask="x"
                                    value={data.cnic}
                                    onChange={handleInput}
                                    disabled={disableFields}
                                />
                            </div>


                        </div>


                    </div>
                </div>
              
                </div>

                <div role="tabpanel" class="tab-pane fade" id="profile">
                 <DemoApp data={data.id} />
            
                </div>

                {/* <div role="tabpanel" class="tab-pane fade" id="messages">
                  <EducationSkills />
                </div> */}

                {/* <div role="tabpanel" class="tab-pane fade" id="setting">
                  <WorkExperience />
                </div> */}

                {/* <div role="tabpanel" class="tab-pane fade" id="other">
                  <OtherDetails />
                </div> */}
{/* 
                <div role="tabpanel" class="tab-pane fade" id="reference">
                  <Reference />
                </div> */}

                {/* <div role="tabpanel" class="tab-pane fade" id="bank">
                  <BankDetails />
                </div> */}
                {/* <div role="tabpanel" class="tab-pane fade" id="details">
               <EmployementDetails/>
                </div> */}
              </div>
            </div>

          </div>
        </div>

      </section>
            {/* <section className="content">
                <div className="container-fluid">
                    <div className="block-header">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <ul className="breadcrumb breadcrumb-style ">
                                    <li className="breadcrumb-item">
                                        <h4 className="page-title">Doctor Details</h4>
                                    </li>
                                    <li className="breadcrumb-item bcrumb-1">
                                        <a href="../../index.html">
                                            <i className="fas fa-home"></i> Home
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item bcrumb-2">
                                        <a href="#">Patient Management</a>
                                    </li>
                                    <li className="breadcrumb-item bcrumb-3"><a href="#">Registered Doctor</a></li>
                                    <li className="breadcrumb-item active">Doctor Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="card">
                    <div className="card-body" style={{ margin: "10px" }}>
                        <h4>DOCTOR INFORMATION</h4>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                            <button style={{ padding: "0.5rem", border: "0.5px solid grey", borderRadius: "5px", fontWeight: "bold", background: "#365CAD", color: "white" }} onClick={() => {
                                setDisableFields(false);
                            }}>Edit</button>
                            <button style={{ marginLeft: '2rem', padding: "0.5rem", border: "0.5px solid grey", borderRadius: "5px", fontWeight: "bold", background: "#365CAD", color: "white" }} onClick={() => {
                                setDisableFields(true); updateDoctor()
                            }} >Save</button>


                        </div>
                        <div className="row" style={{ marginTop: "2rem" }}>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="surname">
                                    {" "}
                                    <strong>Surname:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border ">
                                {" "}
                                <input type="text" name="surname" placeholder="Surname..." value={data.surname} onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="first_name">
                                    {" "}
                                    <strong>First Name:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                {" "}
                                <input type="text" name="first_name" placeholder="First Name..." value={data.first_name} onChange={handleInput} disabled={disableFields} />

                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="middle_name">
                                    {" "}
                                    <strong>Middle Name:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                {" "}
                                <input type="text" name="middle_name" placeholder="Middle Name..." value={data.middle_name} onChange={handleInput} disabled={disableFields} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="date_of_birth">
                                    {" "}
                                    <strong>Date of Birth:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={handleInput}
                                    disabled={disableFields}
                                />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="age">
                                    {" "}
                                    <strong>Age:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border">
                                {" "}
                                <input
                                    name="age"
                                    type="text"
                                    placeholder="age..."
                                    onInput={(e) => {
                                        e.target.value = Math.max(0, parseInt(e.target.value))
                                            .toString()
                                            .slice(0, 3);
                                    }}
                                    value={data.age}
                                    onChange={handleInput}
                                    disabled={disableFields}
                                />

                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="gender">
                                    {" "}
                                    <strong>Gender:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                {" "}
                                <select name="gender" class="form-control dropdown" value={data.gender} onChange={handleInput} disabled={disableFields}>
                                    <option
                                        value=""
                                        selected="selected"
                                        disabled="disabled"
                                    >
                                        Select Gender...
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border  p-3">
                                <label htmlFor="address">
                                    {" "}
                                    <strong>Address:</strong>
                                </label>
                            </div>
                            <div className="col-xl-10 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="address" placeholder="Address..." value={data.address} onChange={handleInput} disabled={disableFields} />
                            </div>


                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border  p-3">
                                <label htmlFor="homephone">
                                    {" "}
                                    <strong>Home Phone:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="homephone" placeholder="Home Phone..." onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="workphone">
                                    {" "}
                                    <strong>Work Phone:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="workphone" placeholder="Work Phone..." onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="mobile_no">
                                    <strong>Mobile No:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="number" name="mobile_no" placeholder="Mobile No..." onInput={(e) => {
                                    e.target.value = Math.max(0, parseInt(e.target.value))
                                        .toString()
                                        .slice(0, 11);
                                }} value={data.mobile_no} onChange={handleInput} disabled={disableFields} />
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="email">
                                    <strong>Email:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="email" name="email" placeholder="Email..." value={data.email} onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="occupation">
                                    <strong>Occupation:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="occupation" placeholder="Occupation..." value={data.occupation} onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="designation">
                                    <strong>Designation:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="designation" placeholder="Designation..." onChange={handleInput} disabled={disableFields} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="doctorname">
                                    <strong>Your Doctor"s Name:</strong>
                                </label>
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">
                                <input type="text" name="doctorname" placeholder="Your Doctor Name..." onChange={handleInput} disabled={disableFields} />
                            </div>
                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-3">
                                <label htmlFor="cnic">
                                    <strong>CNIC:</strong>
                                </label>
                            </div>


                            <div className="col-xl-2 col-lg-2 col-sm-2 border p-1">

                                <PatternFormat
                                    style={{
                                        width: "100%",
                                        borderColor: "grey",
                                    }}
                                    required
                                    name="cnic"
                                    format="#####-#######-#"
                                    allowEmptyFormatting
                                    mask="x"
                                    value={data.cnic}
                                    onChange={handleInput}
                                    disabled={disableFields}
                                />
                            </div>


                        </div>


                    </div>
                </div>
              

            </section> */}
        </>
    )
}

export default DoctorDetails