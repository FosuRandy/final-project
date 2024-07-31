import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { toast } from 'react-toastify';

const ProjectModal = ({ project, isOpen, closeModal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [goal, setGoal] = useState('');
  const [location, setLocation] = useState('');
  const [faqs, setFaqs] = useState('');
  const [rewards, setRewards] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setCategory(project.category || '');
      setGoal(project.goal || '');
      setLocation(project.location || '');
      setFaqs(project.faqs || '');
      setRewards(project.rewards || '');
    }
  }, [project]);

  const handleUpdate = async () => {
    if (!project) return;

    try {
      await updateDoc(doc(db, 'projects', project.id), {
        title,
        description,
        category,
        goal,
        location,
        faqs,
        rewards,
        status: 'Pending', // Update status to Pending
      });
      toast.success("Project Updated Successfully")
      closeModal();
    } catch (error) {
      toast.error('Error updating project:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 left-0 z-20 h-screen w-screen bg-[#242d34bb] overflow-y-auto shadow-md`} onClick={closeModal}>
      <div className='bg-white w-[350px] md:w-[650px] text-black absolute left-[50%] translate-x-[-50%] mt-[40px] p-4 rounded-[20px] overflow-y-auto no-scrollbar h-[380px] md:h-[450px]' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-xl font-bold'>Update Project</div>
          <MdClose className='text-[22px] cursor-pointer' onClick={closeModal} />
        </div>
        <form className='space-y-4'>
          <div>
            <label className='block text-sm font-medium'>Title</label>
            <input type='text' className='w-full border rounded p-2' value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className='block text-sm font-medium'>Description</label>
            <textarea className='w-full border rounded p-2' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div>
            <label className='block text-sm font-medium'>Category</label>
            <input type='text' className='w-full border rounded p-2' value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <label className='block text-sm font-medium'>Goal</label>
            <input type='number' className='w-full border rounded p-2' value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>
          <div>
            <label className='block text-sm font-medium'>Location</label>
            <input type='text' className='w-full border rounded p-2' value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className='block text-sm font-medium'>FAQs</label>
            <textarea className='w-full border rounded p-2' value={faqs} onChange={(e) => setFaqs(e.target.value)}></textarea>
          </div>
          <div>
            <label className='block text-sm font-medium'>Rewards</label>
            <textarea className='w-full border rounded p-2' value={rewards} onChange={(e) => setRewards(e.target.value)}></textarea>
          </div>
          <button type='button' className='w-full bg-blue-500 text-white p-2 rounded mt-4' onClick={handleUpdate}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
