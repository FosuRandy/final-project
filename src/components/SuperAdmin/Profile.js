import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db } from '../../firebase.config';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('/images/defaultuser.jpg');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, 'users', id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserDetails(userData);
            setPhotoURL(userData.photoURL || '/images/defaultuser.jpg');

             // Check user type and redirect accordingly
             if (!userData.isSuperAdmin  && userData.isMiniAdmin) {
                // User is not a creator or donor but is a mini admin, redirect to /dashboard
                router.push(`/dashboard/${id}/dashboard`);
            } // Check user type and redirect accordingly
           else if (!userData.isSuperAdmin  && userData.isCreator) {
                // User is not a creator or donor but is a mini admin, redirect to /dashboard
                router.push(`/account/${id}/dashboard`);
            } else if (!userData.isSuperAdmin && userData.isDonor) {
                // User is not a customer but is a super admin, redirect to /my-admin
                router.push(`/account/${id}/dashboard`);
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

    fetchUserData();
  }, [id, router]);

  useEffect(() => {
    if (userDetails) {
      setEmail(userDetails.email || '');
      setDisplayName(userDetails.displayName || '');
      setPhoneNumber(userDetails.phoneNumber || '');
      setOccupation(userDetails.occupation || '');
      setAddress(userDetails.address || '');
      setGender(userDetails.gender || '');
      setBio(userDetails.bio || '');
    }
  }, [userDetails]);

  const handleUpdate = async () => {
    if (!userDetails) return;
    
    setLoading(true);

    try {
      await updateDoc(doc(db, 'users', id), {
        email,
        displayName,
        phoneNumber,
        occupation,
        address,
        gender,
        bio,
      });
      toast.success('Profile updated successfully!');
      setLoading(false);
    } catch (error) {
      toast.error('Error updating profile:', error);
    }
  };



  return (
<div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
  <div class="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800">
    <div class="mb-8">
      <h2 class="text-xl font-bold text-gray-800 dark:text-neutral-200">
        Profile
      </h2>
      <p class="text-sm text-gray-600 dark:text-neutral-400">
        Manage your name, password and account settings.
      </p>
    </div>

    <form>
      <div class="grid sm:grid-cols-12 gap-2 sm:gap-6">
        <div class="sm:col-span-3">
          <label class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            Profile photo
          </label>
        </div>
     

        <div class="sm:col-span-9">
          <div class="flex items-center gap-5">
            <img class="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900" src={photoURL} alt="User Image"/>
            <div class="flex gap-x-2">
              <div>
                <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                  <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  Upload photo
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="af-account-full-name" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            Full name
          </label>
          <div class="hs-tooltip inline-block">
            <button type="button" class="hs-tooltip-toggle ms-1">
              <svg class="inline-block size-3 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </button>
            <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700" role="tooltip">
              Displayed on public forums, such as Preline
            </span>
          </div>
        </div>

        <div class="sm:col-span-9">
          <div class="sm:flex">
            <input
                id="displayNme"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"/>
           </div>
        </div>

        <div class="sm:col-span-3">
          <label for="af-account-email" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            Email
          </label>
        </div>

        <div class="sm:col-span-9">
          <input 
              id="email"
              type="email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="maria@site.com"/>
        </div>

        <div class="sm:col-span-3">
          <label for="af-account-password" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            Password
          </label>
        </div>

        <div class="sm:col-span-9">
          <div class="space-y-2">
            <input 
                   id="password"
                   type="password"
                   value="passwordone" class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Enter current password"/>
            <input 
                    id="password"
                    type="password"
                    value="passwordone"
                   class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Enter new password"/>
          </div>
        </div>

        <div class="sm:col-span-3">
          <div class="inline-block">
            <label for="af-account-phone" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
              Phone
            </label>
            <span class="text-sm text-gray-400 dark:text-neutral-600">
              (Optional)
            </span>
          </div>
        </div>

        <div class="sm:col-span-9">
          <div class="sm:flex">
            <input 
               id="phoneNumber"
               type="text"
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
               class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="+x(xxx)xxx-xx-xx"/>
            <select class="py-2 px-3 pe-9 block w-full sm:w-auto border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
              <option selected>Mobile</option>
              <option>Home</option>
              <option>Work</option>
              <option>Fax</option>
            </select>
          </div>
         {/*
          <p class="mt-3">
            <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" href="../docs/index.html">
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              Add phone
            </a>
          </p>
  */}
        </div>

        <div class="sm:col-span-3">
          <label for="af-account-email" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            Occupation
          </label>
        </div>

        <div class="sm:col-span-9">
          <input 
               id="occupation"
               type="text"
               value={occupation}
               onChange={(e) => setOccupation(e.target.value)}
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="maria@site.com"/>
        </div>

        <div class="sm:col-span-3">
          <label for="af-account-email" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            Address
          </label>
        </div>

        <div class="sm:col-span-9">
          <input 
                 id="address"
                 type="text"
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
              class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="maria@site.com"/>
        </div>

        <div class="sm:col-span-3">
          <label for="af-account-gender-checkbox" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            Gender
          </label>
        </div>

        <div class="sm:col-span-9">
          <div class="sm:flex">
            <label for="af-account-gender-checkbox" class="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
              <input 
                  type="radio"
                  id="gender-male"
                  name="gender"
                  value="Male"
                  checked={gender === 'Male'}
                  onChange={(e) => setGender(e.target.value)}
                  class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
              <span class="text-sm text-gray-500 ms-3 dark:text-neutral-400">Male</span>
            </label>

            <label for="af-account-gender-checkbox-female" class="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
              <input 
                     type="radio"
                     id="gender-female"
                     name="gender"
                     value="Female"
                     checked={gender === 'Female'}
                     onChange={(e) => setGender(e.target.value)}
                     class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"  />
              <span class="text-sm text-gray-500 ms-3 dark:text-neutral-400">Female</span>
            </label>

            <label for="af-account-gender-checkbox-other" class="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
              <input 
                    type="radio"
                    id="gender-other"
                    name="gender"
                    value="Other"
                    checked={gender === 'Other'}
                    onChange={(e) => setGender(e.target.value)}
                    class="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
              <span class="text-sm text-gray-500 ms-3 dark:text-neutral-400">Other</span>
            </label>
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="af-account-bio" class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
            BIO
          </label>
        </div>

        <div class="sm:col-span-9">
          <textarea 
                   id="bio"
                   value={bio}
                   onChange={(e) => setBio(e.target.value)}
                   class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" rows="6" placeholder="Type your message..."></textarea>
        </div>
      </div>

      <div class="mt-5 flex justify-end gap-x-2">
        <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
          Cancel
        </button>
        <button type="button" onClick={handleUpdate} class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
         {loading ? 'Updating...': 'Save changes'  } 
        </button>
      </div>
    </form>
  </div>
</div>
  )
}

export default Profile