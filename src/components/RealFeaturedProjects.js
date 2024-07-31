import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useRouter } from 'next/router';

const RealFeaturedProjects = ({ filters, sortOption }) => {
  const router = useRouter()
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter approved projects
      const approvedProjects = projectsList.filter(project => project.status === "Approved");

      // Randomize the approved projects
      const randomizedProjects = shuffleArray(approvedProjects);

      setProjects(randomizedProjects);
      applyFiltersAndSorting(randomizedProjects);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting(projects);
  }, [filters, sortOption, projects, currentPage]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const applyFiltersAndSorting = (projectsList) => {
    let filtered = projectsList;

    setFilteredProjects(filtered);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  // Pagination logic
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };


  return (
    <div class="max-w-[85rem] px-0 sm:pb-10 md:py-1 md:px-8 lg:px-8 lg:py-1 md:mx-auto lg:mx-auto">
       
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 md:gap-6 lg:gap-6 xl:gap-6 mb-20">
{/* 
      {filteredProjects.map(project => (
        <div key={project.id} className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold">{project.title}</h2>
          <p>{project.description}</p>
          
        </div>
      ))}
      */}
 {currentProjects.map(project => (
<div key={project.id} onClick={() => router.push(`/projects/${project.id}`)} class="cursor-pointer group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
          <div class="h-48 flex flex-col justify-center items-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center rounded-t-xl">
            <img src={project.image} alt="project image" className='w-full h-48 rounded-md' />
          </div>
          <div class="p-4 md:p-6">
            <span class="block mb-1 text-[9px] md:text-xs lg:text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
            {truncateString(project.displayName, 14)}
            </span>
            <h3 class="text-sm md:text-lg lg:text-lg font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
            {truncateString(project.title, 15)}
            </h3>
            <p class="mt-3 text-xs md:text-md lg:text-md text-gray-500 dark:text-neutral-500">
            {truncateString(project.description, 16)}
            </p>
          </div>
          <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
            <a class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800" href="#">
            {truncateString(project.location, 6)}
            </a>
            <a class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800" href="#">
              ${project.goal}
            </a>
          </div>
        </div>
        ))} 
    </div>
    <div className="flex justify-between mt-4 mb-4">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handlePreviousPage}
          >
            Previous
          </button>
        )}
        {indexOfLastProject < filteredProjects.length && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleNextPage}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

// Helper function to get goal range values
const getGoalRange = (range) => {
  switch (range) {
    case 'low':
      return [0, 1000];
    case 'mid':
      return [1000, 10000];
    case 'high':
      return [10000, Infinity];
    default:
      return [0, Infinity];
  }
};

export default RealFeaturedProjects;
