import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ref, uploadBytesResumable, getDownloadURL, uploadString } from 'firebase/storage';
import { collection, addDoc, getDoc, doc, updateDoc, where, query, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebase.config';
import { AiOutlineArrowLeft, AiOutlineVideoCameraAdd, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';

const VerifyAccount = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userDetails, setUserDetails] = useState(null);
  const [accountType, setAccountType] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [taxID, setTaxID] = useState('');
  const [image, setImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('image'); // default tab is 'image'
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false); // State to track application submission status

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


  
  useEffect(() => {
    if (userDetails) {
      // Check if the user has already submitted an application
      const checkApplication = async () => {
        const applyVerifyQuery = query(
          collection(db, 'applyVerification'),
          where('addedBy', '==', userDetails.uid)
        );

        try {
          const querySnapshot = await getDocs(applyVerifyQuery);
          if (!querySnapshot.empty) {
            // User has already submitted an application
            setApplicationSubmitted(true);
          }
        } catch (error) {
          console.error('Error checking application:', error);
        }
      };

      checkApplication();
    }
  }, [userDetails]);


  // Video upload
  const addVideoToPost = (e) => {
    setErrorMessage('');
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedVideo(readerEvent.target.result);
    };
  };

  // Image upload
  const addImageToPost = (e) => {
    setErrorMessage('');
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

  const submitVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, 'applyVerification'), {
        accountType,
        fullName,
        dob,
        nationalID,
        address,
        businessName,
        registrationNumber,
        taxID,
        status: 'Pending',
        isVerified: false,
        addedBy: userDetails.uid,
        addedByImage: userDetails.photoURL,
        displayName: userDetails.displayName,
        campaign: userDetails.category,
        createdAt: new Date().toISOString()
      });

      const verificationData = {
        verificationId: docRef.id,  // Store the verification ID
        addedBy: userDetails.uid,
        addedByImage: userDetails.photoURL,
        displayName: userDetails.displayName,
        campaign: userDetails.category,
        createdAt: new Date().toISOString()
      };

      if (selectedFile) {
        const imageRef = ref(storage, `applyVerification/${docRef.id}/images/${Date.now()}_${selectedFile.name}`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const imageUrl = await getDownloadURL(imageRef);
        verificationData.image = imageUrl;
      }

      if (selectedVideo) {
        const videoRef = ref(storage, `applyVerification/${docRef.id}/videos/${Date.now()}_${selectedVideo.name}`);
        await uploadString(videoRef, selectedVideo, 'data_url');
        const videoUrl = await getDownloadURL(videoRef);
        verificationData.video = videoUrl;
      }

      const verificationDocRef = doc(db, 'applyVerification', docRef.id);
      await updateDoc(verificationDocRef, verificationData);

      setLoading(false);
      toast.success("Verification application submitted successfully!");
      router.push(`/account/${id}/dashboard`);
    } catch (err) {
      setLoading(false);
      toast.error("Verification application not submitted! Error: " + err.message);
      console.log("Verification application not submitted! Error: " + err.message);
    }
  };

  return (
    <div className="md:max-w-4xl md:px-4 md:py-10 pb-10  lg:px-8 lg:py-14 mx-auto">
      {applicationSubmitted ? (
          // Display a message if the application has already been submitted
          <p className="text-md md:text-2xl lg:text-2xl font-semibold mx-3 p-5 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-black">
            Your Verification Application Has Been Submitted, 
            We Will Assess Your Info And Brief You On Your Verification Status Shortly.
          </p>
        ) : (<>
      <form onSubmit={submitVerification}>
        <div className="bg-white rounded-xl shadow dark:bg-neutral-900">
          <div className="relative h-40 rounded-t-xl bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center"></div>
          <div className="pt-0 p-4 sm:pt-0 sm:p-7">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="sr-only"></label>
                <div className="grid sm:flex sm:items-center sm:gap-x-5">
                  <img className="-mt-8 relative z-10 inline-block size-24 mx-auto sm:mx-0 rounded-full ring-4 ring-white dark:ring-neutral-900" src={userDetails?.photoURL} alt="User Image" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="accountType" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                  Account Type
                </label>
                <select
                  id="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  required
                  className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                >
                  <option value="">Select Account Type</option>
                  <option value="Business">Business</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              {accountType === 'Individual' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Full Legal Name
                    </label>
                    <input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      type="text"
                      className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Enter full legal name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dob" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                      type="date"
                      className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Enter date of birth"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="nationalID" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      National ID Number
                    </label>
                    <input
                      id="nationalID"
                      value={nationalID}
                      onChange={(e) => setNationalID(e.target.value)}
                      required
                      type="text"
                      className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Enter national ID number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Address
                    </label>
                    <input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      type="text"
                      className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Enter address"
                    />
                  </div>
                </>
              )}
              {accountType === 'Business' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="businessName" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      type="text"
                      className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="registrationNumber" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Business Registration Number
                    </label>
                    <input
                      id="registrationNumber"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      required
                      type="text"
                      className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Enter business registration number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="taxID" className="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Tax ID
                    </label>
                    <input
                      id="taxID"
                      value={taxID}
                      onChange={(e) => setTaxID(e.target.value)}
                      required
                      type="text"
                      className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Enter tax ID"
                    />
                  </div>
                </>
              )}
              <div className="border-t border-gray-200 dark:border-neutral-700"></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  Verification Documents
                </h3>
                <div className="flex items-center mt-4">
                  
                  <button
                    type="button"
                    className={`mr-4 py-2 px-4 border rounded-md ${activeTab === 'image' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-800 dark:text-neutral-200'}`}
                    onClick={() => setActiveTab('image')}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 border rounded-md ${activeTab === 'video' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-800 dark:text-neutral-200'}`}
                    onClick={() => setActiveTab('video')}
                  >
                    Upload Video
                  </button>
                </div>
                {activeTab === 'image' && (
                  <div className="mt-4">
                    {accountType === 'Business' && (
                    <label htmlFor="image" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a photo of your Business Certificate
                    </label>
                    )}
                    {accountType === 'Individual' && (
                    <label htmlFor="image" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a photo of your National ID specified
                    </label>
                    )}
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
                    {selectedFile && (
                      <div className="mt-4 relative">
                        <img
                          src={selectedFile}
                          alt="Selected"
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={clearSelectedFile}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'video' && (
                  <div className="mt-4">
                    {accountType === 'Business' && (
                    <label htmlFor="video" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a video of you holding your business certificate, explaining why you chose to apply as a creator and why you chose <span className='font-semibold'>{userDetails.category}</span> as your crowdfunding campaign. also showcase other documents if there are any.
                    </label>
                    )}
                    {accountType === 'Individual' && (
                    <label htmlFor="video" className="inline-block text-sm mb-2 font-medium text-gray-800 mt-2.5 dark:text-neutral-200">
                      Upload a video of you holding your National ID, explaining why you chose to apply as a creator and why you chose <span className='font-semibold'>{userDetails.category}</span> as your crowdfunding campaign. also showcase other documents if there are any.
                    </label>
                    )}
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
                    {selectedVideo && (
                      <div className="mt-4 relative">
                        <video
                          src={selectedVideo}
                          controls
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={clearSelectedVideo}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-neutral-700"></div>
              <div className="pt-4 mb-6">
                <button
                  type="submit"
                  className="w-full mb-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Verification'}
                </button>
                {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      </form>
      </>)}
    </div>
  );
};

export default VerifyAccount;
