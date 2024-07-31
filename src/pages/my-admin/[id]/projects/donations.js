import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/SuperAdmin/layout";
import CTA from "@/components/CTA";
import FeaturedProjects from "@/components/FeaturedProjects";
const inter = Inter({ subsets: ["latin"] });

export default function donations() {
  return (
    <Layout
      className={` ${inter.className}`}
      >
     <div className="sm:ml-[81px] xl:ml-[340px] w-[100%] md:w-[70%] lg:w-[70%] xl:w-[75%] h-screen min-h-screen  text-[#16181C] overflow-y-auto no-scrollbar">
        <span className="text-xl font-bold"></span>
        <CTA/>
        <FeaturedProjects/>
      </div>
    </Layout>
  );
}
