import { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";

const MembersContext = createContext();

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ── Decode Token ─────────────────────────
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  // ── Login ────────────────────────────────
  const login = (token) => {
    localStorage.setItem("token", token);
    const user = decodeToken(token);
    setCurrentUser(user);
  };

  // ── Logout ───────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setMembers([]);
  };

  // ── Fetch Members ────────────────────────
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/members");

      const formatted = (res.data || [])
        .map((m) => ({
          ...m,
          id: Number(m.id),
        }))
        .sort((a, b) => a.id - b.id);

      setMembers(formatted);
    } catch (err) {
      console.error("Error fetching members:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };


  // ── On App Load ─────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = decodeToken(token);
      setCurrentUser(user);
      fetchMembers();
    }
  }, []);

  // ── Create Member ───────────────────────
  const createMember = async (formData) => {
    try {
      const res = await api.post("/members", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newMember = {
        ...res.data,
        id: Number(res.data.id),
      };

      setMembers((prev) => [...prev, newMember]);
      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create member");
      return false;
    }
  };

  // ── Update Member ───────────────────────
  const updateMember = async (id, updateData) => {
    try {
      const numericId = Number(id);

      const res = await api.patch(`/members/${numericId}`, updateData);

      setMembers((prev) =>
        prev.map((m) =>
          m.id === numericId
            ? { ...m, ...res.data, id: numericId }
            : m
        )
      );

      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Failed  update member");
      return false;
    }
  };

  // ── Delete Member ───────────────────────
  const deleteMember = async (id) => {
    try {
      const numericId = Number(id);
      await api.delete(`/members/${numericId}`);

      setMembers((prev) =>
        prev.filter((m) => m.id !== numericId)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete member");
    }
  };

  // ── Update Profile Image ────────────────
  const updateProfileImage = async (memberId, file) => {
    if (!file) return false;

    const numericId = Number(memberId);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.patch(
        `/members/${numericId}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMembers((prev) =>
        prev.map((m) =>
          m.id === numericId ? { ...m, ...res.data } : m
        )
      );

      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile image");
      return false;
    }
  };

  // ── Replace Payment Proof ───────────────
  const replacePaymentProof = async (memberId, file) => {
    if (!file) return false;

    const numericId = Number(memberId);

    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      const res = await api.patch(
        `/members/${numericId}/payment-proof`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMembers((prev) =>
        prev.map((m) =>
          m.id === numericId ? { ...m, ...res.data } : m
        )
      );

      return true;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to replace payment proof");
      return false;
    }
  };

  return (
    <MembersContext.Provider
      value={{
        members,
        loading,
        currentUser,
        login,
        logout,
        createMember,
        updateMember,
        deleteMember,
        updateProfileImage,
        replacePaymentProof,
        refreshMembers: fetchMembers,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

export const useMembers = () => useContext(MembersContext);
