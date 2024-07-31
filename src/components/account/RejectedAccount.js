import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';

const RejectedAccount = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkVerificationStatus = async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.status === 'Verified') {
                        let returnUrl;
                         // Check user type and redirect accordingly
                        if (!userData.isCreator || !userData.isDonor && userData.isMiniAdmin) {
                          // User is not a creator or donor but is a mini admin, redirect to /dashboard
                          returnUrl =`/dashboard/${id}/dashboard` ;
                        } else if (!userData.isCustomer && userData.isSuperAdmin) {
                          // User is not a customer but is a super admin, redirect to /my-admin
                          returnUrl = `/my-admin/${id}/dashboard`;
                        } else {
                          // User is a customer or user type not recognized, continue rendering the page
                          returnUrl = '/'
                        }
                        router.push(returnUrl);
                    } else {
                        setLoading(false);
                    }
                } else {
                    toast.error('User data not found');
                }
            } else {
                router.push('/signin');
            }
        };

        onAuthStateChanged(auth, checkVerificationStatus);
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="md:max-w-4xl md:px-4 md:py-10 pb-10  lg:px-8 lg:py-14 mx-auto">
            <p className="text-md md:text-2xl lg:text-2xl font-semibold mx-3 p-5 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-black">
                We noticed an unusual activity in your account, We have temporarily suspended your account till further notice, If you believe this is a mistake, please contact us for account reinstatement.
          </p>
        </div>
    );
};

export default RejectedAccount;
