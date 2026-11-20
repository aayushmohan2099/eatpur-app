import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createFarmerContact,
  deleteFarmerContact,
  getFarmerContactdeatails,
  updateFarmerContactStatus,
} from "../api/userApi";
import FloatingImagesBackground from "../pages/FloatingBG/floatingBG";
import { useUserRole } from "../utils/useUserRole";
//import section6Bg from "../assets/temp/Contactpage.png";
import contactPageLogo from "../assets/temp/contactpagelogo.png";
import contactPageLeaf from "../assets/temp/contactpagelogo1.png";
import contactPageHeaderfrom from "../assets/temp/contactpagehead.png";

const CROP_OPTIONS = [
  // "Pearl Millet (Bajra)",
  // "Finger Millet (Ragi)",
  // "Sorghum (Jowar)",
  "Foxtail Millet",
  // "Little Millet",
  // "Kodo Millet",
  // "Barnyard Millet",
  // "Wheat",
  // "Paddy / Rice",
  // "Pulses",
  "Other",
];

const AREA_UNITS = ["Hectare", "Acre", "Bigha"];
const FARMER_CONTACT_STATUSES = [
  "Pending",
  "In Progress",
  "In-Pratice",
  "Mou Done",
];
const CONTACTS_PER_PAGE = 10;

const getStatusClassName = (status) => {
  if (status === "Mou Done") return "bg-emerald-100 text-emerald-800";
  if (status === "In-Pratice") return "bg-sky-100 text-sky-800";
  return "bg-amber-100 text-amber-800";
};

const initialFormState = {
  name: "",
  mobile: "",
  address: "",
  member_count: "",
  cultivated_area: "",
  area_unit: "Hectare",
  major_crop: "",
  crop_of_interest: "",
};

const inputClassName =
  "mt-1 w-full rounded-md border border-[#d8d1bc] bg-white/80 px-3 py-2 text-xs text-[#253626] shadow-sm outline-none transition placeholder:text-[#98a196] hover:border-[#9db894] focus:border-[#3e7d45] focus:ring-2 focus:ring-[#3e7d45]/15 sm:text-sm";

