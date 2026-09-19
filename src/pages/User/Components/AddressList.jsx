// src/components/AddressList.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAddresses, deleteAddress, updateAddress, addAddress } from "../../../api/userApi";
import { FaMapMarkerAlt, FaPhone, FaEdit, FaTimes, FaPlus } from "react-icons/fa";

export default function AddressList({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const getStreetAddress = (address) =>
    address?.street_address ||
    address?.address ||
    address?.address_line ||
    address?.address_line1 ||
    address?.line1 ||
    "Address not available";

  const getAddressId = (address) =>
    address?.id ?? address?.address_id ?? address?.addressId ?? address?.pk;

  // Fetch the authenticated user's addresses using the access token.
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      const addressList = data.results || data.data || data || [];
      setAddresses(Array.isArray(addressList) ? addressList : []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (addressId === undefined || addressId === null) {
      alert("This address does not have a valid ID.");
      return;
    }
    const isConfirm = window.confirm("Are you sure you want to delete this address?");
    if (!isConfirm) return;

    try {
      await deleteAddress(addressId);
      setAddresses((currentAddresses) =>
        currentAddresses.filter((addr) => getAddressId(addr) !== addressId),
      );
    } catch (error) {
      console.error("Failed to delete address:", error);
      alert("Something went wrong while deleting the address.");
    }
  };

  // Open modal for Add
  const handleAddNewClick = () => {
    setModalMode("add");
    setFormData({}); // Empty form for new address
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleEditClick = (address) => {
    setModalMode("edit");
    setFormData(address); // Pre-fill form with existing data
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({}); // Reset form when closed
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION: Phone Number aur Alternative Phone Number same nahi hone chahiye
    if (
      formData.alternative_phone && 
      formData.consignee_phone === formData.alternative_phone
    ) {
      alert("Phone Number and Alternative Phone Number cannot be the same!");
      return;
    }

    setIsSaving(true);
    
    try {
      if (modalMode === "add") {
        await addAddress({
          ...formData,
          street_address: formData.street_address || formData.address_line,
        });
        await fetchAddresses(); // Reload addresses
      } else {
        const addressId = getAddressId(formData);
        if (addressId === undefined || addressId === null) {
          throw new Error("This address does not have a valid ID.");
        }
        const updatedData = await updateAddress(addressId, {
          ...formData,
          street_address: formData.street_address || formData.address_line,
        });
        setAddresses(
          addresses.map((addr) =>
            getAddressId(addr) === addressId ? updatedData : addr,
          )
        );
      }
      handleCloseModal();
    } catch (error) {
      console.error(`Failed to ${modalMode} address:`, error);
      alert(error.message || `Could not ${modalMode} address. Please check your inputs.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Input styling class ko ek variable me daal diya taaki code clean rahe
  const inputClass = "w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-eatpur-green-dark/40 focus:border-eatpur-green-dark transition-all duration-200";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 w-full">
        <div className="animate-spin h-8 w-8 border-4 border-eatpur-green-dark border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
      
      {/* Header section with Title and Add Button */}
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-black/5 pb-4 sm:mb-6">
        <h2 className="flex items-center gap-2 text-xl font-display text-eatpur-dark sm:text-2xl">
          <FaMapMarkerAlt className="text-eatpur-green-dark" /> Saved Addresses
        </h2>
        <button 
          onClick={handleAddNewClick}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-eatpur-green-dark px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-opacity-90 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <FaPlus /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium">
            You haven't saved any addresses yet.
          </p>
          <button 
             onClick={handleAddNewClick}
             className="mt-4 text-eatpur-green-dark font-medium text-sm underline hover:text-green-800 transition-colors"
          >
             Click here to add one
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={getAddressId(address)}
              className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-eatpur-green-dark/50 hover:shadow-md sm:p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words text-base font-bold capitalize text-eatpur-dark sm:text-lg">
                    {address.consignee_name || "Saved Address"}
                  </h3>
                  {address.title && (
                    <p className="mt-1 inline-block rounded-md bg-eatpur-green-dark/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-eatpur-green-dark">
                      {address.title}
                    </p>
                  )}
                </div>
                <FaMapMarkerAlt className="mt-1 shrink-0 text-eatpur-green-dark/60" size={14} />
              </div>

              <div className="space-y-2 text-sm leading-relaxed text-gray-600">
                <p>{getStreetAddress(address)}</p>
                <p>
                  {[address.city, address.state].filter(Boolean).join(", ")}
                  {(address.pincode || address.postal_code) && ` - ${address.pincode || address.postal_code}`}
                </p>
                <p className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2 font-medium text-eatpur-dark">
                  <FaPhone className="text-eatpur-green-dark/70" size={12} />
                  <span>{address.consignee_phone || "Phone not available"}</span>
                  {address.alternative_phone && <span className="text-gray-400">|</span>}
                  {address.alternative_phone && <span>{address.alternative_phone}</span>}
                </p>
              </div>

              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => handleEditClick(address)}
                  className="flex-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-600 hover:text-white active:scale-95 sm:flex-none sm:px-4 sm:py-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(getAddressId(address))}
                  className="flex-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-red-500 shadow-sm transition-all duration-300 hover:bg-red-500 hover:text-white active:scale-95 sm:flex-none sm:px-4 sm:py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================= */}
      {/* ADD / EDIT ADDRESS MODAL                  */}
      {/* ========================================= */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 sm:p-6 bg-black/25 backdrop-blur-sm transition-all duration-300">
          <div className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transform animate-fade-in-up">
            
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-white p-4 sm:p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-eatpur-dark sm:text-xl">
                 {modalMode === "add" ? <FaPlus className="text-eatpur-green-dark" /> : <FaEdit className="text-eatpur-green-dark" />}
                 {modalMode === "add" ? "Add New Address" : "Edit Address"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="shrink-0 rounded-full bg-gray-100 p-2 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-4 custom-scrollbar sm:space-y-5 sm:p-6">
              
              <div>
                <label className="block text-sm text-gray-700 mb-1.5 font-medium">Address Title</label>
                <input required type="text" name="title" placeholder="Home, Office, etc." value={formData.title || ""} onChange={handleInputChange} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5 font-medium">Consignee Name</label>
                <input required type="text" name="consignee_name" placeholder="Full Name" value={formData.consignee_name || ""} onChange={handleInputChange} className={inputClass} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">Phone Number</label>
                  <input required type="tel" name="consignee_phone" placeholder="10-digit number" value={formData.consignee_phone || ""} onChange={handleInputChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">Alternative Phone</label>
                  <input type="tel" name="alternative_phone" placeholder="Optional" value={formData.alternative_phone || ""} onChange={handleInputChange} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5 font-medium">Address Line</label>
                <input required type="text" name="street_address" placeholder="House No, Street, Area" value={formData.street_address || formData.address_line || ""} onChange={handleInputChange} className={inputClass} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="col-span-1">
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">City</label>
                  <input required type="text" name="city" value={formData.city || ""} onChange={handleInputChange} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">State</label>
                  <input required type="text" name="state" value={formData.state || ""} onChange={handleInputChange} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm text-gray-700 mb-1.5 font-medium">Pincode</label>
                  <input required type="text" name="pincode" maxLength={6} value={formData.pincode || ""} onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, "")})} className={`${inputClass} font-mono tracking-widest`} />
                </div>
              </div>

              <div className="mt-5 flex flex-row gap-2 border-t border-gray-100 pt-4 sm:mt-6 sm:justify-end sm:gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 sm:flex-none sm:px-4 sm:text-sm sm:rounded-xl sm:py-2.5"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving} 
                  className="flex-1 rounded-lg bg-eatpur-green-dark px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-opacity-90 hover:shadow-lg disabled:opacity-50 sm:flex-none sm:min-w-[130px] sm:rounded-xl sm:px-4 sm:text-sm sm:py-2.5"
                >
                  {isSaving ? "Saving..." : (modalMode === "add" ? "Save Address" : "Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}