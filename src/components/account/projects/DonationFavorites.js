import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config'; // Firebase configuration
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const DonationFavorite = () => {
  const router = useRouter();
  const { id } = router.query;
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteDonations = async () => {
      try {
        const donationsQuery = query(collection(db, 'donations'), where('userId', '==', id));
        const donationsSnapshot = await getDocs(donationsQuery);
        const donationsData = donationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const projectDonationCounts = donationsData.reduce((acc, donation) => {
          acc[donation.projectId] = (acc[donation.projectId] || 0) + 1;
          return acc;
        }, {});

        const favoriteProjectsIds = Object.keys(projectDonationCounts).filter(
          projectId => projectDonationCounts[projectId] > 1
        );

        const favoriteProjectsPromises = favoriteProjectsIds.map(async projectId => {
          const projectDocRef = doc(db, 'projects', projectId);
          const projectDocSnapshot = await getDoc(projectDocRef);
          return { id: projectId, ...projectDocSnapshot.data() };
        });

        const favoriteProjectsData = await Promise.all(favoriteProjectsPromises);
        setFavoriteProjects(favoriteProjectsData);
      } catch (error) {
        console.error('Error fetching favorite donations:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFavoriteDonations();
    }
  }, [id]);

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
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">Favorite Donations</h2>
          <p className="text-gray-600 mt-4">Here are the projects you&apos;ve donated to multiple times.</p>
        </div>
      </div>
      
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <h3 className="text-xl font-bold mb-4">Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteProjects.length > 0 ? (
                favoriteProjects.map((project) => (
                  <div key={project.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div class="h-38 flex flex-col justify-center items-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center rounded-t-xl">
                        <img src={project.image} alt="project image" className='w-full h-38 rounded-md' />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{truncateString(project.title, 15)}</h4>
                    <p className="text-gray-600 mb-2">{truncateString(project.category, 15)}</p>
                    <p className="text-gray-800 font-semibold">Goal: ${project.goal}</p>
                    <p className="text-gray-800 font-semibold">Status: {project.status}</p>
                    <p className="text-gray-600">{project.deadline} left</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">You haven&apos;t donated to any project multiple times yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default  DonationFavorite;
