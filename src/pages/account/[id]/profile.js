import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/account/layout";
import CTA from "@/components/CTA";
import FeaturedProjects from "@/components/FeaturedProjects";
import Profile from "@/components/account/profile";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ["latin"] });

export default function TheUserProfile() {


  return (

    <Layout
      className={` ${inter.className}`}
      >
     <div className="className='sm:ml-[81px] xl:ml-[340px] w-[100%] md:w-[70%] lg:w-[70%] xl:w-[75%] h-screen min-h-screen  text-[#16181C] overflow-y-auto no-scrollbar'">  
        <Profile/>
      </div>
    </Layout>
  );
}
