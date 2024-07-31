import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import Navbar from './Navbar';

// interface ProfileProps {
//   name: string;
//   mobile: string;
//   email: string;
//   schoolId: string;
// }

const Profile: React.FC = () => {

  const [name,setName] = useState(localStorage.getItem('name') || '');
  const [mobile,setMobile] = useState(localStorage.getItem('mobile') || '');
  const [email,setEmail] = useState(localStorage.getItem('email') || '');
  const [schoolId,setSchoolId] = useState(localStorage.getItem('schoolId') || '');
  const [school,setSchool] = useState('');
  useEffect(() => {
    const email = localStorage.getItem('email');
    const schoolId = localStorage.getItem('schoolId');
    const school = email?.split('@')[1];

    if (school === 'school1.com') {
      setSchool("School 1");
    }else if (school === 'school2.com') {
      setSchool("School 2");
    }else if (school === 'school3.com') {
      setSchool("School 3");
    }else if (school === 'school4.com') {
      setSchool("School 4");
    }
  })

  return (
    <>
    <Navbar buttontext=''/>
    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      
    <section className="profile-card">
      <div className="image">
        <img src="https://img-new.cgtrader.com/items/4506145/4d6ab481d2/large/football-player-avatar-3d-icon-3d-model-4d6ab481d2.jpg" alt="user image" />
      </div>
      <div className="text-data">
        <h2>{name}</h2>
        <p>{mobile}</p>
        <p>{email}</p>
        <p>{school}</p>
        {/* <p>{schoolId}</p> */}
      </div>
    </section>
    </div>
    </>
  );
};

export default Profile;