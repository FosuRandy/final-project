import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config'; // Firebase configuration
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import VerifyAccount from './VerifyAccount';
import RejectedAccount from './RejectedAccount';

const Dashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [projects, setProjects] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, 'users', id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserDetails(userData);
            console.log('User Details:', userData);

            // Check user type and redirect accordingly
            if (!userData.isCreator && userData.isMiniAdmin) {
              router.push(`/dashboard/${id}/dashboard`);
            } else if (!userData.isCreator && userData.isSuperAdmin) {
              router.push(`/my-admin/${id}/dashboard`);
            } else if (!userData.isDonor && userData.isMiniAdmin) {
              router.push(`/dashboard/${id}/dashboard`);
            } else if (!userData.isDonor && userData.isSuperAdmin) {
              router.push(`/my-admin/${id}/dashboard`);
            }

            // Fetch verification status
            if (userData.isCreator) {
              const verificationQuery = query(collection(db, 'applyVerification'), where('addedBy', '==', id));
              const verificationSnapshot = await getDocs(verificationQuery);
              
              if (!verificationSnapshot.empty) {
                const verificationData = verificationSnapshot.docs[0].data();
                setVerificationStatus(verificationData.status);
              } else {
                setVerificationStatus('Not Applied');
              }
            }
          } else {
            console.log('User not found');
            router.push('/signin');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    console.log('UID:', id); // Log UID to check if it's defined

    fetchUserData();
  }, [id, router]);

  useEffect(() => {
    const fetchProjectsAndDonations = async () => {
      try {
        if (userDetails?.isCreator) {
          // Fetch projects by the current creator
          const projectsQuery = query(collection(db, 'projects'), where('addedBy', '==', id));
          const projectsSnapshot = await getDocs(projectsQuery);
          const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Fetch donations for the current creator's projects
          const donationsQuery = query(collection(db, 'donations'), where('projectId', 'in', projectsData.map(project => project.id)));
          const donationsSnapshot = await getDocs(donationsQuery);
          const donationsData = donationsSnapshot.docs.map(doc => doc.data());

          // Calculate total donations and map donations to projects
          let totalDonationsAmount = 0;
          const projectDonations = projectsData.map(project => {
            const projectDonations = donationsData.filter(donation => donation.projectId === project.id);
            const projectTotalDonations = projectDonations.reduce((acc, donation) => acc + donation.amount, 0);
            totalDonationsAmount += projectTotalDonations;
            return { ...project, donations: projectDonations, totalDonations: projectTotalDonations };
          });

          setProjects(projectDonations);
          setTotalDonations(totalDonationsAmount);
        } else if (userDetails?.isDonor) {
          // Fetch donations made by the current donor
          const donationsQuery = query(collection(db, 'donations'), where('userId', '==', id));
          const donationsSnapshot = await getDocs(donationsQuery);
          const donationsData = donationsSnapshot.docs.map(doc => doc.data());

          // Calculate total donations
          const totalDonationsAmount = donationsData.reduce((acc, donation) => acc + donation.amount, 0);
          setDonations(donationsData);
          setTotalDonations(totalDonationsAmount);
        }
      } catch (error) {
        toast.error('Error fetching projects and donations:', error.message);
        console.error('Error fetching projects and donations:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails) {
      fetchProjectsAndDonations();
    }
  }, [id, userDetails]);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <section>
      {verificationStatus === 'Verified' ? (
        <>
          <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-blue-600 p-8 md:p-12 lg:px-16 lg:py-24">
                <div className="mx-auto max-w-xl text-center">
                  <h2 className="text-2xl font-bold text-white md:text-3xl">
                    {userDetails?.isCreator ? 'Total Earnings' : 'Total Donations'}
                  </h2>

                  <p className="hidden text-white/90 sm:mt-4 sm:block">
                    {userDetails.isCreator && (
                      <>Welcome to your dashboard! Track your project progress and manage your active and expired projects efficiently.</>
                    )}
                    {userDetails.isDonor && (
                      <>Welcome to your dashboard! Browse through projects, Track your Donations and view your favorite projects efficiently.</>
                    )}
                  </p>

                  <div className="mt-4 md:mt-8">
                    <a
                      href="#"
                      className="inline-block rounded border border-white bg-white px-12 py-3 text-sm font-semibold text-xl text-blue-500 transition hover:bg-transparent hover:text-white focus:outline-none focus:ring focus:ring-yellow-400"
                    >
                      {userDetails?.currency}{totalDonations.toFixed(2)}
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=654&q=80"
                  className="h-40 w-full object-cover sm:h-56 md:h-full"
                />

                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                  className="h-40 w-full object-cover sm:h-56 md:h-full"
                />
              </div>
            </div>
          </div>

          <div className="container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  {userDetails?.isCreator ? 'Projects Summary' : 'Donations Summary'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {userDetails?.isCreator ? (
                    projects.map((project) => (
                      <div key={project.id} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
                        <div class="h-38 flex flex-col justify-center items-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center rounded-t-xl">
                          <img src={project.image} alt="project image" className='w-full h-38 rounded-md' />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">{truncateString(project.title, 15)}</h4>
                        <p className="text-gray-600 mb-2">{truncateString(project.category, 15)}</p>
                        <p className="text-gray-800 font-semibold">Goal: {userDetails?.currency} {project.goal}</p>
                        <p className="text-gray-800 font-semibold">Donations: ${project.totalDonations.toFixed(2)}</p>
                        <p className="text-gray-600">{project.deadline} left</p>
                        <p className={`mt-2 ${project.status === 'Approved' ? 'text-green-600' : project.status === 'Pending' ? 'text-yellow-600' : 'text-rose-600'}`}>{project.status}</p>
                      </div>
                    ))
                  ) : (
                    donations.map((donation, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
                        <div class="h-38 flex flex-col justify-center items-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center rounded-t-xl">
                          <img src={donation.projectImage} alt="project image" className='w-full h-38 rounded-md' />
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Project: {donation.projectTitle}</h4>
                        <p className="text-gray-800 font-semibold">Amount: {userDetails?.currency}{donation.amount.toFixed(2)}</p>
                        <p className="text-gray-600">Donated on: {new Date(donation.timestamp).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : verificationStatus === 'Pending' ? (
        <VerifyAccount />
      ) : verificationStatus === 'Rejected' ? (
        <RejectedAccount />
      ) : (
        <VerifyAccount />
      )}
    </section>
  );
};

export default Dashboard;
