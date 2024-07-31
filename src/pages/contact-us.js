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
import ContactUsBanner from "@/components/header/ContactUsBanner";

const inter = Inter({ subsets: ["latin"] });

export default function Contactus() {
  return (
    <Layout
      className={` ${inter.className}`}
    >
      <ContactUsBanner/>
    
      <CTA/>
    </Layout>
  );
}
