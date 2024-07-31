// pages/projects/[projectId].js

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

const ProjectDetailsPage = () => {
  const router = useRouter();
  const { projectId } = router.query; // Extract projectId from URL parameters

  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (projectDoc.exists()) {
          setProject({ id: projectDoc.id, ...projectDoc.data() });
        } else {
          console.error('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>; // Display loading indicator while fetching project details
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p>Description: {project.description}</p>
      {/* Display other project details */}
    </div>
  );
};

export default ProjectDetailsPage;
