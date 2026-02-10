import React from 'react';
import { Link } from 'react-router-dom';
import { useMembers } from './MembersContext';

function MembersList() {
  const { members, updatePaymentProof } = useMembers();

  const handleProofChange = (e, memberId) => {
    const file = e.target.files[0];
    if (file) {
      updatePaymentProof(memberId, file);
    }
  };

  const viewProof = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IMAGE</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">FULL NAME</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">FATHER NAME</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PHONE NO</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DONATION (PKR)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PAYMENT PROOF</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={member.profileImage}
                      alt={member.fullName}
                      className="h-10 w-10 rounded-full object-cover border border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.fatherName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{member.donation}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleProofChange(e, member.id)}
                        />
                      </label>
                      <span className="text-gray-600 text-sm">{member.paymentProofName}</span>
                      {member.paymentProofFile && (
                        <button
                          onClick={() => viewProof(member.paymentProofFile)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button className="text-indigo-600 hover:text-indigo-900">Update</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {members.length === 0 && (
          <p className="text-center text-gray-500 mt-12 text-lg">No members added yet. Add your first member!</p>
        )}
      </div>
    </div>
  );
}

export default MembersList;