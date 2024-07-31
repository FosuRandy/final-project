import React from 'react';

const DonatorListModal = ({ isOpen, onClose, donators }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-900 bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-lg w-96 max-h-70  overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Project Donators</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <ul className="space-y-2">
                    {donators.length > 0 ?
                    (donators.map((donator, index) => (
                        <li key={index} className="flex items-center space-x-4">
                            <img
                                className="object-cover w-10 h-10 rounded-full"
                                src={donator.userImage}
                                alt={donator.userName}
                            />
                            <div>
                                <h3 className="text-sm font-semibold">{donator.userName}</h3>
                                <p className="text-xs text-gray-500">${donator.amount} donated</p>
                                <p className="text-xs text-gray-400">{new Date(donator.timestamp).toLocaleString()}</p>
                            </div>
                        </li>
                    ))) : (<div className="flex items-center justify-center"> <h3 className="text-sm font-semibold">No donator yet!</h3> </div>)}
                </ul>
            </div>
        </div>
    );
};

export default DonatorListModal;