function FormField({ id, label, required = false, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-[#26372a]"
      >
        {label}
        {required && <span className="ml-1 text-[#a64c37]">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Section6() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [contactActionMessage, setContactActionMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showList, setShowList] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusDraft, setStatusDraft] = useState("Pending");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingContactId, setDeletingContactId] = useState(null);
  const { isAdmin } = useUserRole();
  const canViewContacts = true;
  
  useEffect(() => {
    if (!location.state?.openFarmerForm) return;

    setIsOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setFormData((previous) => ({ ...previous, [name]: nextValue }));
  };

  const fetchContactsList = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await getFarmerContactdeatails();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setContacts(list);
      setCurrentPage(1);
      setShowList(true);
    } catch (requestError) {
      setError(requestError.message || "Unable to load farmer contacts.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && canViewContacts) {
      fetchContactsList();
    }
  }, [canViewContacts, fetchContactsList, isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      address: formData.address.trim(),
      member_count: Number(formData.member_count),
      cultivated_area: `${formData.cultivated_area} ${formData.area_unit}`.trim(),
      major_crop: formData.major_crop,
      crop_of_interest: formData.crop_of_interest,
    };

    try {
      await createFarmerContact(payload);
      setSuccessMsg("Details submitted successfully. Our team will be in touch.");
      setFormData(initialFormState);
      if (canViewContacts) await fetchContactsList();
    } catch (requestError) {
      setError(requestError.message || "Unable to submit your details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (contact) => {
    if (!isAdmin || !contact.id) return;

    setError("");
    setContactActionMessage("");
    setUpdatingStatusId(contact.id);
    try {
      const updatedContact = await updateFarmerContactStatus(
        contact.id,
        statusDraft,
      );
      const nextContact = { ...contact, ...updatedContact, status: statusDraft };
      setContacts((previous) =>
        previous.map((item) =>
          item.id === contact.id ? nextContact : item,
        ),
      );
      setSelectedContact((previous) =>
        previous?.id === contact.id ? nextContact : previous,
      );
      setContactActionMessage(`Status updated to "${statusDraft}".`);
    } catch (requestError) {
      setError(requestError.message || "Unable to update farmer contact status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteContact = async (contact) => {
    if (!isAdmin || !contact.id) return;
    if (!window.confirm(`Delete the submission from ${contact.name || "this farmer"}?`)) {
      return;
    }

    setError("");
    setContactActionMessage("");
    setDeletingContactId(contact.id);
    try {
      await deleteFarmerContact(contact.id);
      setContacts((previous) =>
        previous.filter((item) => item.id !== contact.id),
      );
      setSelectedContact((previous) =>
        previous?.id === contact.id ? null : previous,
      );
      setContactActionMessage("Farmer contact deleted successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to delete farmer contact.");
    } finally {
      setDeletingContactId(null);
    }
  };

  const openContactDetails = (contact) => {
    setError("");
    setContactActionMessage("");
    setSelectedContact(contact);
    setStatusDraft(contact.status || "Pending");
  };

  const totalPages = Math.max(
    1,
    Math.ceil(contacts.length / CONTACTS_PER_PAGE),
  );
  const visiblePage = Math.min(currentPage, totalPages);
  const pageContacts = contacts.slice(
    (visiblePage - 1) * CONTACTS_PER_PAGE,
    visiblePage * CONTACTS_PER_PAGE,
  );
  const firstVisibleContact =
    contacts.length === 0 ? 0 : (visiblePage - 1) * CONTACTS_PER_PAGE + 1;
  const lastVisibleContact = Math.min(
    visiblePage * CONTACTS_PER_PAGE,
    contacts.length,
  );

  const requiredValues = [
    formData.name,
    formData.mobile,
    formData.address,
    formData.member_count,
    formData.cultivated_area,
    formData.major_crop,
    formData.crop_of_interest,
  ];
  const completedFields = requiredValues.filter(
    (value) => String(value).trim() !== "",
  ).length;
  const formProgress = Math.round((completedFields / requiredValues.length) * 100);
  const contactStepComplete = requiredValues.slice(0, 4).every(
    (value) => String(value).trim() !== "",
  );
  const cropStepComplete = requiredValues.slice(4).every(
    (value) => String(value).trim() !== "",
  );

  return (
    <section className="farmer-section relative z-10 overflow-hidden bg-[#f7f5ef] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12">
      <FloatingImagesBackground />
      <div className="relative z-10 isolate mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#17643a] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full border-[40px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-72 w-72 rounded-full bg-[#b7dfb9]/10 blur-2xl" />
        
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#c8e8c9] sm:text-sm">
          Let&apos;s grow together
        </p>
        <h2 className="mx-auto max-w-3xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          Are you a farmer or an FPO?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
          Tell us about your crops and your community. Our team can start a
          conversation and explore whether there&apos;s a good fit.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setError("");
            setSuccessMsg("");
          }}
          className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#17643a] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#f1f8f1] focus:outline-none focus:ring-4 focus:ring-white/25 sm:text-base"
        >
          Talk to our team
          <span aria-hidden="true" className="ml-2 text-lg">
            &rarr;
          </span>
        </button>
      </div>

      {isOpen &&
        createPortal(
          
          <div
          // className="fixed inset-0 z-[500] overflow-y-auto bg-[#f7f8f2] bg-cover bg-center bg-fixed p-3 sm:p-5 lg:p-8"

          //  style={{

          //  backgroundImage: `linear-gradient(rgba(247, 248, 242, 0.08), rgba(247, 248, 242, 0.12)), url(${floatingBG})`,

          //   }} 
            className="fixed inset-0 z-[500] overflow-y-auto bg-[#f7f8f2] p-3 sm:p-5 lg:p-8"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Farmer and FPO contact form"
          >
            <FloatingImagesBackground />
            <div
              className="relative z-10 mx-auto flex min-h-[90dvh] w-full max-w-7xl flex-col items-center justify-center py-3 sm:py-5 lg:min-h-[calc(100dvh-4rem)] lg:py-0"
              onClick={(event) => event.stopPropagation()}
            >
              {/* <header className="mb-4 w-full max-w-3xl px-4 text-center sm:mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3a5335] sm:text-xs">
                  EatPur farmer connect
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#174c31] sm:text-3xl">
                  Tell us about your farm
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-[#143614] sm:text-sm">
                  Share a few details so our team can understand your crops and
                  community and get back to you.
                </p>
              </header> */}
              <div className="relative w-full overflow-hidden rounded-none">
               <img
               src={contactPageHeaderfrom}
               alt="EatPur farmer connect"
               className="mx-auto h-36 w-full object-contain sm:h-44 md:h-52 mb-3"
              />

              <div className="relative w-full overflow-hidden rounded-2xl bg-[#f7f3e7] shadow-none">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Back to farmer page"
                  className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full border border-[#dce6d5] bg-white/95 px-4 py-2 text-sm font-semibold text-[#17643a] shadow-md transition hover:bg-[#17643a] hover:text-white sm:right-5 sm:top-5"
                >
                  <span aria-hidden="true">&larr;</span>
                  Back
                </button>
                <div className="grid min-h-[90dvh] w-full grid-cols-1 lg:min-h-[560px] lg:grid-cols-[minmax(260px,36%)_1fr]">
                  <aside className="relative flex flex-col overflow-hidden rounded-none bg-gradient-to-br from-[#143f2c] via-[#0f3929] to-[#092d20] px-6 py-7 text-white sm:px-9 sm:py-9 lg:min-h-[560px] lg:px-9 lg:py-9">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-28 h-64 w-64 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[34px] border-white/[0.04]" />
                    <div className="relative z-10 flex items-center gap-2" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-[#d6b66a]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                      <span className="h-1 w-1 rounded-full bg-[#d6b66a]/80" />
                    </div>

                    <div className="relative z-10 mt-6 lg:mt-10">
                      <img
                        src={contactPageLogo}
                        alt=""
                        aria-hidden="true"
                        className="absolute right-1 top-0 h-14 w-14 object-contain sm:h-16 sm:w-16"
                      />
                      <p className="pr-16 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e2c47d]">
                        Let&apos;s grow together
                      </p>
                      <h2 className="mt-2 max-w-xs font-serif text-3xl font-bold leading-[1.05] !text-[#f7f3df] sm:text-4xl">
                        EatPur Farmer
                        <span className="mt-1 flex items-center gap-2">
                          Connect
                          <img
                            src={contactPageLeaf}
                            alt=""
                            aria-hidden="true"
                            className="h-7 w-7 object-contain sm:h-8 sm:w-8"
                          />
                        </span>
                      </h2>
                    </div>

                    <div className="relative z-10 mt-7 max-w-sm lg:mt-10">
                      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold">
                        <span>Form completion</span>
                        <span>{formProgress}%</span>
                      </div>
                      <div
                        className="h-1.5 overflow-hidden rounded-full bg-white/15"
                        role="progressbar"
                        aria-label="Form completion"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={formProgress}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#c19d4e] to-[#ead698] transition-all duration-300"
                          style={{ width: `${formProgress}%` }}
                        />
                      </div>
                    </div>

                    <nav
                      className="relative z-10 mt-7 flex gap-5 lg:mt-10 lg:flex-col lg:gap-4"
                      aria-label="Enquiry form sections"
                    >
                      {[
                        {
                          label: "Contact details",
                          complete: contactStepComplete,
                          active: !contactStepComplete,
                        },
                        {
                          label: "Crop and land details",
                          complete: cropStepComplete,
                          active: contactStepComplete,
                        },
                      ].map((step, index) => (
                        <div
                          key={step.label}
                          className="relative flex min-w-0 items-center gap-2.5 lg:gap-3"
                        >
                          {index === 0 && (
                            <span
                              aria-hidden="true"
                              className="absolute left-[15px] top-8 hidden h-7 border-l border-dashed border-white/35 lg:block"
                            />
                          )}
                          <span
                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              step.complete
                                ? "bg-[#d5b568] text-[#123c2a]"
                                : step.active
                                  ? "border border-[#d5b568] bg-[#d5b568]/15 text-[#f1d88e]"
                                  : "border border-white/25 bg-white/10 text-white/70"
                            }`}
                          >
                            {step.complete ? "✓" : `0${index + 1}`}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[9px] uppercase tracking-[0.12em] text-white/55">
                              Step 0{index + 1}
                            </span>
                            <span className="block text-xs font-semibold leading-tight sm:text-sm">
                              {step.label}
                            </span>
                          </span>
                        </div>
                      ))}
                    </nav>

                    <p className="relative z-10 mt-6 text-[10px] leading-5 text-white/65 lg:mt-auto lg:pt-8">
                      Takes about 2 minutes · Your details stay with our team
                    </p>
                  </aside>

                  <main className="min-w-0 bg-[#f7f3e7]/90 px-4 py-7 sm:px-7 sm:py-9 lg:px-8 lg:py-8">
                    <div className="mx-auto w-full max-w-3xl">
                      <p className="mb-4 text-xs text-[#050501] sm:mb-5">
                        All fields marked{" "}
                        <span className="font-bold text-[#a64c37]">*</span>{" "}
                        are required
                      </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <section className="rounded-lg border border-[#ddd5bd] bg-[#f5f0df]/90 p-3.5 shadow-[0_4px_14px_-10px_rgba(35,55,35,0.35)] sm:p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9d3bb] text-[9px] font-bold text-[#283c2b]">01</span>
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-[#7b7968]">Step 01</p>
                            <h3 className="font-serif text-base font-bold leading-tight text-[#233d2c]">Contact details</h3>
                            <p className="text-[10px] text-[#6e705f]">How can our team reach you?</p>
                          </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
                          <FormField id="farmer-name" label="Full name" required>
                            <input
                              id="farmer-name"
                              type="text"
                              name="name"
                              autoComplete="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              className={inputClassName}
                            />
                          </FormField>

                          <FormField id="farmer-mobile" label="Mobile number" required>
                            <input
                              id="farmer-mobile"
                              type="tel"
                              name="mobile"
                              autoComplete="tel"
                              required
                              inputMode="numeric"
                              maxLength={10}
                              pattern="[0-9]{10}"
                              title="Enter exactly 10 digits"
                              value={formData.mobile}
                              onChange={handleChange}
                              placeholder="10-digit mobile number"
                              className={inputClassName}
                            />
                          </FormField>

                          <FormField
                            id="farmer-address"
                            label="Village, block, district and state"
                            required
                          >
                            <textarea
                              id="farmer-address"
                              name="address"
                              autoComplete="street-address"
                              required
                              rows={1}
                              value={formData.address}
                              onChange={handleChange}
                              placeholder="Enter your location"
                              className={`${inputClassName} resize-y`}
                            />
                          </FormField>

                          <FormField
                            id="farmer-member-count"
                            label="Number of farmers / members"
                            required
                          >
                            <input
                              id="farmer-member-count"
                              type="number"
                              min="1"
                              name="member_count"
                              required
                              value={formData.member_count}
                              onChange={handleChange}
                              placeholder="Enter number of members"
                              className={inputClassName}
                            />
                          </FormField>
                        </div>
                      </section>

                      <section className="rounded-lg border border-[#ddd5bd] bg-[#f5f0df]/90 p-3.5 shadow-[0_4px_14px_-10px_rgba(35,55,35,0.35)] sm:p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9d3bb] text-[9px] font-bold text-[#283c2b]">02</span>
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-[#7b7968]">Step 02</p>
                            <h3 className="font-serif text-base font-bold leading-tight text-[#233d2c]">Crop and land details</h3>
                            <p className="text-[10px] text-[#6e705f]">Help us understand your current crops and interests.</p>
                          </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
                          <FormField
                            id="farmer-cultivated-area"
                            label="Cultivated area"
                            required
                          >
                            <div className="mt-1 flex gap-2">
                              <input
                                id="farmer-cultivated-area"
                                type="number"
                                step="any"
                                min="0"
                                name="cultivated_area"
                                required
                                value={formData.cultivated_area}
                                onChange={handleChange}
                                placeholder="e.g. 25"
                                className={`${inputClassName} mt-0 min-w-0`}
                              />
                              <select
                                id="farmer-area-unit"
                                name="area_unit"
                                aria-label="Cultivated area unit"
                                value={formData.area_unit}
                                onChange={handleChange}
                                className="rounded-md border border-[#d8d1bc] bg-white/80 px-2 text-xs font-medium text-[#253626] outline-none focus:border-[#3e7d45] focus:ring-2 focus:ring-[#3e7d45]/15"
                              >
                                {AREA_UNITS.map((unit) => (
                                  <option key={unit} value={unit}>
                                    {unit}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </FormField>

                          <FormField
                            id="farmer-major-crop"
                            label="Major crop"
                            required
                          >
                            <input
                              id="farmer-major-crop"
                              type="text"
                              name="major_crop"
                              value={formData.major_crop}
                              onChange={handleChange}
                              placeholder="Enter your major crop"
                              className={inputClassName}
                              required
                              />
                          </FormField>

                          <div className="sm:col-span-2">
                            <FormField
                              id="farmer-crop-interest"
                              label="Crop you are interested in"
                              required
                            >
                              <select
                                id="farmer-crop-interest"
                                name="crop_of_interest"
                                required
                                value={formData.crop_of_interest}
                                onChange={handleChange}
                                className={inputClassName}
                              >
                                <option value="">Select a crop of interest</option>
                                {CROP_OPTIONS.map((crop) => (
                                  <option key={crop} value={crop}>
                                    {crop}
                                  </option>
                                ))}
                              </select>
                            </FormField>
                          </div>
                        </div>
                      </section>

                      {(error || successMsg) && (
                        <div aria-live="polite">
                          {error && (
                            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                              {error}
                            </p>
                          )}
                          {successMsg && (
                            <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-800">
                              {successMsg}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col-reverse items-start justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                       
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#103d29] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#185337] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17643a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting ? "Submitting..." : "Submit"}
                          <span aria-hidden="true">&rarr;</span>
                        </button>
                      </div>
                    </form>

                  </div>
                  </main>
                </div>
              {canViewContacts && (
                <section className="border-t border-[#e1dccb] bg-white/95 p-5 sm:p-7">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#71836a]">
                        Submissions
                      </p>
                      <h3 className="mt-1 font-serif text-2xl font-bold text-[#214d32]">
                        Farmer contacts
                        {showList ? ` (${contacts.length})` : ""}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={fetchContactsList}
                      disabled={loadingList}
                      className="rounded-full border border-[#b9cbb1] px-4 py-2 text-sm font-semibold text-[#285b37] transition hover:bg-[#f1f6ed] disabled:opacity-60"
                    >
                      {loadingList ? "Loading..." : "Refresh"}
                    </button>
                  </div>

                  {error && (
                    <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}
                  {contactActionMessage && (
                    <p
                      className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
                      role="status"
                      aria-live="polite"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                        ✓
                      </span>
                      {contactActionMessage}
                    </p>
                  )}
                  {!showList && loadingList && (
                    <p className="text-sm text-[#687466]">
                      Loading farmer submissions...
                    </p>
                  )}
                  {showList && contacts.length === 0 && !loadingList && (
                    <p className="rounded-xl bg-[#f6f8f3] px-4 py-5 text-sm text-[#687466]">
                      No farmer contacts have been submitted yet.
                    </p>
                  )}
                  {contacts.length > 0 && (
                    <>
                      <div className="space-y-3 lg:hidden">
                        {pageContacts.map((contact, index) => (
                          <article
                            key={contact.id ?? index}
                            className="rounded-xl border border-[#e0e9dc] bg-white p-4 shadow-sm"
                          >
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#71836a]">
                              Sr. No.{" "}
                              {(visiblePage - 1) * CONTACTS_PER_PAGE +
                                index +
                                1}
                            </p>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h4 className="break-words font-semibold text-[#214d32]">
                                  {contact.name || "-"}
                                </h4>
                                <p className="mt-1 break-words text-sm text-[#526254]">
                                  {contact.mobile || "-"}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-full bg-[#f1f6ed] px-2.5 py-1 text-xs font-semibold text-[#28533a]">
                                {contact.member_count ?? "-"} members
                              </span>
                            </div>
                            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#edf1ea] pt-3">
                              <div className="col-span-2 min-w-0">
                                <dt className="text-[10px] font-bold uppercase tracking-wider text-[#71836a]">
                                  Address
                                </dt>
                                <dd className="mt-1 break-words text-sm text-[#354237]">
                                  {contact.address || "-"}
                                </dd>
                              </div>
                              <div className="min-w-0">
                                <dt className="text-[10px] font-bold uppercase tracking-wider text-[#71836a]">
                                  Cultivated area
                                </dt>
                                <dd className="mt-1 break-words text-sm text-[#354237]">
                                  {contact.cultivated_area || "-"}
                                </dd>
                              </div>
                              <div className="min-w-0">
                                <dt className="text-[10px] font-bold uppercase tracking-wider text-[#71836a]">
                                  Major crop
                                </dt>
                                <dd className="mt-1 break-words text-sm text-[#354237]">
                                  {contact.major_crop || "-"}
                                </dd>
                              </div>
                              <div className="col-span-2 min-w-0">
                                <dt className="text-[10px] font-bold uppercase tracking-wider text-[#71836a]">
                                  Crop of interest
                                </dt>
                                <dd className="mt-1 break-words text-sm text-[#354237]">
                                  {contact.crop_of_interest || "-"}
                                </dd>
                              </div>
                            </dl>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1ea] pt-3">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#71836a]">
                                  Status
                                </p>
                                <span
                                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClassName(contact.status)}`}
                                >
                                  {contact.status || "Pending"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => openContactDetails(contact)}
                                className="rounded-md bg-[#103d29] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#185337]"
                              >
                                View detail
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                      <div className="hidden overflow-hidden rounded-xl border border-[#dce6d5] bg-white shadow-sm lg:block">
                      <table className="w-full table-fixed border-collapse divide-y divide-[#e7ede3] text-left text-xs xl:text-sm">
                        <thead className="bg-[#f1f6ed] text-[#28533a]">
                          <tr>
                            <th className="w-[5%] px-2 py-3 font-bold">Sr. No.</th>
                            <th className="w-[10%] px-2 py-3 font-bold">Name</th>
                            <th className="w-[10%] px-2 py-3 font-bold">Mobile</th>
                            <th className="w-[17%] px-2 py-3 font-bold">Address</th>
                            <th className="w-[6%] px-2 py-3 font-bold">Members</th>
                            <th className="w-[8%] px-2 py-3 font-bold">Area</th>
                            <th className="w-[11%] px-2 py-3 font-bold">Major crop</th>
                            <th className="w-[14%] px-2 py-3 font-bold">
                              Crop of interest
                            </th>
                            
                            <th className="w-[11%] px-2 py-3 font-bold">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#edf1ea] text-[#354237]">
                          {pageContacts.map((contact, index) => (
                            <tr
                              key={contact.id ?? index}
                              className="bg-white transition hover:bg-[#fafcf8]"
                            >
                              <td className="px-2 py-3 font-semibold text-[#71836a]">
                                {(visiblePage - 1) * CONTACTS_PER_PAGE +
                                  index +
                                  1}
                              </td>
                              <td className="break-words px-2 py-3 font-semibold">
                                {contact.name || "-"}
                              </td>
                              <td className="break-words px-2 py-3">
                                {contact.mobile || "-"}
                              </td>
                              <td className="break-words px-2 py-3">
                                {contact.address || "-"}
                              </td>
                              <td className="break-words px-2 py-3">
                                {contact.member_count ?? "-"}
                              </td>
                              <td className="break-words px-2 py-3">
                                {contact.cultivated_area || "-"}
                              </td>
                              <td className="break-words px-2 py-3">
                                {contact.major_crop || "-"}
                              </td>
                              <td className="break-words px-2 py-3">
                                {contact.crop_of_interest || "-"}
                              </td>
                             
                              <td className="px-2 py-3">
                                <button
                                  type="button"
                                  onClick={() => openContactDetails(contact)}
                                  className="whitespace-nowrap rounded-md bg-[#103d29] px-2 py-2 text-[10px] font-semibold text-white transition hover:bg-[#185337] xl:px-3 xl:text-xs"
                                >
                                  View
                                </button>
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteContact(contact)}
                                    disabled={deletingContactId === contact.id}
                                    className="ml-1 whitespace-nowrap rounded-md border border-red-200 px-2 py-2 text-[10px] font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60 xl:px-3 xl:text-xs"
                                  >
                                    {deletingContactId === contact.id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {contacts.length > CONTACTS_PER_PAGE && (
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ede3] pt-4">
                        <p className="text-xs text-[#687466]">
                          Showing{" "}
                          <span className="font-semibold text-[#354237]">
                            {firstVisibleContact}-{lastVisibleContact}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-[#354237]">
                            {contacts.length}
                          </span>{" "}
                          submissions
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentPage(Math.max(1, visiblePage - 1))
                            }
                            disabled={visiblePage === 1}
                            className="rounded-lg border border-[#dce6d5] bg-white px-3 py-2 text-xs font-semibold text-[#285b37] transition hover:bg-[#f1f6ed] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Previous
                          </button>
                          <span className="min-w-20 text-center text-xs font-semibold text-[#354237]">
                            Page {visiblePage} of {totalPages}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, visiblePage + 1),
                              )
                            }
                            disabled={visiblePage === totalPages}
                            className="rounded-lg border border-[#dce6d5] bg-white px-3 py-2 text-xs font-semibold text-[#285b37] transition hover:bg-[#f1f6ed] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                    {selectedContact && (
                      <div
                        className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 p-4"
                        onClick={() => setSelectedContact(null)}
                        role="presentation"
                      >
                        <section
                          className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/70 bg-[#fffdf7] shadow-2xl"
                          onClick={(event) => event.stopPropagation()}
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="farmer-contact-detail-title"
                        >
                          <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#123d2c] to-[#1d5b3e] px-5 py-5 text-white sm:px-7">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9c27e]">
                                Submission details
                              </p>
                              <h4
                                id="farmer-contact-detail-title"
                                className="mt-1 font-serif text-2xl font-bold text-white/70"
                              >
                                {selectedContact.name || "Submission details"}
                              </h4>
                              <p className="mt-1 text-xs text-white/70">
                                Review the farmer contact information and current status.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedContact(null)}
                              aria-label="Close details"
                              className="rounded-full px-2.5 py-1 text-xl text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                              &times;
                            </button>
                          </div>
                          <dl className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
                            {[
                              ["Mobile", selectedContact.mobile],
                              ["Address", selectedContact.address],
                              ["Members", selectedContact.member_count],
                              ["Cultivated area", selectedContact.cultivated_area],
                              ["Major crop", selectedContact.major_crop],
                              ["Crop of interest", selectedContact.crop_of_interest],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="min-w-0 rounded-xl border border-[#e9e4d4] bg-white px-3.5 py-3"
                              >
                                <dt className="text-[10px] font-bold uppercase tracking-wider text-[#71836a]">
                                  {label}
                                </dt>
                                <dd className="mt-1 break-words text-sm font-medium text-[#354237]">
                                  {value || "-"}
                                </dd>
                              </div>
                            ))}
                          </dl>
                          <div className="mx-5 mb-5 rounded-2xl border border-[#e9e4d4] bg-[#f7f3e7] p-4 sm:mx-7 sm:mb-7">
                            <label
                              htmlFor="farmer-contact-status"
                              className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#71836a]"
                            >
                              Current status
                            </label>
                            {isAdmin ? (
                              <select
                                id="farmer-contact-status"
                                value={statusDraft}
                                onChange={(event) =>
                                  setStatusDraft(event.target.value)
                                }
                                disabled={updatingStatusId === selectedContact.id}
                                className="mt-2 w-full rounded-xl border border-[#d8d1bc] bg-white px-3.5 py-3 text-sm font-semibold text-[#253626] shadow-sm outline-none transition focus:border-[#3e7d45] focus:ring-2 focus:ring-[#3e7d45]/15 disabled:opacity-60"
                              >
                                {!FARMER_CONTACT_STATUSES.includes(
                                  statusDraft,
                                ) &&
                                  statusDraft && (
                                    <option value={statusDraft}>
                                      {statusDraft}
                                    </option>
                                  )}
                                {FARMER_CONTACT_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : null}
                            {isAdmin ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusUpdate(selectedContact)
                                  }
                                  disabled={
                                    !selectedContact.id ||
                                    updatingStatusId === selectedContact.id ||
                                    statusDraft ===
                                      (selectedContact.status || "Pending")
                                  }
                                  className="rounded-md bg-[#103d29] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#185337] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {updatingStatusId === selectedContact.id
                                    ? "Updating..."
                                    : "Update status"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteContact(selectedContact)
                                  }
                                  disabled={
                                    !selectedContact.id ||
                                    deletingContactId === selectedContact.id
                                  }
                                  className="rounded-md border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {deletingContactId === selectedContact.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            ) : (
                              <p
                                className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${getStatusClassName(selectedContact.status)}`}
                              >
                                {selectedContact.status || "Pending"}
                              </p>
                            )}
                            {error && (
                              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                {error}
                              </p>
                            )}
                            {contactActionMessage && selectedContact.id && (
                              <p
                                className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"
                                role="status"
                                aria-live="polite"
                              >
                                ✓ {contactActionMessage}
                              </p>
                            )}
                          </div>
                        </section>
                      </div>
                    )}
                    </>
                  )}
                </section>
              )}
              </div>
            </div>
          </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
