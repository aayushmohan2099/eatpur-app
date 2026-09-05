// src\pages\Admin\Admin\OrderComps\DispatchOrder.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../UniComps/Modal";
import MagicButton from "../UniComps/MagicButton";
import { getEkartAddresses, createShipment } from "../../../../api/logistics";
import StatusBadge3D from "../../../User/Components/ui/StatusBadge3D";

export default function DispatchOrder({ isOpen, onClose, order, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Warehouse State
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState("Primary Warehouse");

  // Step 2: Dimensions State
  const [globalDimensions, setGlobalDimensions] = useState({
    weight: "",
    length: "",
    height: "",
    width: "",
  });
  const [itemDimensions, setItemDimensions] = useState({});

  const items = order?.items || [];
  const isMultiItem = items.length > 1;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setGlobalDimensions({ weight: "", length: "", height: "", width: "" });
      setItemDimensions({});
      fetchWarehouses();
    }
  }, [isOpen]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await getEkartAddresses();
      const data = res.data || res.results || res;
      if (Array.isArray(data) && data.length > 0) {
        setWarehouses(data);
        // If "Primary Warehouse" doesn't exist in fetched data, default to the first one
        if (!data.find((w) => w.alias === "Primary Warehouse")) {
          setSelectedWarehouse(data[0].alias);
        }
      }
    } catch (err) {
      console.error("Failed to load warehouses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalDimChange = (e) => {
    setGlobalDimensions({
      ...globalDimensions,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemDimChange = (productId, e) => {
    setItemDimensions({
      ...itemDimensions,
      [productId]: {
        ...(itemDimensions[productId] || {}),
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleDispatch = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        sale_order_id: order.id,
        pickup_location_alias: selectedWarehouse,
      };

      // Attach Global Overrides if provided
      if (globalDimensions.weight)
        payload.weight = Number(globalDimensions.weight);
      if (globalDimensions.length)
        payload.length = Number(globalDimensions.length);
      if (globalDimensions.height)
        payload.height = Number(globalDimensions.height);
      if (globalDimensions.width)
        payload.width = Number(globalDimensions.width);

      // Attach Item Overrides if multiple items
      if (isMultiItem && Object.keys(itemDimensions).length > 0) {
        payload.items_dimensions = itemDimensions;
      }

      await createShipment(payload);
      alert("Shipment successfully created & dispatched via Ekart!");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to dispatch order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dispatch Order #ORD-${order.id}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex justify-between w-full">
          {step === 2 ? (
            <MagicButton
              variant="neutral"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
            >
              &larr; Back
            </MagicButton>
          ) : (
            <div></div> // Empty div to keep 'Next' on the right
          )}

          {step === 1 ? (
            <MagicButton variant="eatpur" onClick={() => setStep(2)}>
              Next Step &rarr;
            </MagicButton>
          ) : (
            <MagicButton
              variant="eatpur"
              onClick={handleDispatch}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Dispatching..." : "Confirm & Dispatch"}
            </MagicButton>
          )}
        </div>
      }
    >
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* STEP 1: WAREHOUSE SELECTION                               */}
          {/* ========================================================= */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">
                  Step 1: Select Pickup Warehouse
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Choose the registered Ekart location from where this order
                  will be picked up.
                </p>

                {loading ? (
                  <div className="animate-pulse h-10 bg-slate-200 rounded-lg"></div>
                ) : warehouses.length === 0 ? (
                  <div className="text-sm text-rose-500 font-medium p-3 bg-rose-50 rounded-lg border border-rose-200">
                    No warehouses found. Please add one in Logistics &gt; Saved
                    Addresses first.
                  </div>
                ) : (
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[--color-eatpur-green-dark]"
                  >
                    {warehouses.map((w) => (
                      <option key={w.alias} value={w.alias}>
                        {w.alias} — {w.city}, {w.state} ({w.pincode})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: ORDER & DIMENSIONS OVERRIDE                       */}
          {/* ========================================================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
            >
              {/* Order Summary */}
              <div className="bg-slate-800 text-white p-5 rounded-xl flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                    Customer
                  </p>
                  <p className="font-bold">
                    {order.consignee_name || order.customer_name}
                  </p>
                  <p className="text-sm text-slate-300">
                    {order.consignee_phone || order.customer_phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                    Payment
                  </p>
                  <p className="font-bold text-emerald-400 text-lg">
                    ₹{order.total_amount}
                  </p>
                  <StatusBadge3D status={order.payment_status} />
                </div>
              </div>

              <div className="text-sm text-slate-500 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                <span className="font-bold text-blue-700">Note:</span>{" "}
                Dimensions will be pulled automatically from your Inventory
                settings. Only fill the inputs below if you want to{" "}
                <b>override</b> the defaults for this specific shipment.
              </div>

              {/* Item-wise Overrides (Only if Multiple Items) */}
              {isMultiItem && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">
                    Item-Specific Dimension Overrides
                  </h3>
                  {items.map((item, idx) => {
                    // Fallback ID checking based on how your serializer returns it
                    const prodId =
                      item.product_id || item.product?.id || item.id;

                    return (
                      <div
                        key={idx}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200"
                      >
                        <p className="font-semibold text-slate-800 mb-3 text-sm">
                          {item.product_name}{" "}
                          <span className="text-slate-400">
                            (Qty: {item.quantity})
                          </span>
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              Weight (g)
                            </label>
                            <input
                              type="number"
                              name="weight"
                              value={itemDimensions[prodId]?.weight || ""}
                              onChange={(e) => handleItemDimChange(prodId, e)}
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                              placeholder="Auto"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              Length (cm)
                            </label>
                            <input
                              type="number"
                              name="length"
                              value={itemDimensions[prodId]?.length || ""}
                              onChange={(e) => handleItemDimChange(prodId, e)}
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                              placeholder="Auto"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              Width (cm)
                            </label>
                            <input
                              type="number"
                              name="width"
                              value={itemDimensions[prodId]?.width || ""}
                              onChange={(e) => handleItemDimChange(prodId, e)}
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                              placeholder="Auto"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              Height (cm)
                            </label>
                            <input
                              type="number"
                              name="height"
                              value={itemDimensions[prodId]?.height || ""}
                              onChange={(e) => handleItemDimChange(prodId, e)}
                              className="w-full px-3 py-1.5 rounded border border-slate-300 text-sm"
                              placeholder="Auto"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Global Overrides */}
              <div className="bg-white p-5 rounded-xl border-2 border-dashed border-slate-300">
                <h3 className="font-bold text-[--color-eatpur-dark] mb-1">
                  Total Package Dimensions (Final Box)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Leave blank to auto-calculate based on inventory data.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Total Weight (g)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={globalDimensions.weight}
                      onChange={handleGlobalDimChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm"
                      placeholder="Auto"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      name="length"
                      value={globalDimensions.length}
                      onChange={handleGlobalDimChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm"
                      placeholder="Auto"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      name="width"
                      value={globalDimensions.width}
                      onChange={handleGlobalDimChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm"
                      placeholder="Auto"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={globalDimensions.height}
                      onChange={handleGlobalDimChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[--color-eatpur-green-dark] outline-none text-sm"
                      placeholder="Auto"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
