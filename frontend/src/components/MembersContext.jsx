// src/MembersContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/members';

const MembersContext = createContext();

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      setMembers(res.data || []);
    } catch (err) {
      console.error("Failed to load members", err);
      alert("Could not load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const refreshMembers = fetchMembers;

  const createMember = async (formData) => {
    try {
      const res = await axios.post(API_BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMembers(prev => [...prev, res.data]);
      return true;
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create member");
      return false;
    }
  };

  const updateMember = async (id, updateData) => {
    try {
      const res = await axios.patch(`${API_BASE}/${id}`, updateData);
      setMembers(prev =>
        prev.map(m => m.id === id ? { ...m, ...res.data } : m)
      );
      return true;
    } catch (err) {
      console.error(err);
      alert("Failed to update member");
      return false;
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

  // ── Profile Image Update ───────────────────────────────────────
  const updateProfileImage = async (memberId, file) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.patch(`${API_BASE}/${memberId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, ...res.data } : m))
      );
      return true;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile image");
      return false;
    }
  };

  // ── Payment Proof Replace ──────────────────────────────────────
  const replacePaymentProof = async (memberId, file) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('paymentProof', file);

    try {
      const res = await axios.patch(`${API_BASE}/${memberId}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, ...res.data } : m))
      );
      return true;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to replace payment proof");
      return false;
    }
  };

  return (
    <MembersContext.Provider value={{
      members,
      loading,
      createMember,
      updateMember,
      deleteMember,
      updateProfileImage,
      replacePaymentProof,
      refreshMembers,
    }}>
      {children}
    </MembersContext.Provider>
  );
}

export const useMembers = () => useContext(MembersContext);