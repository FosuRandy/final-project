import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const images = [
  '/images/image11.jpg',
  '/images/image6.jpg',
  '/images/image10.jpg',
  '/images/image13.jpg',
]

const Banner = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 10000) // Change image every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat md:h-[550px]"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      <div
        className="absolute inset-0 bg-white/75 md:bg-white/25 lg:bg-white/25 xl:bg-white/25 sm:bg-gradient-to-r sm:from-white/95 sm:to-transparent"
      ></div>

      <div
        className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8"
      >
        <div className="max-w-xl text-center md:text-left lg:text-left xl:text-left  ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Empower Your Vision,
            <strong className="block font-extrabold text-rose-700"> Fund Your Dreams. </strong>
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed">
            Connect with supporters and turn your ideas into reality with our innovative crowdfunding platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-center">
            <Link
              href="/creator-signup"
              className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
            >
              Get Started
            </Link>

            <Link
              href="/projects"
              className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow hover:text-rose-700 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner