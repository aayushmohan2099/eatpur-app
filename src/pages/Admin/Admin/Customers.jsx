// src/pages/Admin/Admin/Customer.jsx
import React, { useCallback, useEffect, useState } from "react";
import { getAdminOrders, getCustomerAddressHistory } from "../../../api/shop.js";
import { fixMediaUrl } from "../../../utils/fixMediaUrl";

import EatpurTable from "./UniComps/Table";
import { FaEye, FaTimes, FaBoxOpen } from "react-icons/fa";

const normalizeCustomers = (response) => {
  const payload =
    response?.data && !Array.isArray(response.data) ? response.data : response;
  const customers = Array.isArray(payload)
    ? payload
    : payload?.results || payload?.data || [];

  return {
    customers: Array.isArray(customers) ? customers : [],
    total: Number(payload?.count || payload?.total || customers.length),
    hasNext: Boolean(payload?.next),
    hasPrevious: Boolean(payload?.previous),
  };
};

const getMediaUrl = (value) => {
  const rawValue = typeof value === "object" ? value?.url || value?.image || value?.file : value;
  if (!rawValue || typeof rawValue !== "string") return "";

  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return fixMediaUrl(rawValue);
  }

  return `https://eatpur.in${rawValue.startsWith("/") ? rawValue : `/${rawValue}`}`;
};

const getItemImage = (item, product) => {
  const media = product?.media || product?.images || product?.product_images || product?.media_files || product?.product_media || [];
  const firstMedia = Array.isArray(media) ? media[0] : media;

  return getMediaUrl(
    product?.image ||
      product?.thumbnail ||
      product?.image_url ||
      product?.product_image_url ||
      item?.product_image ||
      item?.product_image_url ||
      item?.image ||
      firstMedia,
  );
};

const getOrderItems = (order) => {
  const items = order?.items || order?.order_items || order?.line_items || order?.products;
  if (Array.isArray(items)) return items;

  if (order?.product || order?.product_id || order?.product_name || order?.name) {
    return [order];
  }

  return [];
};

