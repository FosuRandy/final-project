import React from 'react'
import { useRouter } from 'next/router';

const WhoWeSupport = () => {
  const router = useRouter()

  return (
    <section>
  <div className="max-w-screen-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
    <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
      <div className="mx-auto max-w-lg text-center lg:mx-0 ltr:lg:text-left rtl:lg:text-right">
        <h2 className="text-3xl font-bold sm:text-4xl">Empower Your Career</h2>

        <p className="mt-4 text-gray-600">
          Empower Dreams, Fund Futures! Join our crowdfunding platform to support job seekers&apos; aspirations. Apply for funding today and make a difference in someone&apos;s career journey.
        </p>

        <div
          onClick={() => router.push(`/signin`)}
          className="mt-8 inline-block rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
        >
          Get Started Today
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <a
          className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="#"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" className="h-6 w-6">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M17 7a3 3 0 00-3-3h-4a3 3 0 00-3 3H6a3 3 0 00-3 3v8a3 3 0 003 3h12a3 3 0 003-3v-8a3 3 0 00-3-3h-1zm-3-1h-4a1 1 0 00-1 1h6a1 1 0 00-1-1zM6 9h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
          </span>

          <h2 className="mt-2 font-bold">Entrepreneurs</h2>

          <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          Business funding for startup success.
          </p>
        </a>

        <a
          className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="#"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
             <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      className="h-6 w-6"
    >
      <path d="M18 10.5V6l-2.11 1.06A3.999 3.999 0 0112 12a3.999 3.999 0 01-3.89-4.94L5 5.5 12 2l7 3.5v5h-1M12 9l-2-1c0 1.1.9 2 2 2s2-.9 2-2l-2 1m2.75-3.58L12.16 4.1 9.47 5.47l2.6 1.32 2.68-1.37M12 13c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-3 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1z" />
    </svg>
          </span>

          <h2 className="mt-2 font-bold">Teachers</h2>

          <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
            Grants for innovative educational projects.
          </p>
        </a>

        <a
          className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="#"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
            <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      className="h-6 w-6"
    >
      <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
      <path fillRule="evenodd" d="M12 3v10h-1V3h1z" />
      <path d="M11 2.82a1 1 0 01.804-.98l3-.6A1 1 0 0116 2.22V4l-5 1V2.82z" />
      <path
        fillRule="evenodd"
        d="M0 11.5a.5.5 0 01.5-.5H4a.5.5 0 010 1H.5a.5.5 0 01-.5-.5zm0-4A.5.5 0 01.5 7H8a.5.5 0 010 1H.5a.5.5 0 01-.5-.5zm0-4A.5.5 0 01.5 3H8a.5.5 0 010 1H.5a.5.5 0 01-.5-.5z"
      />
    </svg>
          </span>

          <h2 className="mt-2 font-bold">Artists</h2>

          <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          Sponsorship for creative endeavors.
          </p>
        </a>

        <a
          className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="#"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      height="1em"
      width="1em"
      className="h-6 w-6"
    >
      <path
        fill="currentColor"
        d="M14.942 12.57L10 4.335V1h.5c.275 0 .5-.225.5-.5s-.225-.5-.5-.5h-5c-.275 0-.5.225-.5.5s.225.5.5.5H6v3.335L1.058 12.57C-.074 14.456.8 16 3 16h10c2.2 0 3.074-1.543 1.942-3.43zM3.766 10L7 4.61V1h2v3.61L12.234 10H3.766z"
      />
    </svg>
          </span>

          <h2 className="mt-2 font-bold">Scientists</h2>

          <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          Research grants for groundbreaking discoveries.
          </p>
        </a>

        <a
          className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="#"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      className="h-6 w-6"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 15a8.001 8.001 0 017.938 7H4.062A8.001 8.001 0 0112 15zm-1.813 2.28A6.025 6.025 0 006.8 20H12l-1.813-2.72zm3.627 0L12 20h5.199a6.02 6.02 0 00-3.385-2.72zM18 2v6A6 6 0 116 8V2h12zM8 8c0 2.21 1.79 4 4 4s4-1.79 4-4H8zm8-4H8v2h8V4z" />
    </svg>
          </span>

          <h2 className="mt-2 font-bold">Nurses</h2>

          <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          Scholarships for advanced medical education.
          </p>
        </a>

        <a
          className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
          href="#"
        >
          <span className="inline-block rounded-lg bg-gray-50 p-3">
          <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      className="h-6 w-6"
    >
      <path d="M1 0L0 1l2.2 3.081a1 1 0 00.815.419h.07a1 1 0 01.708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 000 13a3 3 0 105.878-.851l2.654-2.617.968.968-.305.914a1 1 0 00.242 1.023l3.27 3.27a.997.997 0 001.414 0l1.586-1.586a.997.997 0 000-1.414l-3.27-3.27a1 1 0 00-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0016 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 00-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 01-.293-.707v-.071a1 1 0 00-.419-.814L1 0zm9.646 10.646a.5.5 0 01.708 0l2.914 2.915a.5.5 0 01-.707.707l-2.915-2.914a.5.5 0 010-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z" />
    </svg>
          </span>

          <h2 className="mt-2 font-bold">Engineers</h2>

          <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
          Funding for technological innovations.
          </p>
        </a>
      </div>
    </div>
  </div>
</section>
  )
}

export default WhoWeSupport