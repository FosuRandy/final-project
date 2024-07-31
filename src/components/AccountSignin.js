import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {getDoc, doc} from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { toast } from 'react-toastify';
import Link from 'next/link';


const AccountSignin = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
  
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Redirect to the appropriate page based on user type
              let returnUrl;
              if (userData.isSuperAdmin) {
                returnUrl = `/my-admin/${user.uid}/dashboard`;
              } else if (userData.isMiniAdmin) {
                returnUrl = `/dashboard/${user.uid}/dashboard`;
              } else if (userData.isCreator) {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else if (userData.isDonor) {
                returnUrl = `/account/${user.uid}/dashboard`;
              } else {
                returnUrl = '/';
              }
              toast.warning("You are already signed in")
              router.push(returnUrl);
            }
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, [router]);

      const signIn = async (e) => {
        e.preventDefault();
    
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Redirect to the appropriate page based on user type
            let returnUrl;
            if (userData.isSuperAdmin) {
              returnUrl = `/my-admin/${user.uid}/dashboard`;
            } else if (userData.isMiniAdmin) {
              returnUrl = `/dashboard/${user.uid}/dashboard`;
            } else if (userData.isCreator) {
              returnUrl = `/account/${user.uid}/dashboard`;
            } else if (userData.isDonor) {
              returnUrl = `/account/${user.uid}/dashboard`;
            } else {
              returnUrl = '/';
            }
            toast.success('Signed in successfully');
            router.push(returnUrl);
          } else {
            toast.error('User data not found');
          }
        } catch (error) {
          toast.error('Failed to sign in: ' + error.message);
        }
      };

{/*
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              // Redirect to the previous page or home if none
              const returnUrl = router.query.returnUrl || '/';
              router.push(returnUrl);
            }
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, [router]);
    */}
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 9000); // Change image every 5 seconds (adjust as needed)
  
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
      <div className='hidden md:flex lg:flex xl:flex'
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
            '@media only screen and (min-width: 600px)': {
              padding: '40px',
              margin: '20px',
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
            }}
            className="text-xl"
          >
          Welcome Back!
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
            Your financial journey continues with trust and cutting-edge security measures.
          </p>
          {
            loading ? (<div lg='12' className='text-center'><h2 className='font-bold text-2xl mt-3'>Logging In, Please Wait... <div role="status">
            <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" style={{width: '20px', height: '20px'}} viewdiv="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
           {/* <span class="sr-only">Loading...</span> */}
          </div> </h2></div>) : (
          <form onSubmit={signIn}>
          <input
            type="text"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              margin: '40px 0px',
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
          <button
            style={{
              width: '100%',
              padding: '15px',
              color: 'white',
              fontSize: '18px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px',
              marginBottom: '20px'
            }}
            className="bg-rose-600"
          >
            Sign In
          </button>
     <p
            style={{
              marginTop: '10px',
              textDecoration: 'none',
              fontSize: '16px',
            }}
            className="text-rose-600"
          >
            Sign up as <Link href="/creator-signup" className="font-semibold">Creator</Link> or <Link href="/donator-signup" className="font-semibold">Donor</Link>
          </p>
        
          </form>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default AccountSignin