function CustomerList({
  customers,
  loading,
  error,
  onRetry,
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}) {
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [modalError, setModalError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // View Button Click Handler
  const handleViewClick = async (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError("");
    setOrderDetails([]);

    try {
      const orderIds = Array.isArray(customer?.order_ids)
        ? customer.order_ids.filter(Boolean)
        : [customer?.order_id || customer?.id].filter(Boolean);

      if (orderIds.length === 0) throw new Error("Order ID missing for this customer.");

      const response = await getAdminOrders({ order_ids: orderIds.join(",") });
      const payload = response?.data || response;
      const orders = Array.isArray(payload)
        ? payload
        : payload?.results || payload?.orders || [];

      if (orders.length === 0) throw new Error("No order details found.");
      setOrderDetails(orders);
    } catch (err) {
      console.error("Product fetch error:", err);
      setModalError(err.message || "Something went wrong while fetching details.");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderDetails([]);
  };

  // Table Columns Setup
  const columns = [
    { header: "Name", accessor: "consigneeName" },
    { header: "Phone", accessor: "consigneePhone" },
    { header: "Alternative Phone", accessor: "alternativePhone" },
    { header: "Location", accessor: "dropLocation" },
    { header: "City", accessor: "dropCity" },
    { header: "State", accessor: "dropState" },
    { header: "Pincode", accessor: "dropPincode" },
    { header: "Order Count", accessor: "orderCount" },
    { header: "Action", accessor: "actionBtn" },
  ];

  const rows = customers.map((customer) => {
    return {
      ...customer,
      consigneeName: customer.consignee_name || "-",
      consigneePhone: customer.consignee_phone || "-",
      alternativePhone: customer.consignee_alternative_phone || customer.alternative_phone || "-",
      dropLocation: customer.drop_location || customer.street_address || customer.address_line || "-",
      dropCity: customer.drop_city || customer.city || "-",
      dropState: customer.drop_state || customer.state || "-",
      dropPincode: customer.drop_pincode || customer.pincode || "-",
      orderCount: customer.order_count ?? "0",
      actionBtn: (
        <button
          onClick={() => handleViewClick(customer)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm"
        >
          <FaEye /> View
        </button>
      ),
    };
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800">
          <span>{error}</span>
          <button onClick={onRetry} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-[--color-eatpur-yellow-light] bg-white p-8 text-center text-sm text-slate-500">
          Loading customer history...
        </div>
      ) : (
        <>
          <EatpurTable columns={columns} data={rows} showActions={false} />
          
          {(totalPages > 1 || hasNext || hasPrevious) && (
            <div className="flex items-center justify-between rounded-xl border border-[--color-eatpur-yellow-light] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-[--color-eatpur-text]">
                Page <span className="font-semibold">{currentPage}</span>
                {totalPages > 0 && ` of ${totalPages}`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!hasPrevious && currentPage === 1}
                  className="rounded border border-[--color-eatpur-yellow-light] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!hasNext && currentPage >= totalPages}
                  className="rounded border border-[--color-eatpur-yellow-light] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================= */}
      {/* PRODUCT DETAILS MODAL                     */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm transition-all duration-300 sm:p-6">
          <div className="my-3 flex max-h-[calc(100vh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-6 sm:max-h-[calc(100vh-3rem)]">
            
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/80 p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 sm:text-lg">
                 <FaBoxOpen className="text-eatpur-green-dark" /> Order Product Details
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-full p-2 transition-all shadow-sm"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="min-h-[250px] overflow-y-auto p-4 sm:p-6">
              {modalLoading ? (
                <div className="flex flex-col justify-center items-center gap-3">
                  <div className="animate-spin h-8 w-8 border-4 border-eatpur-green-dark border-t-transparent rounded-full"></div>
                  <p className="text-gray-500 text-sm font-medium">Fetching product details...</p>
                </div>
              ) : modalError ? (
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-red-600 font-medium">{modalError}</p>
                </div>
              ) : orderDetails.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 rounded-xl border border-green-100 bg-green-50/60 p-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Customer</p>
                      <p className="mt-1 font-semibold text-gray-800">{selectedCustomer?.consignee_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone</p>
                      <p className="mt-1 font-semibold text-gray-800">{selectedCustomer?.consignee_phone || "-"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Address</p>
                      <p className="mt-1 leading-relaxed text-gray-700">
                        {[
                          selectedCustomer?.drop_location || selectedCustomer?.street_address || selectedCustomer?.address_line,
                          selectedCustomer?.drop_city || selectedCustomer?.city,
                          selectedCustomer?.drop_state || selectedCustomer?.state,
                          selectedCustomer?.drop_pincode || selectedCustomer?.pincode,
                        ].filter(Boolean).join(", ") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Orders</p>
                      <p className="mt-1 font-semibold text-gray-800">{selectedCustomer?.order_count ?? orderDetails.length}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Alternative Phone</p>
                      <p className="mt-1 font-semibold text-gray-800">{selectedCustomer?.consignee_alternative_phone || selectedCustomer?.alternative_phone || "-"}</p>
                    </div>
                  </div>

                  {orderDetails.map((order, orderIndex) => {
                    const items = getOrderItems(order);

                    return (
                      <div key={order.id || order.order_id || orderIndex} className="space-y-3 rounded-xl border border-gray-100 p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-eatpur-green-dark">
                          Order #{order.id || order.order_id || "-"}
                        </p>
                        {items.length > 0 ? items.map((item, index) => {
                          const product = item.product || item.product_details || item.product_info || item;
                          const productName = product.name || product.title || item.product_name || item.product_title || "Unknown Product";
                          const image = getItemImage(item, product);
                          const price = item.price || item.unit_price || product.price || product.mrp || product.selling_price || "0";
                          const quantity = item.quantity || item.qty;

                          return (
                            <div key={item.id || item.product_id || index} className="flex gap-3 rounded-lg bg-gray-50 p-3 sm:p-4">
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white">
                                {image ? (
                                  <>
                                    <img
                                      src={image}
                                      alt={productName}
                                      className="h-full w-full object-contain"
                                      onError={(event) => {
                                        event.currentTarget.classList.add("hidden");
                                        event.currentTarget.nextElementSibling?.classList.remove("hidden");
                                      }}
                                    />
                                    <FaBoxOpen size={24} className="hidden text-gray-300" />
                                  </>
                                ) : (
                                  <FaBoxOpen size={24} className="text-gray-300" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold leading-tight text-gray-800">{productName}</h4>
                                <p className="mt-1 text-sm text-green-800">
                                  ₹{price}{quantity ? ` × ${quantity}` : ""}
                                </p>
                                {(product.description || item.description) && (
                                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                    {product.description || item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }) : (
                          <p className="text-sm text-gray-500">No products found for this order.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerWorkspace() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCustomerAddressHistory(currentPage);
      const normalized = normalizeCustomers(response);
      setCustomers(normalized.customers);
      setTotalCustomers(normalized.total);
      setHasNext(normalized.hasNext);
      setHasPrevious(normalized.hasPrevious || currentPage > 1);
    } catch (requestError) {
      console.error("Error fetching customer history:", requestError);
      setError("Failed to load customer data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const totalPages = Math.max(1, Math.ceil(totalCustomers / 10)); 

  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h2
          className="text-2xl font-medium text-[--color-eatpur-dark]"
          style={{ fontFamily: "var(--font-display, serif)" }}
        >
          Customer Address History
        </h2>
        <p className="mt-1 text-sm text-[--color-eatpur-text-light]">
          Manage and view order history, locations, and contact details of customers.
        </p>
      </div>

      <CustomerList
        customers={customers}
        loading={loading}
        error={error}
        onRetry={fetchCustomers}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={(page) => {
          if (page >= 1 && (hasNext || page <= totalPages)) {
            setCurrentPage(page);
          }
        }}
      />
    </div>
  );
}