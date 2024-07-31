import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/header/header";
import Banner from "@/components/header/banner";
import Layout from "@/components/layout";
import WhoWeSupport from "@/components/WhoWeSupport";
import CTA from "@/components/CTA";
import FeaturedProjects from "@/components/FeaturedProjects";
import FAQ from "@/components/FAQ";
import Clients from "@/components/Clients";
import Team from "@/components/Team";
import Categories from "@/components/categories";
import Blogs from "@/components/blog";
import Testimonials from "@/components/Testimonials";
import PopularProjects from "@/components/PopularProjects";
import Features from "@/components/Features";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout
      className={` ${inter.className}`}
    >
      <Banner/>
      <FeaturedProjects/>
      <PopularProjects/>
      <Categories/>
      <WhoWeSupport/>
      <Team/>
      <Features/>
      <Testimonials/>
      <FAQ/>
    {/* <Blogs/>
     <Clients/> */}
      <CTA/>
    </Layout>
  );
}
