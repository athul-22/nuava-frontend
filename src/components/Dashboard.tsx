import React from 'react'
import Navbar from './Navbar'
import BANNER_MAIN from '../assets/BANNER_MAIN.png'

const Dashboard: React.FC = () => {
  return (
    <div>
      <Navbar/>
      <div style={{display:'flex',justifyContent:'center'}}>
        <img src={BANNER_MAIN} alt='Football' height="300px" width="900px" style={{borderRadius:'15px'}}/>
      </div>
    </div>
  )
}

export default Dashboard