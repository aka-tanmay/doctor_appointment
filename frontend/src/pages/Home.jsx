import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Doctors from './Doctors'

const home = () => {
  return (
    <div>
        <Header/>
        <SpecialityMenu/>
        <TopDoctors/>
         <Banner/>
         {/* <Doctors/> */}
    </div>
  )
}

export default home
