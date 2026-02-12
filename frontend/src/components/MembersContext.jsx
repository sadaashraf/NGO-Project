// src/MembersContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const MembersContext = createContext();

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // logged in user

  // Load from localStorage on mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('members');
    const savedUser = localStorage.getItem('currentUser');
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // Save to localStorage whenever members or currentUser change
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Register new member
  const register = (newMemberData) => {
    const newMember = {
      id: Date.now().toString(),
      fullName: newMemberData.name,
      fatherName: newMemberData.fatherName,
      phone: newMemberData.phone.trim(),
      donation: newMemberData.donation,
      profileImage: newMemberData.profileImage,
      paymentScreenshot: newMemberData.paymentFile ? URL.createObjectURL(newMemberData.paymentFile) : null,
      paymentProofName: newMemberData.paymentFile ? newMemberData.paymentFile.name : 'No file chosen',
      status: newMemberData.paymentFile ? 'PAID' : 'UNPAID',
      createdAt: new Date().toISOString(),
    };

    // Check if phone already exists
    if (members.some(m => m.phone === newMember.phone)) {
      alert('This phone number is already registered!');
      return false;
    }

    setMembers(prev => [...prev, newMember]);
    // Auto login after register
    setCurrentUser(newMember);
    return true;
  };

  // Login with phone
  const login = (phone) => {
    const user = members.find(m => m.phone.trim() === phone.trim());
    if (user) {
      setCurrentUser(user);
      return true;
    } else {
      alert('Phone number not found. Please register first.');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <MembersContext.Provider value={{
      members,
      currentUser,
      register,
      login,
      logout,
    }}>
      {children}
    </MembersContext.Provider>
  );
}

export const useMembers = () => useContext(MembersContext);