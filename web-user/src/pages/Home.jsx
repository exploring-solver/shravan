import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="bg-black text-white">
        <Hero/>
        <Features/>
        <Footer/>
    </div>
  )
}

export default Home