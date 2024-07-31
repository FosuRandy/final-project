import React from 'react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, where, query } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import ProjectModal from './ProjectModal';
import ProjectDeleteModal from './ProjectDeleteModal'
import DonatorListModal from './DonatorListModal';
import { toast } from 'react-toastify';

const Manage = () => {
    const router = useRouter();
    const { id } = router.query; // Extract the creator's user ID from URL parameters
  
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTab, setCurrentTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [isDonatorModalOpen, setIsDonatorModalOpen] = useState(false);
    const [currentDonators, setCurrentDonators] = useState([]);
    const projectsPerPage = 9;
    const [donationStats, setDonationStats] = useState({});
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          // Fetch all projects
          const querySnapshot = await getDocs(collection(db, 'projects'));
          const allProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
          // Filter projects by the current user
        //  const userProjects = allProjects.filter(project => project.addedBy === id);
  
          // Sort projects by title in ascending order
          allProjects.sort((a, b) => a.title.localeCompare(b.title));
  
          setProjects(allProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
  
      if (id) {
        fetchProjects();
      }
    }, [id]);
  
    const filterProjectsByTab = () => {
      let filteredProjects = projects;
  
      if (currentTab === 'Approved') {
        filteredProjects = projects.filter(project => project.status === 'Approved');
      } else if (currentTab === 'Pending') {
        filteredProjects = projects.filter(project => project.status === 'Pending');
      } else if (currentTab === 'Rejected') {
        filteredProjects = projects.filter(project => project.status === 'Rejected');
      } else if (currentTab === 'Verification Needed') {
        filteredProjects = projects.filter(project => project.status === 'Verification Needed');
      } else if (currentTab === 'Expired') {
        const currentDate = new Date();
        filteredProjects = projects.filter(project => new Date(project.deadline) < currentDate);
      }
  
      return filteredProjects;
    };
  
    const applySearch = (projects) => {
      return projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.fundingStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.faqs?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.rewards?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.goal && project.goal.toString().includes(searchTerm))
      );
    };
  
    const filteredProjects = applySearch(filterProjectsByTab());
  
    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  
    const handleTabClick = (tab) => {
      setCurrentTab(tab);
      setCurrentPage(1); // Reset to first page on tab change
    };

    const openModal = (project) => {
      setSelectedProject(project);
    };
  
    const closeModal = () => {
      setSelectedProject(null);
    };
  
    const openDeleteModal = (project) => {
      setProjectToDelete(project);
    };
  
    const closeDeleteModal = () => {
      setProjectToDelete(null);
    };
  
    const handleDelete = async () => {
      if (!projectToDelete) return;
  
      try {
        await deleteDoc(doc(db, 'projects', projectToDelete.id));
        setProjects(projects.filter(project => project.id !== projectToDelete.id));
        toast.success("You have successfully deleted the project.")
        closeDeleteModal();
      } catch (error) {
        toast.error('Error deleting project:', error);
      }
    };



    const calculateDonationStats = async (projectId) => {
      try {
          const donationSnapshot = await getDocs(query(collection(db, 'donations'), where('projectId', '==', projectId)));
          const totalAmountDonated = donationSnapshot.docs.reduce((total, doc) => total + doc.data().amount, 0);
          const donatorImages = donationSnapshot.docs.map(doc => doc.data().userImage);
          return { totalAmountDonated, donatorImages };
      } catch (error) {
          console.error('Error calculating donation stats:', error);
          return { totalAmountDonated: 0, donatorImages: [] };
      }
  };

  useEffect(() => {
      const fetchDonationStats = async () => {
          const donationStatsPromises = currentProjects.map(project => calculateDonationStats(project.id));
          const donationStatsResults = await Promise.all(donationStatsPromises);
          const stats = {};
          donationStatsResults.forEach((result, index) => {
              stats[currentProjects[index].id] = result;
          });
          setDonationStats(stats);
      };

      if (currentProjects.length > 0) {
          fetchDonationStats();
      }
  }, [currentProjects]);

  const handleDonatorClick = async (projectId) => {
    try {
        const donationSnapshot = await getDocs(query(collection(db, 'donations'), where('projectId', '==', projectId)));
        const donators = donationSnapshot.docs.map(doc => doc.data());
        setCurrentDonators(donators);
        setIsDonatorModalOpen(true);
    } catch (error) {
        toast.error('Error fetching donators:', error);
    }
};



  return (
    <section class="container px-4 mx-auto">
    <div class="sm:flex sm:items-center sm:justify-between">
        <div>
            <div class="flex items-center gap-x-3">
                <h2 class="text-lg font-medium text-gray-800 dark:text-white">Your Projects</h2>

                <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{projects.length} projects</span>
            </div>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">Browse through your projects created for crowdfunding</p>
        </div>

        <div class="flex items-center mt-4 gap-x-3">
            <button onClick={() => router.push(`/projects/`)} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_3098_154395)">
                    <path d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_3098_154395">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>

                <span>Discover</span>
            </button>

            <button onClick={() => router.push(`/my-admin/${id}/dashboard`)} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-rose-600 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <span>Dashboard</span>
            </button>
        </div>
    </div>

    <div class="mt-6 md:flex md:items-center md:justify-between overflow-x-auto">
        {/* Tabs */}
      <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700 mb-4">
        {['All', 'Approved', 'Pending', 'Rejected', 'Verification Needed', 'Expired'].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm ${
              currentTab === tab
                ? 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                : 'dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

        <div class="relative flex items-center mt-4 md:mt-0">
            <span class="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </span>

            <input
                type="text"
                placeholder="Search"
                className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
        </div>
    </div>










    <div class="flex flex-col mt-6">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <button class="flex items-center gap-x-3 focus:outline-none">
                                        <span>Title</span>

                                        <svg class="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                                            <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                                            <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" />
                                        </svg>
                                    </button>
                                </th>

                                <th scope="col" class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Status
                                </th>

                                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    About
                                </th>

                                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Donators</th>

                                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Donation Tracking Pin</th>

                                <th scope="col" class="relative py-3.5 px-4">
                                    <span class="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                           {currentProjects.map((project) => (
                            <tr key={project.id} onClick={() => openModal(project)} className="cursor-pointer">
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">{project.title.slice(0,6)}...</h2>
                                        <p class="text-sm font-normal text-gray-600 dark:text-gray-400">GHS{project.goal}</p>
                                    </div>
                                </td>
                                <td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                <div className={`inline px-3 py-1 text-sm font-normal rounded-full gap-x-2 ${
      project.status === 'Approved'
        ? 'text-emerald-500 bg-emerald-100/60 dark:bg-gray-800'
        : project.status === 'Pending' || project.status === 'Verification Needed'
        ? 'text-yellow-500 bg-yellow-100/60'
        : project.status === 'Rejected' || project.status === 'Expired' 
        ? 'text-rose-500 bg-rose-100/60'
        : 'text-emerald-500 bg-emerald-100/60 dark:bg-gray-800'
    }`}>
                                     {project.status}
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div>
                                        <h4 class="text-gray-700 dark:text-gray-200">{project.category.slice(0,8)}...</h4>
                                        <p class="text-gray-500 dark:text-gray-400">{project.description.slice(0,8)}...</p>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div class="flex items-center">
                                        {/*<img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                                        <img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                                        <img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1256&q=80" alt=""/>
                                        <img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                                        <p class="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">+4</p>*/}
                                      {donationStats[project.id] && donationStats[project.id].donatorImages.slice(0, 4).map((donatorImage, index) => (
                                <img
                                    key={index}
                                    className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                                    src={donatorImage}
                                    alt={`Donator ${index + 1}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDonatorClick(project.id);
                                  }}
                                />
                            ))}
                            {/* Donator Total */}
                            {donationStats[project.id] && donationStats[project.id].donatorImages.length > 4 && (
                                <p className="flex items-center justify-center w-6 h-6 -mx-"  onClick={(e) => {
                                  e.stopPropagation();
                                  handleDonatorClick(project.id);
                              }}>
                                    +{donationStats[project.id].donatorImages.length - 4}
                                </p>
                            )} 
                                    </div>
                                </td>

                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                  {/**
                                    <div class="w-48 h-1.5 bg-blue-200 overflow-hidden rounded-full">
                                        <div class="bg-blue-500 w-2/3 h-1.5"></div>
                                    </div>
                            */}
                             {donationStats[project.id] && (
                            <div className="mt-2"  
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleDonatorClick(project.id);
                              }}>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-rose-500 h-2.5 rounded-full"
                                        style={{ width: `${(donationStats[project.id].totalAmountDonated / project.goal) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {donationStats[project.id].totalAmountDonated} / {project.goal} ({((donationStats[project.id].totalAmountDonated / project.goal) * 100).toFixed(2)}%)
                                </p>
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                    GHS{project.goal - donationStats[project.id].totalAmountDonated} left to reach goal
                                </p>
                            </div>
                        )}
                                </td>

                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                <button onClick={() => openDeleteModal(project)} class="text-rose-600 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                </td>
                                {/* 
                                <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => openModal(project)} className="text-blue-500 hover:underline">View</button>
              </td>
              */}
                            </tr>
                            ))}
                            </tbody>
                            </table>
                            </div>
                            </div>
                            </div>
                            </div>
                      
                      


                       {/* Pagination */}
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-700">{currentPage}</span> of <span className="font-medium text-gray-700">{totalPages}</span>
        </div>
        <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

         {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        closeModal={closeModal}
      />  
      
      <ProjectDeleteModal
        isOpen={projectToDelete !== null}
        closeModal={closeDeleteModal}
        confirmDelete={handleDelete}
      />

    <DonatorListModal
        isOpen={isDonatorModalOpen}
        onClose={() => setIsDonatorModalOpen(false)}
        donators={currentDonators}
    />
 


</section>
  )
}

export default Manage








{/*
import React from 'react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import ProjectModal from './ProjectModal';
import ProjectDeleteModal from './ProjectDeleteModal'
import { toast } from 'react-toastify';

const Manage = () => {
    const router = useRouter();
    const { id } = router.query; // Extract the creator's user ID from URL parameters
  
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTab, setCurrentTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const projectsPerPage = 9;
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          // Fetch all projects
          const querySnapshot = await getDocs(collection(db, 'projects'));
          const allProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
          // Filter projects by the current user
         //  const userProjects = allProjects.filter(project => project.addedBy === id);
  
          // Sort projects by title in ascending order
          allProjects.sort((a, b) => a.title.localeCompare(b.title));
  
          setProjects(allProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
  
      if (id) {
        fetchProjects();
      }
    }, [id]);
  
    const filterProjectsByTab = () => {
      let filteredProjects = projects;
  
      if (currentTab === 'Approved') {
        filteredProjects = projects.filter(project => project.status === 'Approved');
      } else if (currentTab === 'Pending') {
        filteredProjects = projects.filter(project => project.status === 'Pending');
      } else if (currentTab === 'Rejected') {
        filteredProjects = projects.filter(project => project.status === 'Rejected');
      } else if (currentTab === 'Verification Needed') {
        filteredProjects = projects.filter(project => project.status === 'Verification Needed');
      } else if (currentTab === 'Expired') {
        const currentDate = new Date();
        filteredProjects = projects.filter(project => new Date(project.deadline) < currentDate);
      }
  
      return filteredProjects;
    };
  
    const applySearch = (projects) => {
      return projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.fundingStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.faqs?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.rewards?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.goal && project.goal.toString().includes(searchTerm))
      );
    };
  
    const filteredProjects = applySearch(filterProjectsByTab());
  
    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  
    const handleTabClick = (tab) => {
      setCurrentTab(tab);
      setCurrentPage(1); // Reset to first page on tab change
    };

    const openModal = (project) => {
      setSelectedProject(project);
    };
  
    const closeModal = () => {
      setSelectedProject(null);
    };
  
    const openDeleteModal = (project) => {
      setProjectToDelete(project);
    };
  
    const closeDeleteModal = () => {
      setProjectToDelete(null);
    };
  
    const handleDelete = async () => {
      if (!projectToDelete) return;
  
      try {
        await deleteDoc(doc(db, 'projects', projectToDelete.id));
        setProjects(projects.filter(project => project.id !== projectToDelete.id));
        toast.success("You have successfully deleted the project.")
        closeDeleteModal();
      } catch (error) {
        toast.error('Error deleting project:', error);
      }
    };


  return (
    <section class="container px-4 mx-auto">
    <div class="sm:flex sm:items-center sm:justify-between">
        <div>
            <div class="flex items-center gap-x-3">
                <h2 class="text-lg font-medium text-gray-800 dark:text-white">Your Projects</h2>

                <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">240 vendors</span>
            </div>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-300">Browse through your projects created for crowdfunding</p>
        </div>

        <div class="flex items-center mt-4 gap-x-3">
            <button onClick={() => router.push(`/projects/`)} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_3098_154395)">
                    <path d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_3098_154395">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>

                <span>Discover</span>
            </button>

            <button onClick={() => router.push(`/my-admin/${id}/dashboard`)} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-rose-600 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <span>Dashboard</span>
            </button>
        </div>
    </div>

    <div class="mt-6 md:flex md:items-center md:justify-between overflow-x-auto">
        
      <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700 mb-4">
        {['All', 'Approved', 'Pending', 'Rejected', 'Verification Needed', 'Expired'].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm ${
              currentTab === tab
                ? 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                : 'dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

        <div class="relative flex items-center mt-4 md:mt-0">
            <span class="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </span>

            <input
                type="text"
                placeholder="Search"
                className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
        </div>
    </div>










    <div class="flex flex-col mt-6">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <button class="flex items-center gap-x-3 focus:outline-none">
                                        <span>Company</span>

                                        <svg class="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                                            <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                                            <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" />
                                        </svg>
                                    </button>
                                </th>

                                <th scope="col" class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Status
                                </th>

                                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    About
                                </th>

                                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Users</th>

                                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">License use</th>

                                <th scope="col" class="relative py-3.5 px-4">
                                    <span class="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                           {currentProjects.map((project) => (
                            <tr key={project.id} onClick={() => openModal(project)} className="cursor-pointer">
                                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                    <div>
                                        <h2 class="font-medium text-gray-800 dark:text-white ">{project.title.slice(0,6)}...</h2>
                                        <p class="text-sm font-normal text-gray-600 dark:text-gray-400">GHS{project.goal}</p>
                                    </div>
                                </td>
                                <td class="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                <div className={`inline px-3 py-1 text-sm font-normal rounded-full gap-x-2 ${
      project.status === 'Approved'
        ? 'text-emerald-500 bg-emerald-100/60 dark:bg-gray-800'
        : project.status === 'Pending' || project.status === 'Verification Needed'
        ? 'text-yellow-500 bg-yellow-100/60'
        : project.status === 'Rejected' || project.status === 'Expired'
        ? 'text-rose-500 bg-rose-100/60'
        : 'text-emerald-500 bg-emerald-100/60 dark:bg-gray-800'
    }`}>
                                     {project.status}
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div>
                                        <h4 class="text-gray-700 dark:text-gray-200">{project.category.slice(0,8)}...</h4>
                                        <p class="text-gray-500 dark:text-gray-400">{project.description.slice(0,8)}...</p>
                                    </div>
                                </td>
                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div class="flex items-center">
                                        <img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                                        <img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                                        <img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1256&q=80" alt=""/>
                                        <img class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt=""/>
                                        <p class="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">+4</p>
                                    </div>
                                </td>

                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <div class="w-48 h-1.5 bg-blue-200 overflow-hidden rounded-full">
                                        <div class="bg-blue-500 w-2/3 h-1.5"></div>
                                    </div>
                                </td>

                                <td class="px-4 py-4 text-sm whitespace-nowrap">
                                <button onClick={() => openDeleteModal(project)} class="text-rose-600 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                </td>
                                {/* 
                                <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => openModal(project)} className="text-blue-500 hover:underline">View</button>
              </td>
              
                            </tr>
                            ))}
                            </tbody>
                            </table>
                            </div>
                            </div>
                            </div>
                            </div>
                      
                      


                       
      <div className="mt-6 sm:flex sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-700">{currentPage}</span> of <span className="font-medium text-gray-700">{totalPages}</span>
        </div>
        <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>Previous</span>
          </button>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

         
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        closeModal={closeModal}
      />  
      
      <ProjectDeleteModal
        isOpen={projectToDelete !== null}
        closeModal={closeDeleteModal}
        confirmDelete={handleDelete}
      />

 


</section>
  )
}

export default Manage

*/}