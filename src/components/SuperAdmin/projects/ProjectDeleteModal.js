import React from 'react';
import { MdClose } from 'react-icons/md';

const ProjectDeleteModal = ({ isOpen, closeModal, confirmDelete }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed top-0 left-0 z-20 h-screen w-screen bg-[#242d34bb] overflow-y-auto shadow-md`} onClick={closeModal}>
      <div className='bg-white w-[350px] md:w-[450px] text-black absolute left-[50%] translate-x-[-50%] mt-[40px] p-4 rounded-[20px] overflow-y-auto no-scrollbar h-[200px] md:h-[250px]' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-xl font-bold'>Delete Project</div>
          <MdClose className='text-[22px] cursor-pointer' onClick={closeModal} />
        </div>
        <p>Are you sure you want to delete this project? You cannot recover it after deletion.</p>
        <div className='flex justify-end mt-4'>
          <button onClick={closeModal} className='bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2'>No</button>
          <button onClick={confirmDelete} className='bg-red-500 text-white px-4 py-2 rounded'>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeleteModal;
