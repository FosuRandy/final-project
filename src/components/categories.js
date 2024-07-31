import React from 'react'
import { useRouter } from 'next/router';

const Categories = () => {
  const router = useRouter()

  return (
<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
<div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
    <h2 class="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Popular Categories</h2>
    <p class="mt-1 text-gray-600 dark:text-neutral-400">Discover Popular campaign categories</p>
  </div>
 
  <div class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6" >
    
    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800" >
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Technology
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              4 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>

    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Art
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              26 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
   
    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Music
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              9 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
    
    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Charity Home
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              11 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
    
    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Windows Foundation
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              37 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  
    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Hospital Medical Support
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              2 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>

    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Student Fees Support
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              10 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  
    <div onClick={() => router.push(`/projects`)} class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
              Education
            </h3>
            <p class="text-sm text-gray-500 dark:text-neutral-500">
              14 campaigns
            </p>
          </div>
          <div class="ps-3">
            <svg class="flex-shrink-0 size-5 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Categories