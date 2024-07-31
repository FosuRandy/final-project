import React from 'react'
import { useRouter } from 'next/router';

const PopularProjects = () => {
  const router = useRouter()

  return (
<div class="max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto hidden md:block">
 
  <div class="grid sm:grid-cols-12 gap-6">
   
    <div class="col-span-12 sm:col-span-6 md:col-span-4 cursor-pointer" onClick={() => router.push(`/projects`)}>
    
      <div class="group relative block rounded-xl overflow-hidden">
        <div class="aspect-w-12 aspect-h-7 sm:aspect-none rounded-xl overflow-hidden">
          <img class="group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-xl w-full object-cover" src="/images/t.jpg" alt="Image Description"/>
        </div>
        <div class="absolute bottom-0 start-0 end-0 p-2 sm:p-4">
          <div class="text-sm font-bold text-gray-800 rounded-lg bg-white p-4 md:text-xl dark:bg-neutral-800 dark:text-neutral-200">
            Help The Needy
          </div>
        </div>
      </div>
    </div>


    <div class="col-span-12 sm:col-span-6 md:col-span-4 cursor-pointer" onClick={() => router.push(`/projects`)}>
     
      <div class="group relative block rounded-xl overflow-hidden">
        <div class="aspect-w-12 aspect-h-7 sm:aspect-none rounded-xl overflow-hidden">
          <img class="group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-xl w-full object-cover" src="https://i0.wp.com/thephotographytoolkit.com/wp-content/uploads/2021/02/vertical-horizontal-38.jpg?resize=640%2C962&ssl=1" alt="Image Description"/>
        </div>
        <div class="absolute bottom-0 start-0 end-0 p-2 sm:p-4">
          <div class="text-sm font-bold text-gray-800 rounded-lg bg-white p-4 md:text-xl dark:bg-neutral-800 dark:text-neutral-200">
            Support Tourism
          </div>
        </div>
      </div>
    </div>


    <div class="col-span-12 sm:col-span-6 md:col-span-4 cursor-pointer" onClick={() => router.push(`/projects`)}>
    
      <div class="group relative block rounded-xl overflow-hidden">
        <div class="aspect-w-12 aspect-h-7 sm:aspect-none rounded-xl overflow-hidden">
          <img class="group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-xl w-full object-cover" src="https://thumbs.dreamstime.com/b/vertical-shot-road-magnificent-mountains-under-blue-sky-captured-california-163571053.jpg" alt="Image Description"/>
        </div>
        <div class="absolute bottom-0 start-0 end-0 p-2 sm:p-4">
          <div class="text-sm font-bold text-gray-800 rounded-lg bg-white p-4 md:text-xl dark:bg-neutral-800 dark:text-neutral-200">
            Support Road Const.
          </div>
        </div>
      </div>
    </div>


    

  
  </div>
</div>
  )
}

export default PopularProjects