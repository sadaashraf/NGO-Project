import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMembers } from './MembersContext'

export default function UserForm() {
  const navigate = useNavigate()
  const { addMember } = useMembers()

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    phone: '',
    donation: '1500',
  })

  const [profilePreview, setProfilePreview] = useState(null)
  const [profileFile, setProfileFile] = useState(null)

  const [paymentPreview, setPaymentPreview] = useState(null)
  const [paymentFile, setPaymentFile] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfile = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return alert('Max 5 MB allowed')
    setProfileFile(file)
    const reader = new FileReader()
    reader.onload = () => setProfilePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handlePayment = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return alert('Max 5 MB allowed')
    setPaymentFile(file)
    const reader = new FileReader()
    reader.onload = () => setPaymentPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = e => {
    e.preventDefault()
    addMember({
      name: formData.name,
      fatherName: formData.fatherName,
      phone: formData.phone,
      donation: formData.donation,
      profileImage: profilePreview,
      paymentFile,
    })
    navigate('/members')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Add New Member
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father Name
            </label>
            <input
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Father's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10,13}"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="03XX-XXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Donation Amount (PKR)
            </label>
            <input
              type="number"
              name="donation"
              value={formData.donation}
              onChange={handleChange}
              required
              min="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-6">
              {profilePreview ? (
                <img
                  src={profilePreview}
                  alt="preview"
                  className="h-20 w-20 rounded-full object-cover border-2 border-purple-500"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs border-2 border-gray-300">
                  No photo
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfile}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>

          {/* Payment Proof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Proof (EasyPaisa / JazzCash)
            </label>
            <div className="flex items-center gap-6">
              {paymentPreview ? (
                <img
                  src={paymentPreview}
                  alt="proof"
                  className="h-24 w-40 object-cover rounded-lg border-2 border-green-500"
                />
              ) : (
                <div className="h-24 w-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs border-2 border-gray-300 text-center p-2">
                  No proof
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePayment}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Upload screenshot showing amount {formData.donation} PKR
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            Submit & View List
          </button>
        </form>
      </div>
    </div>
  )
}