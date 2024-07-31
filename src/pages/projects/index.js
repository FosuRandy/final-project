import React, { useState } from 'react';
import Layout from '@/components/projects/layout';
import ProjectDisplay from '@/components/projects/ProjectDisplay';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function ProjectPage() {
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('relevance');

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  return (
    <Layout onFilterChange={handleFilterChange} onSortChange={handleSortChange} className={` ${inter.className}`}>
      <div className="sm:ml-[81px] xl:ml-[340px] w-[100%] md:w-[70%] lg:w-[70%] xl:w-[75%] h-screen min-h-screen  text-[#16181C] overflow-y-auto no-scrollbar">
        <ProjectDisplay filters={filters} sortOption={sortOption} />
      </div>
    </Layout>
  );
}
