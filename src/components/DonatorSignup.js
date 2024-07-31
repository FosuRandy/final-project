import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineClose } from 'react-icons/ai';
import {BsImage} from "react-icons/bs"
import { db, storage, auth } from '../firebase.config';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import Link from 'next/link';

const SignupDonor = () => {

  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // New state for the selected image


   
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  }


  const images = [
    'https://static.vecteezy.com/system/resources/previews/005/879/539/non_2x/cloud-computing-modern-flat-concept-for-web-banner-design-man-enters-password-and-login-to-access-cloud-storage-for-uploading-and-processing-files-illustration-with-isolated-people-scene-free-vector.jpg',
    'https://media.istockphoto.com/id/1281150061/vector/register-account-submit-access-login-password-username-internet-online-website-concept.jpg?s=612x612&w=0&k=20&c=9HWSuA9IaU4o-CK6fALBS5eaO1ubnsM08EOYwgbwGBo=',
    'https://www.1stop.ai/images/login-bg.png',
    'https://img.freepik.com/free-vector/sign-concept-illustration_114360-5425.jpg',
    'https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg',
    'https://img.freepik.com/free-vector/sign-concept-illustration_114360-5425.jpg',
    'https://img.freepik.com/premium-vector/online-registration-sign-up-with-man-sitting-near-smartphone_268404-95.jpg',
    'https://t4.ftcdn.net/jpg/03/39/70/91/360_F_339709192_k6PWV7DqPCkhXBsmanByE5LTEwoJLstw.jpg',
    'https://t3.ftcdn.net/jpg/03/39/70/90/360_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg',
    'https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-7962.jpg',
  ];

  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storageRef = ref(storage, `profile-images/${user.uid}`);
      const uploadTaskSnapshot = await uploadBytes(storageRef, selectedImage);
  
      // Get the download URL directly from the snapshot
      const imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);
  
  
      // Update user profile
      await updateProfile(user, {
        displayName: username,
        photoURL: imageUrl,
        address: address,
        phoneNumber: phoneNumber,
        currency: currency,
        occupation: occupation,
      });
  
      // Store user data on the Firestore database
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: username,
        email,
        password: password,
        photoURL: imageUrl,
        address: address,
        phoneNumber: phoneNumber,
        currency: currency,
        occupation: occupation,
        isSuperAdmin: false,
        isMiniAdmin: false,
        isDonor: true,
        isCreator: false,
        referralCode: referralCode,
        createdAt: new Date().toISOString()
      });
  
      setLoading(false);
      toast.success("You signed up as a donator sucessfully")
      // Sign out the user
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      toast.error(error);
      setLoading(false);
      toast.error('Something went wrong');
    }
  };
  

  // Check if the user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already signed in, redirect to the appropriate page based on user category
        redirectBasedOnCategory(user.uid);
      }
    });

    // Cleanup the subscription when the component is unmounted
    return () => unsubscribe();
  }, []);

  const redirectBasedOnCategory = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data();

      if (userData.isSuperAdmin) {
        toast.warning('You are logged in as super admin already')
        router.push(`/my-admin/${userData.uid}/dashboard`);
      } else if (userData.isMiniAdmin) {
        toast.warning('You are logged in as admin already')
        router.push(`/dashboard/${userData.uid}/dashboard`);
      } else if (userData.isCreator || userData.isDonor) {
        router.push(`/account/${user.uid}/dashboard`);
      } else {
        router.push('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };




  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 9000); // Change image every 9 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`md:mx-5`}>
       <div
      style={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <div className='hidden md:flex'
        style={{
          display: ['none', null, 'flex'],
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          textAlign: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '20px',
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out',
          width: '100%',
          height: '100%',
          '@media only screen and (min-width: 600px)': {
            padding: '40px',
            margin: '20px',
           
          },
        }}
      >
        {/* No image tag */}
        {/* Add any additional content or styling for the left side */}
      </div>
      <div
        style={{
          flex: [1, null, 1], // Take full width on smaller screens
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(https://img.freepik.com/free-vector/white-elegant-texture-wallpaper_23-2148417584.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1703980800&semt=ais)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out', // Semi-transparent white background for the right side
          '@media only screen and (min-width: 600px)': {
            padding: '1px',
            margin: '1px',
          },
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center',
            borderRadius: '10px',
            divShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // div shadow for a glass effect
            padding: '20px',
            divSizing: 'border-div',
            overflowY: 'auto', // Make the right side vertically scrollable
            height: '100vh',
            WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
            '&::-webkit-scrollbar': {
              width: '0 !important', // Hide the scrollbar on WebKit browsers
            },
            msOverflowStyle: 'none', // Hide the scrollbar on IE and Edge
            scrollbarWidth: 'none', // Hide the scrollbar on Firefox
            '@media only screen and (min-width: 600px)': {
              padding: '1px',
              margin: '1px',
            },
          }}
        >
          <h3
            as="h3"
            style={{
              color: 'black',
              fontWeight: 'bold',
              lineHeight: [1.39],
              letterSpacing: ['-.7px', '-1.5px'],
              mb: ['15px', null, null, null, '20px'],
              width: ['100%'],
              maxWidth: ['100%', null, null, '90%', '100%', '540px'],
              marginTop: '60px',
            }}
            className="text-xl"
          >
            Create A Donator Account 
          </h3>
          <p
            as="p"
            style={{
              fontSize: [1, null, null, 2, null, 3],
              lineHeight: ['26px', null, null, null, 2.33],
              color: 'text_secondary',
              mb: ['20px', null, null, null, null, '30px'],
              width: ['100%'],
              maxWidth: ['100%', null, null, null, null, '410px'],
              br: {
                display: ['none', null, null, null, 'inherit'],
              },
            }}
          >
            Join our community, where innovation meets trust in every transaction.
          </p>
          {
            loading ? (<div lg='12' className='text-center'><h2 className='font-bold text-2xl mt-3'>Signing Up, Please Wait... <div role="status">
            <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" style={{width: '20px', height: '20px'}} viewdiv="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
           {/* <span class="sr-only">Loading...</span> */}
          </div> </h2></div>) : (
          <form style={{
          }}
          onSubmit={handleSignUp}
          encType="multipart/form-data" // Add this line for file uploads
          >
          <input
            type="text"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc', // Border styling for the input
              background: 'transparent',
              outline: 'none',
            }}
            required
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc', // Border styling for the input
              background: 'transparent',
              outline: 'none',
            }}
            required
          />
          {/* Additional Fields for Sign Up */}
          <input
            type="text"
            placeholder="Enter Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc',
              background: 'transparent',
              outline: 'none',
            }}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc',
              background: 'transparent',
              outline: 'none',
            }}
            required
          />
          
          <input
            type="text"
            placeholder="Occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc',
              background: 'transparent',
              outline: 'none',
            }}
            required
          /> 
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc',
              background: 'transparent',
              outline: 'none',
            }}
            required
          />
          <input
            type="text"
            placeholder="Referral Code (Optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc',
              background: 'transparent',
              outline: 'none',
            }}
          />
          <select style={{
              width: '100%',
              margin: '10px 0',
              padding: '15px',
              fontSize: '16px',
              border: 'none',
              borderBottom: '1px solid #ccc',
              background: 'transparent',
              outline: 'none',
            }}
            value={currency} 
            onChange={e=> setCurrency(e.target.value)}
            required>
            <option disabled>Select Currency</option>
            <option value="$">$</option>
            <option value="€">€</option>
            <option value="₹">₹</option>
            <option value="¥">¥</option>
            <option value="₵">₵</option>
            <option value="£">£</option>
            <option value="₦">₦</option>
          </select>
          
           {/* Image Upload */}
           <div style={{marginBottom: '30px'}}>
           <label className="block mb-1 mt-1 mx-3 font-semibold text-[17px]">
                    Image Upload:
                  </label>
                  <label style={{ cursor: 'pointer' }}>
              <BsImage size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                required
              />
            </label>
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{ width: '150px', height: '150px', margin: '10px', borderRadius: '100%', alignItems: 'center', }}
              />
            )}
            </div>
          {/* End of Additional Fields */}
          <button
            type= 'submit'
            style={{
              width: '100%',
              padding: '15px',
              color: 'white',
              fontSize: '18px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
              marginBottom: '20px',
            }}
            className="bg-rose-600"
          >
            Sign Up
          </button>
          
          <Link
            href="/signin"
            style={{
              marginTop: '10px',
              textDecoration: 'none',
              fontSize: '16px',
            }}
            className="text-rose-600"
          >
            Already have an account? Sign in here.
          </Link>
          </form>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default SignupDonor