import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/account/layout";
import CTA from "@/components/CTA";
import FeaturedProjects from "@/components/FeaturedProjects";
import Manage from "@/components/account/projects/Manage";

const inter = Inter({ subsets: ["latin"] });

export default function ManageProjects() {
  return (
    <Layout
      className={` ${inter.className}`}
      >
         {/* display all projects created by the current user, he can be able to edit/delete/update projects */}
     <div className="sm:ml-[81px] xl:ml-[340px] w-[100%] md:w-[70%] lg:w-[70%] xl:w-[75%] h-screen min-h-screen  text-[#16181C] overflow-y-auto no-scrollbar">
        
         <Manage/>
      </div>
    </Layout>
  );
}
