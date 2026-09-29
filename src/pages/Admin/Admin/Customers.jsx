// src/pages/Admin/Admin/Customer.jsx
import React, { useCallback, useEffect, useState } from "react";
import { getAdminOrders, getCustomerAddressHistory } from "../../../api/shop.js";
import { fixMediaUrl } from "../../../utils/fixMediaUrl";

import EatpurTable from "./UniComps/Table";
import { FaEye, FaTimes, FaBoxOpen, FaSearch } from "react-icons/fa";

const normalizeCustomers = (response) => {
  const payload = response?.data && !Array.isArray(response.data) ? response.data : response;
  const customers = Array.isArray(payload) ? payload : payload?.results || payload?.data || [];

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

const normalizeOrderDetails = (orders) => {
  const groupedOrders = new Map();

  orders.forEach((order, index) => {
    const orderId = order?.id ?? order?.order_id ?? `order-${index}`;
    const items = getOrderItems(order);
    const existingOrder = groupedOrders.get(orderId);

    if (existingOrder) {
      existingOrder.items.push(...items);
      return;
    }

    groupedOrders.set(orderId, {
      ...order,
      items: [...items],
    });
  });

  return Array.from(groupedOrders.values());
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
  itemsPerPage,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [modalError, setModalError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

      const response = await getAdminOrders({
        order_ids: orderIds.join(","),
        page_size: orderIds.length,
      });
      const payload = response?.data || response;
      const orders = Array.isArray(payload) ? payload : payload?.results || payload?.orders || [];
      const requestedOrderIds = new Set(orderIds.map(String));
      const matchingOrders = orders.filter((order) =>
        requestedOrderIds.has(String(order?.id ?? order?.order_id)),
      );

      if (matchingOrders.length === 0) throw new Error("No order details found.");
      setOrderDetails(normalizeOrderDetails(matchingOrders));
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

  // Aapki purani columns hi rakhi hain bina naye S.No ke
  const columns = [
    { header: "Name", accessor: "consigneeName" },
    { header: "Phone", accessor: "consigneePhone" },
    { header: "Alternative Phone", accessor: "consigneeAlternatePhone" },
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
      consigneeAlternatePhone: customer.consignee_alternate_phone || customer.consignee_alternate_phone || "-",
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
          {/* YAHAN HUMNE currentPage AUR itemsPerPage ADD KIYA HAI */}
          <EatpurTable 
            columns={columns} 
            data={rows} 
            showActions={false} 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
          />
          
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

      {/* PRODUCT DETAILS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm transition-all duration-300 sm:p-6">
          <div className="my-3 flex max-h-[calc(100vh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-[#fcfcfa] shadow-2xl sm:my-6 sm:max-h-[calc(100vh-3rem)]">
            
            <div className="flex items-center justify-between gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-4 sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
                  <FaBoxOpen size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Customer history</p>
                  <h3 className="truncate text-lg font-bold text-slate-900 sm:text-xl">Order details</h3>
                </div>
              </div>
              <button 
                onClick={closeModal}
                aria-label="Close order details"
                title="Close"
                className="shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="min-h-[250px] overflow-y-auto p-4 sm:p-6">
              {modalLoading ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700"></div>
                  <p className="text-sm font-medium text-slate-500">Fetching order details...</p>
                </div>
              ) : modalError ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-center">
                  <p className="font-medium text-rose-600">{modalError}</p>
                </div>
              ) : orderDetails.length > 0 ? (
                <div className="space-y-4 ">
                  <div className="grid grid-cols-1 gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Customer User Name</p>
                      <p className="mt-1 font-semibold text-slate-900">{orderDetails[0]?.customer_name || selectedCustomer?.consignee_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Customer Phone</p>
                      <p className="mt-1 font-semibold text-slate-900">{orderDetails[0]?.customer_phone || selectedCustomer?.consignee_phone || "-"}</p>
                    </div>
                    <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer Email</p>
                            <p className="mt-1 break-all text-slate-700">{orderDetails[0]?.customer_email || selectedCustomer?.consignee_email || "-"}</p>
                          </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Orders</p>
                      <p className="mt-1 font-semibold text-slate-900">{selectedCustomer?.order_count ?? orderDetails.length}</p>
                    </div>
                   
                  </div>

                  {orderDetails.map((order, orderIndex) => {
                    const items = getOrderItems(order);
                    const orderDate = order.order_date
                      ? new Date(order.order_date).toLocaleString()
                      : "-";
                    const trackingIds = Array.isArray(order.tracking_ids)
                      ? order.tracking_ids
                      : [];
                    const ekartStatuses = Array.isArray(order.ekart_statuses)
                      ? order.ekart_statuses
                      : [];

                    return (
                      <div key={order.id || order.order_id || orderIndex} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                              Order #{order.id || order.order_id || "-"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">{orderDate}</p>
                          </div>
                          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Total amount</p>
                            <p className="font-bold text-emerald-900">₹{order.total_amount || "0"}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consignee Name</p>
                            <p className="mt-1 font-semibold text-slate-800">{selectedCustomer?.consignee_name || order.customer_name || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consignee Phone</p>
                            <p className="mt-1 text-slate-700">{selectedCustomer?.consignee_phone || order.customer_phone || "-"}</p>
                          </div>
                          
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alternate Phone</p>
                            <p className="mt-1 leading-relaxed text-slate-700">{selectedCustomer?.consignee_alternate_phone || selectedCustomer?.alternate_phone || order.customer_alternate_phone || "-"}</p>
                          </div>
                          <div className="sm:col-span-2 lg:col-span-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivery Address</p>
                            <p className="mt-1 leading-relaxed text-slate-700">
                              {[
                                selectedCustomer?.drop_location || selectedCustomer?.street_address || selectedCustomer?.address_line,
                                selectedCustomer?.drop_city || selectedCustomer?.city,
                                selectedCustomer?.drop_state || selectedCustomer?.state,
                                selectedCustomer?.drop_pincode || selectedCustomer?.pincode,
                              ].filter(Boolean).join(", ") || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment</p>
                            <span className="mt-1 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">{order.payment_status || "-"}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fulfillment</p>
                            <span className="mt-1 inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">{order.fulfillment_status || "-"}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracking IDs</p>
                            <p className="mt-1 break-all text-slate-700">{trackingIds.join(", ") || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ekart Status</p>
                            <p className="mt-1 text-slate-700">{ekartStatuses.join(", ") || "-"}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Products</p>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{items.length} item{items.length === 1 ? "" : "s"}</span>
                        </div>

                        {items.length > 0 ? items.map((item, index) => {
                          const product = item.product || item.product_details || item.product_info || item;
                          const productName = product.name || product.title || item.product_name || item.product_title || "Unknown Product";
                          const image = getItemImage(item, product);
                          const price = item.price_at_purchase || item.price || item.unit_price || product.price || product.mrp || product.selling_price || "0";
                          const subtotal = item.subtotal || "-";
                          const quantity = item.quantity || item.qty;

                          return (
                            <div key={item.id || item.product_id || index} className="flex gap-3 rounded-xl border border-slate-100 bg-[#fcfcfa] p-3 transition-colors hover:border-emerald-200 sm:p-4">
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
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
                                <h4 className="font-bold leading-tight text-slate-900">{productName}</h4>
                                <p className="mt-1 text-xs font-medium text-emerald-700">PID: {item.pid || item.product_id || "-"}</p>
                                <p className="mt-1 text-sm text-slate-700">
                                  ₹{price}{quantity ? ` × ${quantity}` : ""} | Subtotal: ₹{subtotal}
                                </p>
                                {(product.description || item.description) && (
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
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
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCustomerAddressHistory(currentPage, itemsPerPage);
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

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    const name = (customer.consignee_name || "").toLowerCase();
    const phone = (customer.consignee_phone || "").toLowerCase();
    const pincode = (customer.drop_pincode || customer.pincode || "").toLowerCase();

    return name.includes(query) || phone.includes(query) || pincode.includes(query);
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(totalCustomers / itemsPerPage));
  const displayedCustomers = filteredCustomers.length > itemsPerPage
    ? filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      )
    : filteredCustomers;

  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, phone, or pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-eatpur-green-dark focus:outline-none focus:ring-1 focus:ring-eatpur-green-dark"
          />
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <CustomerList
        customers={displayedCustomers}
        loading={loading}
        error={error}
        onRetry={fetchCustomers}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        itemsPerPage={itemsPerPage} // Passed down
        onPageChange={(page) => {
          if (page >= 1 && (!totalPages || page <= totalPages)) {
            setCurrentPage(page);
          }
        }}
      />
    </div>
  );
}