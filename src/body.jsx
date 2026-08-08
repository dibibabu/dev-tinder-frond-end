import React from 'react'
import NavBar from './navBar'
import Footer from './footer'
import { Outlet } from 'react-router-dom'

const Body = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Body
