import React, { useState } from "react";
import {
  generateLocalInvoice,
  getInvoiceDetails,
} from "../../../../api/customerApi";
import Button3D from "../ui/Button3D";
import { FaDownload } from "react-icons/fa6";
import logoImg from "../../../../assets/Logo3D.png";

export default function DownloadInvoice({
  orderId,
  invoiceNumber,
  buttonLabel = "Download",
  className = "text-xs",
  onClick,
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let invoiceData;
      try {
        invoiceData = await getInvoiceDetails(orderId);
      } catch (error) {
        console.warn("Invoice download failed.", error);
      }

      const parseInvoiceResponse = (response) => {
        if (typeof response !== "string") return response;
        try {
          return JSON.parse(response);
        } catch {
          return null;
        }
      };
      invoiceData = parseInvoiceResponse(invoiceData);

      const hasInvoiceDetails =
        invoiceData &&
        typeof invoiceData === "object" &&
        !(invoiceData instanceof Blob) &&
        invoiceData.invoice_details &&
        typeof invoiceData.invoice_details === "object" &&
        Array.isArray(invoiceData.items);
      const hasPdfFile =
        invoiceData instanceof Blob &&
        (!invoiceData.type || invoiceData.type.toLowerCase().includes("pdf"));

      if (!hasInvoiceDetails && !hasPdfFile) {
        const shouldGenerate = window.confirm(
          "The invoice is not ready to download. Would you like to create and download a copy now?",
        );

        if (!shouldGenerate) return;
        invoiceData = parseInvoiceResponse(await generateLocalInvoice(orderId));
      }

      if (hasInvoiceDetails || (invoiceData?.invoice_details && Array.isArray(invoiceData.items))) {
        generatePrintableInvoice(invoiceData);
        return;
      }

      if (!(invoiceData instanceof Blob)) {
        throw new Error("Invoice response was not a valid file.");
      }

      const blobType = (invoiceData.type || "").toLowerCase();
      if (blobType && !blobType.includes("pdf")) {
        const textPreview = await invoiceData.text().catch(() => "");
        console.error("Received non-PDF invoice blob.", {
          blobType,
          preview: textPreview.slice(0, 200),
        });
        throw new Error(
          "The downloaded file is not a valid PDF. Please try again or generate a fresh invoice.",
        );
      }

      const downloadUrl = URL.createObjectURL(invoiceData);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${invoiceNumber || `invoice-${orderId}`}.pdf`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to download invoice document.");
    } finally {
      setDownloading(false);
    }
  };

  const generatePrintableInvoice = (data) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const invoice = data?.invoice_details || {};
    const company = data?.company_info || {};
    const customer = data?.customer_info || {};
    const shipping = data?.shipping_info || customer;
    const items = Array.isArray(data?.items) ? data.items : [];
    const totals = data?.totals || {};
    const escapeHtml = (value) =>
      String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]);
    const formatAmount = (value) => {
      if (value == null || value === "") return "";
      const amount = Number(value);
      return Number.isFinite(amount) ? amount.toFixed(2) : escapeHtml(value);
    };
    const formatDate = (value) => {
      if (!value) return "";

      let date;
      if (value instanceof Date) {
        date = value;
      } else if (typeof value === "string") {
        const dateOnlyMatch = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        const dayFirstMatch = value.trim().match(
          /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)?$/i,
        );

        if (dateOnlyMatch) {
          date = new Date(
            Number(dateOnlyMatch[1]),
            Number(dateOnlyMatch[2]) - 1,
            Number(dateOnlyMatch[3]),
          );
        } else if (dayFirstMatch) {
          date = new Date(
            Number(dayFirstMatch[3]),
            Number(dayFirstMatch[2]) - 1,
            Number(dayFirstMatch[1]),
          );
        } else {
          date = new Date(value);
        }
      } else {
        date = new Date(value);
      }

      return Number.isNaN(date.getTime())
        ? ""
        : escapeHtml(date.toLocaleDateString("en-GB"));
    };
    const itemRows = items.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td class="product-name">${escapeHtml([item.name || item.product_name, item.sku].filter(Boolean).join(" - "))}</td>
        <td>${formatAmount(totals.total_mrp)}</td>
        <td>${escapeHtml(item.quantity)}</td>
        
        <td>${formatAmount(item.taxable_amount)}</td>
        <td>${escapeHtml(item.tax_rate)}</td>
        <td>${escapeHtml(item.tax_type)}</td>
        <td>${formatAmount(item.tax_value)}</td>
        <td>${formatAmount(item.subtotal)}</td>
      </tr>
    `).join("");
    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const orderDate = invoice.order_date || data?.order_details?.date;

    const htmlContent = `
      <html>
        <head>
          <title>Invoice ${escapeHtml(invoice.invoice_number)}</title>
          <style>
            @page { size: A4; margin: 6mm; }
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; color: #000; font-family: Arial, sans-serif; font-size: 11px; }
            .invoice-box { width: 100%; margin: 0 auto; border: 1px solid #777; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            td, th { border: 1px solid #111; padding: 6px 7px; vertical-align: middle; }
            .header-section { height: 135px; position: relative; text-align: center; border-bottom: 1px solid #111; padding: 8px 5px; }
            .header-left { position: absolute; top: 7px; left: 5px; text-align: left; }
            .header-right { position: absolute; top: 7px; right: 5px; font-size: 14px; font-weight: bold; }
            .invoice-title { margin-bottom: 5px; font-size: 24px; font-weight: bold; }
            .company-block { padding-top: 28px; line-height: 1.35; }
            .company-logo { display: block; width: auto; max-width: 100px; max-height: 40px; margin: 0 auto 4px; }
            .spacer { height: 25px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .section-heading { background: #e9e9e9; font-weight: bold; text-align: center; }
            .address-location { display: grid; grid-template-columns: 1fr 1fr; }
            .address-location > span { padding: 0 5px; }
            .address-location > span:last-child { padding-right: 10px; }
            .address-location-cell { position: relative; }
            .address-location-cell::after { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; border-right: 1px solid #111; pointer-events: none; }
            .items-table th { height: 52px; padding: 5px 3px; background: #e9e9e9; text-align: center; font-weight: bold; line-height: 1.15; }
            .items-table td { text-align: center; padding: 6px 4px; }
            .items-table .product-name { text-align: left; line-height: 1.2; overflow-wrap: anywhere; }
            .totals-table td { padding: 6px 7px; }
            .footer-note { padding: 5px 7px; }
            .footer-signature { padding: 16px 7px 5px; }
            @media print {
              body, .invoice-box, th, .section-heading, .items-table th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header-section">
              <div class="header-left">
                <div class="invoice-title">Tax Invoice</div>
                <div><strong>GSTIN:</strong> ${escapeHtml(company.gstin)}</div>
              </div>
              <div class="header-right">ORIGINAL</div>
              <div class="company-block">
                <img class="company-logo" src="${logoImg}" alt="EatPur Logo" />
                <div class="font-bold">${escapeHtml(company.name)}</div>
                <div>${escapeHtml(company.address)}</div>
              </div>
            </div>

            <table>
              <tr>
                <td style="width: 50%;">Invoice No: <strong>${escapeHtml(invoice.invoice_number)}</strong></td>
                <td style="width: 50%;">Order No: <strong>${escapeHtml(invoice.order_id || orderId)}</strong></td>
              </tr>
              <tr>
                <td>Invoice Date: <strong>${formatDate(invoice.date )}</strong></td>
                <td>Order Date: <strong>${formatDate(orderDate)}</strong></td>
              </tr>
              <tr>
                <td>State: <strong>${escapeHtml(customer.state)}</strong></td>
                <td>Country: <strong>${escapeHtml(customer.country)}</strong></td>
              </tr>
            </table>

            <div class="spacer"></div>

            <table>
              <tr>
                <td class="section-heading" style="width: 50%;">BILL TO PARTY</td>
                <td class="section-heading" style="width: 50%;">SHIP TO PARTY / DELIVERY ADDRESS</td>
              </tr>
              <tr>
                <td class="font-bold">${escapeHtml(customer.name)}</td>
                <td class="font-bold">${escapeHtml(shipping.name || customer.name)}</td>
              </tr>
              <tr>
                <td>${escapeHtml(customer.address)}</td>
                <td>${escapeHtml(shipping.address || customer.shipping_address)}</td>
              </tr>
              <tr>
                <td>Pincode: <strong>${escapeHtml(customer.pincode)}</strong></td>
                <td>Pincode: <strong>${escapeHtml(shipping.pincode || customer.pincode)}</strong></td>
              </tr>
              <tr>
                <td>Phone No: <strong>${escapeHtml(customer.phone)}</strong></td>
                <td>Phone No: <strong>${escapeHtml(shipping.phone || customer.phone)}</strong></td>
              </tr>
             <tr>
                <td class="address-location-cell"><div class="address-location"><span>State: <strong>${escapeHtml(customer.state)}</strong></span><span>Country: <strong>${escapeHtml(customer.country)}</strong></span></div></td>
                <td class="address-location-cell"><div class="address-location"><span>State: <strong>${escapeHtml(shipping.state || customer.state)}</strong></span><span>Country: <strong>${escapeHtml(shipping.country || customer.country)}</strong></span></div></td>
              </tr>
            </table>

            <div class="spacer"></div>

            <table class="items-table">
              <colgroup>
                <col style="width: 4%;"><col style="width: 34%;"><col style="width: 9%;"><col style="width: 6%;"><col style="width: 12%;"><col style="width: 8%;"><col style="width: 8%;"><col style="width: 10%;"><col style="width: 9%;">
              </colgroup>
              <thead>
                <tr>
                  <th>#</th>
                  <th class="text-left">PRODUCT NAME - SKU</th>
                  <th>UNIT<br>PRICE<br>(Rs.)</th>
                  <th>QTY</th>
                  
                  <th>TAXABLE<br>AMOUNT<br>(Rs.)</th>
                  <th>TAX<br>RATE<br>(%)</th>
                  <th>TAX<br>TYPE</th>
                  <th>TAX<br>AMOUNT<br>(Rs.)</th>
                  <th>TOTAL<br>(Rs.)</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
              <tfoot>
                <tr class="section-heading">
                  <td colspan="3" class="text-left">TOTAL</td>
                  <td>${totalQuantity || ""}</td>
                  <td colspan="4"></td>
                  <td>${formatAmount(data?.totals?.grand_total)}</td>
                </tr>
              </tfoot>
            </table>

            <div class="spacer"></div>

            <table class="totals-table">
              <colgroup><col style="width: 50%;"><col style="width: 32%;"><col style="width: 18%;"></colgroup>
              <tr>
                <td rowspan="3"><strong>Payment Mode:</strong> ${escapeHtml(invoice.payment_mode)}</td>
                <td>Subtotal (Rs.)</td>
                <td class="text-right">${formatAmount(data?.totals?.taxable_amount)}</td>
              </tr>
              <tr><td>Total Tax (Rs.)</td><td class="text-right">${formatAmount(data?.totals?.total_tax_amount)}</td></tr>
              <tr><td>Discount (Rs.)</td><td class="text-right">(-) ${formatAmount(data?.totals?.discount)}</td></tr>
              <tr>
                <td>Total Invoice Amount in Words:<br><strong>${escapeHtml(data?.totals?.amount_in_words)}</strong></td>
                <td class="section-heading text-left">TOTAL (Rs.)</td>
                <td class="section-heading text-right">${formatAmount(data?.totals?.grand_total)}</td>
              </tr>
            </table>
            <div class="footer-note">E. &amp; O.E.</div>
            <div class="footer-signature text-right">For, ${escapeHtml(company.name)}</div>
            <div class="footer-note text-right">This is a computer generated invoice and does not require a signature</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  return (
    <Button3D
      variant="outline"
      size="sm"
      disabled={downloading}
      onClick={(event) => {
        onClick?.(event);
        handleDownload();
      }}
      className={className}
    >
      <FaDownload className="text-slate-400" />
      {downloading ? "Loading..." : buttonLabel}
    </Button3D>
  );
}
