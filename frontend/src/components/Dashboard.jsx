import React, { useState } from 'react';
import { useMembers } from './MembersContext';

function Dashboard() {
  const { members, currentUser, updateMember } = useMembers();
  const myData = members.find((m) => m.id === currentUser.id);

  const [paymentPreview, setPaymentPreview] = useState(myData?.paidScreenshot || null);

  const handlePaymentChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentPreview(reader.result);
        updateMember(myData.id, { paidScreenshot: reader.result }); // auto update status in context
      };
      reader.readAsDataURL(file);
    } else if (file) alert('File too large (max 5MB)');
  };

  if (!myData) return <p className="text-center mt-20">No data found. Contact admin.</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Your Dashboard</h2>
        <div className="space-y-4">
          <p><strong>Full Name:</strong> {myData.name}</p>
          <p><strong>Father Name:</strong> {myData.fatherName}</p>
          <p><strong>Phone:</strong> {myData.phone}</p>
          <p><strong>Donation:</strong> {myData.donation} PKR</p>
          <p><strong>Status:</strong> <span className={`${myData.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{myData.status.toUpperCase()}</span></p>
          {/* Payment Proof Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Proof (EasyPaisa/JazzCash Screenshot)</label>
            <div className="flex items-center space-x-4">
              {paymentPreview && <img src={paymentPreview} alt="Proof" className="h-24 w-32 object-cover rounded border" />}
              <input
                type="file"
                accept="image/*"
                onChange={handlePaymentChange}
                className="text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:bg-green-50 file:text-green-700"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Status will auto-change to PAID after upload. Admin will verify.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;