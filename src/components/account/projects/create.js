import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ref, uploadBytesResumable, getDownloadURL, uploadString  } from 'firebase/storage';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import {db,storage} from '../../../firebase.config';
import { AiOutlineArrowLeft, AiOutlineVideoCameraAdd, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import VerifyAccount from '../VerifyAccount';

const Create = () => {

  const router = useRouter()
    const { id } = router.query;
    const [userDetails, setUserDetails] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');
    const [image, setImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [budget, setBudget] = useState('');
    const [rewards, setRewards] = useState('');
    const [team, setTeam] = useState('');
    const [risks, setRisks] = useState('');
    const [faqs, setFaqs] = useState('');
    const [location, setLocation] = useState('');
    const [socialLinks, setSocialLinks] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [activeTab, setActiveTab] = useState('image'); // default tab is 'image'
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
                if (!userData.isCreator || !userData.isDonor && userData.isMiniAdmin) {
                    // User is not a creator or donor but is a mini admin, redirect to /dashboard
                    router.push(`/dashboard/${id}/dashboard`);
                } else if (!userData.isCustomer && userData.isSuperAdmin) {
                    // User is not a customer but is a super admin, redirect to /my-admin
                    router.push(`/my-admin/${id}/dashboard`);
                } else {
                    // User is a customer or user type not recognized, continue rendering the page
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

     // video upload
      const addVideoToPost = (e) => {
        if (selectedFile) {
          setErrorMessage('You have already uploaded an image. Please remove it before uploading a video.');
          return;
        }
        setErrorMessage('');

        const reader = new FileReader();
        if (e.target.files[0]) {
          reader.readAsDataURL(e.target.files[0]);
        }
    
        reader.onload = (readerEvent) => {
          setSelectedVideo(readerEvent.target.result);
        };
      };

      // image upload
      const addImageToPost = (e) => {
        if (selectedVideo) {
          setErrorMessage('You have already uploaded a video. Please remove it before uploading an image.');
          return;
        }

        const reader = new FileReader();
        if (e.target.files[0]) {
          reader.readAsDataURL(e.target.files[0]);
        }
    
        reader.onload = (readerEvent) => {
          setSelectedFile(readerEvent.target.result);
        };
      };


       // Function to clear selected image
       const clearSelectedFile = () => {
        setSelectedFile(null);
        setErrorMessage(''); // Clear error message when image is deleted
      };
    
      // Function to clear selected video
      const clearSelectedVideo = () => {
        setSelectedVideo(null);
        setErrorMessage(''); // Clear error message when video is deleted
      };




      const addProject = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
          const docRef = await addDoc(collection(db, "projects"), {
            title: title,
            description: description,
            category: category,
            goal: goal,
            deadline: deadline,
            budget: budget,
            rewards: rewards,
            team: team,
            risks: risks,
            faqs: faqs,
            location: location,
            socialLinks: socialLinks,
            contactInfo: contactInfo,
            status: 'Pending',
            isVerified: false,
          });
      
          const projectData = {
            projectId: docRef.id,  // Store the project ID
            addedBy: userDetails.uid,
            addedByImage: userDetails.photoURL,
            displayName: userDetails.displayName,
            currency: userDetails.currency,
            createdAt: new Date().toISOString()
          };
      
          if (selectedFile) {
            const imageRef = ref(storage, `projects/${docRef.id}/images/${Date.now()}_${selectedFile.name}`);
            await uploadString(imageRef, selectedFile, 'data_url');
            const imageUrl = await getDownloadURL(imageRef);
            projectData.image = imageUrl;
          }
      
          if (selectedVideo) {
            const videoRef = ref(storage, `projects/${docRef.id}/videos/${Date.now()}_${selectedVideo.name}`);
            await uploadString(videoRef, selectedVideo, 'data_url');
            const videoUrl = await getDownloadURL(videoRef);
            projectData.video = videoUrl;
          }
      
          const projectDocRef = doc(db, 'projects', docRef.id);
          await updateDoc(projectDocRef, projectData);
        
          setLoading(false);
          toast.success("Project added successfully!");
          router.push(`/account/${id}/projects`);
        } catch (err) {
          setLoading(false);
          toast.error("Project not added! Error: " + err.message);
        }
      };
      
  return (
<div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
{userDetails?.isVerified ? (<>
  <form onSubmit={addProject}>
    <div class="bg-white rounded-xl shadow dark:bg-neutral-900">
      <div class="relative h-40 rounded-t-xl bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center">
        {/*
        <div class="absolute top-0 end-0 p-4">
          <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
            <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Upload header
          </button>
        </div>
  */}
      </div>

      <div class="pt-0 p-4 sm:pt-0 sm:p-7">
       
        <div class="space-y-4 sm:space-y-6">
          <div>
            <label class="sr-only">
              Product photo
            </label>

            <div class="grid sm:flex sm:items-center sm:gap-x-5">
              <img class="-mt-8 relative z-10 inline-block size-24 mx-auto sm:mx-0 rounded-full ring-4 ring-white dark:ring-neutral-900" src={userDetails?.photoURL} alt="Project Image"/>
               {/*
              <div class="mt-4 sm:mt-auto sm:mb-1.5 flex justify-center sm:justify-start gap-2">
                <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  Upload logo
                </button>
                <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-red-500 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800">
                  Delete
                </button>
              </div>
*/}
            </div>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Project Title
            </label>

            <input id="af-submit-app-project-name" value={title} onChange={(e) => setTitle(e.target.value)} required type="text" class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Enter project name"/>
          </div>
{/*
          <div class="space-y-2">
            <label for="af-submit-project-url" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Project URL
            </label>

            <input id="af-submit-project-url" type="text" class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="https://example.so"/>
          </div>
*/}
          <div className="flex border-b border-gray-300 mb-4">
        <button
           type="button" // Prevent form submission
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2 -mb-[1px] ${activeTab === 'image' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'} focus:outline-none`}
        >
          Preview Image
        </button>
        <button
           type="button" // Prevent form submission
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 -mb-[1px] ${activeTab === 'video' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'} focus:outline-none`}
        >
          Preview Video
        </button>
      </div>
      
      {/* Display error message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {activeTab === 'image' ? (
          <>
          <div class="space-y-2">
            <label for="af-submit-app-upload-images" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Preview image
            </label>

            <label for="af-submit-app-upload-images" class="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
              <input id="af-submit-app-upload-images" name="af-submit-app-upload-images" type="file" accept="image/*" class="sr-only" onChange={addImageToPost}/>
              <svg class="size-10 mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
              </svg>
              <span class="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                Browse your device or <span class="group-hover:text-blue-700 text-blue-600">drag &apos;n drop&apos;</span>
              </span>
              <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                Maximum file size is 2 MB
              </span>
            </label>
          </div>

          {selectedFile && (

<div className="relative mb-4">
    <div className='absolute w-8 h-8 bg-[#15181c] hover:[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer' onClick={clearSelectedFile}>
        <AiOutlineClose className='text-white h-5' />
    </div>

    <img
        src={selectedFile}
        alt=""
        className='rounded-2xl max-h-80 object-contain' />

</div>

)}
</>
) : (
  <>
  <div class="space-y-2">
  <label for="af-submit-app-upload-images" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
    Preview Video
  </label>

  <label for="af-submit-app-upload-images" class="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
    <input id="af-submit-app-upload-images" name="af-submit-app-upload-images" type="file" accept="video/*" class="sr-only" onChange={addVideoToPost}/>
    <svg class="size-10 mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
    </svg>
    <span class="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
      Browse your device or <span class="group-hover:text-blue-700 text-blue-600">drag &apos;n drop&apos;</span>
    </span>
    <span class="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
      Maximum file size is 2 MB
    </span>
  </label>
</div>
{selectedVideo && (
    <div className="relative mb-4">
        <div
        className="relative w-8 h-8 bg-[#15181c] hover:[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
        onClick={clearSelectedVideo}
        >
        <AiOutlineClose className="text-white h-5" />
        </div>
        {/* Display the selected video */}
        <video
        controls
        src={selectedVideo}
        className="rounded-2xl max-h-80"
        ></video>
    </div>
    )}
    </>
)}

          <div class="space-y-2">
            <label for="af-submit-app-category" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Category
            </label>

            <select id="af-submit-app-category" value={category} onChange={(e) => setCategory(e.target.value)} required class="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
              <option selected>Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
              <option value="Film & Video">Film & Video</option>
              <option value="Games">Games</option>
              <option value="Design">Design</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Publishing">Publishing</option>
              <option value="Community & Social Causes">Community & Social Causes</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Education">Education</option>
              <option value="Travel & Adventure">Travel & Adventure</option>
              <option value="Crafts & DIY">Crafts & DIY</option>
              <option value="Fashion & Accessories">Fashion & Accessories</option>
              <option value="Sports & Recreation">Sports & Recreation</option>
              <option value="Photography">Photography</option>
              <option value="Dance">Dance</option>
              <option value="Theater">Theater</option>
              <option value="Writing & Journalism">Writing & Journalism</option>
              <option value="Comics">Comics</option>
              <option value="Podcasts, Blogs & Vlogs">Podcasts, Blogs & Vlogs</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Pets & Animals">Pets & Animals</option>
              <option value="Toys & Hobbies">Toys & Hobbies</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Cars & Motorcycles">Cars & Motorcycles</option>
              <option value="Technology Accessories">Technology Accessories</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-description" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Description
            </label>

            <textarea id="af-submit-app-description" value={description} onChange={(e) => setDescription(e.target.value)} required class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="A detailed summary will better explain your products to the audiences. Our users will see this in your dedicated product page."></textarea>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Funding Goal
            </label>

            <input id="af-submit-app-project-name"  value={goal} onChange={(e) => setGoal(e.target.value)} required type="number" 
            class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
             placeholder="The total amount of money needed to complete the project."/>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Deadline
            </label>

            <input id="af-submit-app-project-name" value={deadline} onChange={(e) => setDeadline(e.target.value)} required type="date" class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="The end date for the fundraising campaign."/>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
            Detailed Budget
            </label>
            <textarea id="af-submit-app-description" value={budget} onChange={(e) => setBudget(e.target.value)} required class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="A breakdown of how the funds will be used. This provides transparency to backers."></textarea>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
            Rewards/Tiers
            </label>
            <textarea id="af-submit-app-description" value={rewards} onChange={(e) => setRewards(e.target.value)} required class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="Different reward levels for backers, detailing what they will receive based on their contribution amount."></textarea>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
            Team Members
            </label>
            <textarea id="af-submit-app-description" value={team} onChange={(e) => setTeam(e.target.value)} required class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="Information about the team behind the project, including names, roles, and brief bios."></textarea>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
            Risks and Challenges
            </label>
            <textarea id="af-submit-app-description" value={risks} onChange={(e) => setRisks(e.target.value)} required class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="Information about potential risks and challenges the project may face and how the team plans to address them."></textarea>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
            FAQs
            </label>
            <textarea id="af-submit-app-description" value={faqs} onChange={(e) => setFaqs(e.target.value)} required class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="Frequently Asked Questions to address common queries from potential backers."></textarea>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Location
            </label>

            <input id="af-submit-app-project-name" value={location} onChange={(e) => setLocation(e.target.value)} required type="text" class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="The geographical location where the project is based or where the funds will be utilized."/>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
              Social Media Links
            </label>

            <input id="af-submit-app-project-name" value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} required type="text" class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Links to the project's social media profiles to engage with the community and provide updates."/>
          </div>

          <div class="space-y-2">
            <label for="af-submit-app-project-name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
            Contact Information
            </label>

            <input id="af-submit-app-project-name" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required type="text" class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Information on how backers can get in touch with the project team."/>
          </div>


        </div>
        {loading ? (
          <div class="mt-5 flex justify-center gap-x-2">
          <button type="submit" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-blue-700 disabled:opacity-50 pointer-events-none cursor-not-allowed">
            Submiting...
          </button>
        </div>
        ) : (
        <div class="mt-5 flex justify-center gap-x-2">
          <button type="submit" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
            Submit your project
          </button>
        </div>
        )}
      </div>
    </div>
  </form>
  </>) : (
    <VerifyAccount/>
  )}
</div>
  )
}

export default Create