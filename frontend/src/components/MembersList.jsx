// src/components/MembersList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMembers } from './MembersContext';
import api from '../utils/api'; // your axios instance

// Simple debounce hook
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function MembersList() {
  const {
    members,
    deleteMember,
    updateMember,
    updateProfileImage,
    replacePaymentProof,
    refreshMembers,
  } = useMembers();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery.trim());

  const [searchResults, setSearchResults] = useState(null); // null = show all
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Perform search when debounced value changes
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults(null);
      return;
    }

    let isCurrent = true;
    setLoadingSearch(true);

    // IMPORTANT: send to BOTH parameters your backend expects
    const searchUrl = `/members/search?fullName=${encodeURIComponent(debouncedQuery)}&phoneNumber=${encodeURIComponent(debouncedQuery)}`;

    api
      .get(searchUrl)
      .then((res) => {
        if (isCurrent) {
          const formatted = (res.data || []).map((m) => ({
            ...m,
            id: Number(m.id),
          }));
          setSearchResults(formatted);
        }
      })
      .catch((err) => {
        console.error('Search failed:', err);
        if (isCurrent) {
          alert('Search failed. Showing all members.');
          setSearchResults(null);
        }
      })
      .finally(() => {
        if (isCurrent) setLoadingSearch(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  const displayedMembers = searchResults !== null ? searchResults : members;

  const [uploadingProofId, setUploadingProofId] = useState(null);
  const [uploadingImageId, setUploadingImageId] = useState(null);

  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleProofChange = async (memberId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const numericId = Number(memberId);

    setUploadingProofId(numericId);
    try {
      const success = await replacePaymentProof(numericId, file);
      if (success) {
        refreshMembers();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update payment proof');
    } finally {
      setUploadingProofId(null);
      e.target.value = '';
    }
  };

  const handleImageChange = async (memberId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const numericId = Number(memberId);

    setUploadingImageId(numericId);
    try {
      const success = await updateProfileImage(numericId, file);
      if (success) {
        refreshMembers();
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
      deleteMember(Number(id));
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
      alert('Member updated successfully!');
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Members List</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/user-form"
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition"
            >
              + Add New Member
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-lg">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or phone number..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            )}
          </div>
        </div>

        {loadingSearch && (
          <div className="text-center py-8 text-gray-500">Searching...</div>
        )}

        {!loadingSearch && displayedMembers.length === 0 && (
          <div className="text-center py-10 text-gray-600 bg-white rounded-lg border border-gray-200">
            {debouncedQuery
              ? `No members found matching "${debouncedQuery}"`
              : 'No members found. Add some members to get started.'}
          </div>
        )}

        {displayedMembers.length > 0 && (
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

              <tbody className="divide-y divide-gray-200 bg-white">
                {displayedMembers.map((member) => {
                  const memberId = Number(member.id);

                  return (
                    <tr key={memberId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {displayedMembers.findIndex((m) => Number(m.id) === memberId) + 1}
                      </td>

                      {/* Profile Image - unchanged */}
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
                              onChange={(e) => handleImageChange(memberId, e)}
                            />
                          </label>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.fatherName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {member.donationAmount || member.donation || '0'}
                      </td>

                      {/* Payment Proof - unchanged */}
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
                              onChange={(e) => handleProofChange(memberId, e)}
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
                        <button
                          onClick={() => startEdit(member)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
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
        )}

        {/* Edit Modal - unchanged */}
        {editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Member</h2>

                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editFormData.fullName}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={editFormData.fatherName}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editFormData.phoneNumber}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Donation (PKR)</label>
                    <input
                      type="number"
                      name="donation"
                      value={editFormData.donation}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      min="0"
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
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