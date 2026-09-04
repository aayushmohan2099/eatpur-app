// src/pages/User/Components/InvoiceComps/DownloadInvoice.jsx
import React, { useState } from "react";
import { getInvoiceDetails } from "../../../../api/customerApi";
import Button3D from "../ui/Button3D";
import { FaDownload } from "react-icons/fa6";

export default function DownloadInvoice({ orderId, invoiceNumber }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await getInvoiceDetails(orderId);
      const data = res.data || res;

      generatePrintableInvoice(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate invoice document.");
    } finally {
      setDownloading(false);
    }
  };

  const generatePrintableInvoice = (data) => {
    const printWindow = window.open("", "_blank");
    const baseUrl = window.location.origin;

    const htmlContent = `
      <html>
        <head>
          <title>Invoice ${data.invoice_details.invoice_number}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
            .invoice-box { 
              max-width: 800px; 
              margin: auto; 
              padding: 30px; 
              border: 1px solid #eee; 
              box-shadow: 0 0 10px rgba(0, 0, 0, .15); 
              font-size: 16px; 
              line-height: 24px; 
              color: #555; 
              /* Background image applied here */
              background-image: url('${baseUrl}/invoice/invoice_bg.png');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
            }
            table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            table td { padding: 10px; vertical-align: top; }
            table tr.top table td { padding-bottom: 20px; }
            table tr.top table td.title { font-size: 45px; line-height: 45px; color: #3A5A1C; font-weight: bold;}
            table tr.information table td { padding-bottom: 40px; }
            table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            table tr.item td { border-bottom: 1px solid #eee; }
            table tr.item.last td { border-bottom: none; }
            table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
            .text-right { text-align: right; }
            .green-text { color: #3A5A1C; }
            
            /* Forces the browser to print background images */
            @media print {
              body, .invoice-box {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">Eatpur Naturals LLP</td>
                      <td class="text-right">
                        Invoice #: <strong>${data.invoice_details.invoice_number}</strong><br>
                        Order #: ${data.invoice_details.order_id}<br>
                        Created: ${new Date(data.invoice_details.date).toLocaleDateString()}<br>
                        Status: <span class="green-text">${data.invoice_details.payment_status}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                        <strong>From:</strong><br>
                        ${data.company_info.name}<br>
                        ${data.company_info.address}<br>
                        GSTIN: ${data.company_info.gstin}
                      </td>
                      <td class="text-right">
                        <strong>Billed To:</strong><br>
                        ${data.customer_info.name}<br>
                        ${data.customer_info.address}<br>
                        Ph: ${data.customer_info.phone}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table>
              <tr class="heading">
                <td>Item</td>
                <td>Qty</td>
                <td>Unit Price</td>
                <td class="text-right">Subtotal</td>
              </tr>
              ${data.items
                .map(
                  (item) => `
                <tr class="item">
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unit_price}</td>
                  <td class="text-right">₹${item.subtotal}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
            
            <table style="margin-top: 20px;">
                <tr>
                    <td style="width: 60%"></td>
                    <td style="width: 40%">
                        <table style="border-top: 2px solid #3A5A1C; padding-top:10px;">
                            <tr>
                                <td>Taxable Amount:</td>
                                <td class="text-right">₹${data.totals.taxable_amount}</td>
                            </tr>
                            <tr>
                                <td>Tax (GST included):</td>
                                <td class="text-right">₹${data.totals.tax_amount}</td>
                            </tr>
                            <tr>
                                <td><strong>Grand Total:</strong></td>
                                <td class="text-right"><strong class="green-text" style="font-size: 20px;">₹${data.totals.grand_total}</strong></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            
            <p style="text-align: center; margin-top: 50px; font-size: 12px; color: #888;">
                This is a computer generated invoice. No signature is required.<br>
                Thank you for shopping with Eatpur Naturals!
            </p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Ensures the background image has time to load before triggering the print dialog
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
      onClick={handleDownload}
      className="text-xs"
    >
      <FaDownload className="text-slate-400" />
      {downloading ? "Loading..." : "Download"}
    </Button3D>
  );
}
