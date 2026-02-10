import { createContext, useState, useContext } from 'react'

const MembersContext = createContext()

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([])

  const addMember = (newMember) => {
    setMembers(prev => [
      ...prev,
      {
        id: prev.length + 1,
        fullName: newMember.name,
        fatherName: newMember.fatherName,
        phone: newMember.phone,
        donation: newMember.donation,
        profileImage: newMember.profileImage || 'https://via.placeholder.com/150?text=User',
        paymentProofFile: newMember.paymentFile,
        paymentProofName: newMember.paymentFile ? newMember.paymentFile.name : 'No file chosen',
        status: newMember.paymentFile ? 'PAID' : 'UNPAID',
      }
    ])
  }

  const updatePaymentProof = (memberId, file) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? {
            ...member,
            paymentProofFile: file,
            paymentProofName: file.name,
            status: 'PAID'
          }
          : member
      )
    )
  }

  const deleteMember = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(prev => prev.filter(m => m.id !== id))
    }
  }

  return (
    <MembersContext.Provider value={{ members, addMember, updatePaymentProof, deleteMember }}>
      {children}
    </MembersContext.Provider>
  )
}

export const useMembers = () => useContext(MembersContext)