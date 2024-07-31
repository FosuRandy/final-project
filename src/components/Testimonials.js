import React, { useState } from 'react';

const testimonials = [
  {
    text: "Life-Changing Platform",
    detail: "This crowdfunding platform changed my life by helping me raise funds for my innovative project. The support and engagement from the community were incredible, making my dream a reality.",
    author: "Michael Scott"
  },
  {
    text: "Empowering Dreams",
    detail: "Using this crowdfunding website was a game-changer for me. It empowered me to reach out to a global audience and secure funding for my passion project. The experience was seamless and rewarding.",
    author: "Jeniffer Grant"
  },
  {
    text: "Life-Changing Platform",
    detail: "This crowdfunding platform changed my life by helping me raise funds for my innovative project. The support and engagement from the community were incredible, making my dream a reality.",
    author: "Michael Scott"
  },
  {
    text: "Empowering Dreams",
    detail: "Using this crowdfunding website was a game-changer for me. It empowered me to reach out to a global audience and secure funding for my passion project. The experience was seamless and rewarding.",
    author: "Jeniffer Grant"
  },
  // Add more testimonials as needed
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < testimonials.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= testimonials.length - 3;

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-[1340px] px-4 py-12 sm:px-6 lg:me-0 lg:py-16 lg:pe-0 lg:ps-8 xl:py-24">
        <div className="max-w-7xl items-end justify-between sm:flex sm:pe-6 lg:pe-8">
          <h2 className="max-w-xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Read trusted reviews from our customers
          </h2>

          <div className="mt-8 flex gap-4 lg:mt-0">
            <button
              aria-label="Previous slide"
              onClick={prevSlide}
              disabled={isPrevDisabled}
              className={`rounded-full border border-rose-600 p-3 text-rose-600 transition ${isPrevDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-600 hover:text-white'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 rtl:rotate-180"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              aria-label="Next slide"
              onClick={nextSlide}
              disabled={isNextDisabled}
              className={`rounded-full border border-rose-600 p-3 text-rose-600 transition ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-600 hover:text-white'}`}
            >
              <svg
                className="size-5 rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="-mx-6 mt-8 lg:col-span-2 lg:mx-0">
          <div className="flex overflow-hidden">
            {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial, index) => (
              <div key={index} className="flex-none w-full lg:w-1/3 px-6">
                <blockquote className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8 lg:p-12">
                  <div>
                    <div className="flex gap-0.5 text-green-500">
                      {[...Array(5)].map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-2xl font-bold text-rose-600 sm:text-3xl">{testimonial.text}</p>
                      <p className="mt-4 leading-relaxed text-gray-700">{testimonial.detail}</p>
                    </div>
                  </div>

                  <footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
                    &mdash; {testimonial.author}
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
