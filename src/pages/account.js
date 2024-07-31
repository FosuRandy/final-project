import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/header/header";
import Banner from "@/components/header/banner";
import Layout from "@/components/account/layout";
import WhoWeSupport from "@/components/WhoWeSupport";
import CTA from "@/components/CTA";
import FeaturedProjects from "@/components/FeaturedProjects";
import FAQ from "@/components/FAQ";
import Clients from "@/components/Clients";
import Team from "@/components/Team";
import Categories from "@/components/categories";
import ContactUsBanner from "@/components/header/ContactUsBanner";
import Sidebar from "@/components/account/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function Account() {
  return (
    <Layout
      className={` ${inter.className}`}
      >
     <div className="className='sm:ml-[81px] xl:ml-[340px] w-[100%] md:w-[70%] lg:w-[70%] xl:w-[75%] h-screen min-h-screen  text-[#16181C] overflow-y-auto no-scrollbar'">
        <span className="text-xl font-bold"></span>
        <CTA/>
        <FeaturedProjects/>
      </div>
    </Layout>
  );
}
