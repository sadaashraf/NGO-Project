// src/components/MembersList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMembers } from './MembersContext'; // adjust path if needed

function MembersList() {
  const {
    members,
    deleteMember,
    uploadPaymentProof,
    refreshMembers
  } = useMembers();

  const [uploadingId, setUploadingId] = useState(null);

  const handleProofUpload = async (e, memberId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(memberId);
    try {
      await uploadPaymentProof(memberId, file);
      alert('Payment proof updated successfully');
      refreshMembers(); // optional: force refresh from server
    } catch (err) {
      alert('Failed to upload proof');
    } finally {
      setUploadingId(null);
      e.target.value = ''; // reset file input
    }
  };

  const viewFile = (filename) => {
    if (!filename) return;
    const url = `http://localhost:3000/uploads/${filename}`; // ← change port/base URL if different
    window.open(url, '_blank');
  };

  const confirmDelete = (id, name) => {
    if (window.confirm(`Delete member ${name || 'this member'}?`)) {
      deleteMember(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Members List</h1>
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition"
          >
            + Add New Member
          </Link>
        </div>

        {/* Table or empty state */}
        {members.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-6">No members added yet.</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Your First Member
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Father Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donation (PKR)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Proof</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.image ? (
                        <img
                          src={`http://localhost:3000/uploads/${member.image}`}
                          alt={member.fullName}
                          className="h-10 w-10 rounded-full object-cover border border-gray-300"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=?'; }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          No img
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.fatherName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{member.donationAmount || '0'}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className={`cursor-pointer ${uploadingId === member.id
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-700'} px-3 py-1.5 rounded text-sm font-medium transition`}>
                          {uploadingId === member.id ? 'Uploading...' : 'Upload Proof'}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            disabled={uploadingId === member.id}
                            onChange={(e) => handleProofUpload(e, member.id)}
                          />
                        </label>

                        {member.paymentProof && (
                          <>
                            <span className="text-gray-600 text-sm truncate max-w-[160px]">
                              {member.paymentProof}
                            </span>
                            <button
                              onClick={() => viewFile(member.paymentProof)}
                              className="text-blue-600 hover:text-blue-800 text-sm underline whitespace-nowrap"
                            >
                              View
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${member.paymentProof
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {member.paymentProof ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button
                        onClick={() => confirmDelete(member.id, member.fullName)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersList;