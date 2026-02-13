// src/components/MembersList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMembers } from './MembersContext';

function MembersList() {
  const {
    members,
    deleteMember,
    updateMember,
    updateProfileImage,
    replacePaymentProof,
    refreshMembers,
  } = useMembers();

  const [uploadingProofId, setUploadingProofId] = useState(null);
  const [uploadingImageId, setUploadingImageId] = useState(null);

  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleProofChange = async (e, memberId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const numericId = Number(memberId); // ← یہاں force number

    setUploadingProofId(numericId);
    try {
      const success = await replacePaymentProof(numericId, file);
      if (success) {
        refreshMembers(); // فوری ریفریش
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update payment proof');
    } finally {
      setUploadingProofId(null);
      e.target.value = '';
    }
  };

  const handleImageChange = async (e, memberId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const numericId = Number(memberId); // ← یہاں force number

    setUploadingImageId(numericId);
    try {
      const success = await updateProfileImage(numericId, file);
      if (success) {
        refreshMembers(); // فوری ریفریش
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update profile image');
    } finally {
      setUploadingImageId(null);
      e.target.value = '';
    }
  };

  const viewFile = (filename) => {
    if (!filename) return;
    window.open(`http://localhost:3000/uploads/${filename}`, '_blank');
  };

  const confirmDelete = (id, name) => {
    if (window.confirm(`Delete member ${name || 'this member'}?`)) {
      deleteMember(Number(id)); // ← number یقینی بنائیں
    }
  };

  const startEdit = (member) => {
    setEditingMember(member);
    setEditFormData({
      fullName: member.fullName || '',
      fatherName: member.fatherName || '',
      phoneNumber: member.phoneNumber || '',
      donation: member.donationAmount || member.donation || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingMember) return;

    const success = await updateMember(Number(editingMember.id), editFormData);
    if (success) {
      alert('Member updated!');
      setEditingMember(null);
      setEditFormData({});
      refreshMembers();
    }
  };

  const cancelEdit = () => {
    setEditingMember(null);
    setEditFormData({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Members List</h1>
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition"
          >
            + Add New Member
          </Link>
        </div>

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
              {members.map((member, index) => {
                const memberId = Number(member.id); // ← ہر جگہ number یقینی

                return (
                  <tr key={memberId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>

                    {/* Profile Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative group inline-block">
                        {member.image ? (
                          <img
                            src={`http://localhost:3000/uploads/${member.image}`}
                            alt={member.fullName}
                            className="h-12 w-12 rounded-full object-cover border border-gray-300"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/48?text=?')}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No img
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                          <span className="text-white text-xs px-2 py-1 bg-gray-800 rounded">
                            {uploadingImageId === memberId ? 'Uploading...' : 'Change'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingImageId === memberId}
                            onChange={(e) => handleImageChange(e, memberId)}
                          />
                        </label>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.fatherName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {member.donationAmount || member.donation || '0'}
                    </td>

                    {/* Payment Proof */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <label
                          className={`cursor-pointer px-3 py-1.5 rounded text-sm font-medium transition min-w-[110px] text-center ${uploadingProofId === memberId
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                        >
                          {uploadingProofId === memberId ? 'Uploading...' : 'Screenshot'}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            disabled={uploadingProofId === memberId}
                            onChange={(e) => handleProofChange(e, memberId)}
                          />
                        </label>

                        {member.paymentProof ? (
                          <div className="relative group cursor-pointer">
                            {member.paymentProof.toLowerCase().endsWith('.pdf') ? (
                              <div className="w-14 h-14 bg-red-50 rounded-md border border-red-200 flex flex-col items-center justify-center text-red-600 text-xs">
                                PDF
                              </div>
                            ) : (
                              <img
                                src={`http://localhost:3000/uploads/${member.paymentProof}`}
                                alt="Payment Proof"
                                className="w-14 h-14 object-cover rounded-md border border-gray-300 shadow-sm"
                                onError={(e) => (e.target.src = 'https://via.placeholder.com/56?text=?')}
                              />
                            )}

                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                onClick={() => viewFile(member.paymentProof)}
                                className="text-white text-xs bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm italic">No proof</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${member.paymentProof ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {member.paymentProof ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                      <button onClick={() => startEdit(member)} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(memberId, member.fullName)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Member</h2>
                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={cancelEdit} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersList;