import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const MembersContext = createContext();

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch All Members ─────────────────────────────
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/members"); // token automatically sent
      setMembers(res.data || []);
    } catch (err) {
      console.error("Error fetching members:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const refreshMembers = fetchMembers;

  // ── Create Member ────────────────────────────────
  const createMember = async (formData) => {
    try {
      const res = await api.post("/members", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMembers(prev => [...prev, res.data]);
      return true;
    } catch (err) {
      console.error("Create member error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create member");
      return false;
    }
  };

  // ── Update Member ────────────────────────────────
  const updateMember = async (id, updateData) => {
    try {
      const res = await api.patch(`/members/${id}`, updateData);
      setMembers(prev =>
        prev.map(m => (m.id === id ? { ...m, ...res.data } : m))
      );
      return true;
    } catch (err) {
      console.error("Update member error:", err);
      alert(err.response?.data?.message || "Failed to update member");
      return false;
    }
  };

  // ── Delete Member ────────────────────────────────
  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await api.delete(`/members/${id}`);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Delete member error:", err);
      alert(err.response?.data?.message || "Failed to delete member");
    }
  };

  // ── Update Profile Image ─────────────────────────
  const updateProfileImage = async (memberId, file) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.patch(`/members/${memberId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, ...res.data } : m))
      );
      return true;
    } catch (err) {
      console.error("Update profile image error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update profile image");
      return false;
    }
  };

  // ── Replace Payment Proof ────────────────────────
  const replacePaymentProof = async (memberId, file) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      const res = await api.patch(`/members/${memberId}/payment-proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, ...res.data } : m))
      );
      return true;
    } catch (err) {
      console.error("Replace payment proof error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to replace payment proof");
      return false;
    }
  };

  return (
    <MembersContext.Provider
      value={{
        members,
        loading,
        createMember,
        updateMember,
        deleteMember,
        updateProfileImage,
        replacePaymentProof,
        refreshMembers,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

export const useMembers = () => useContext(MembersContext);
