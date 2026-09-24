// src/pages/Admin/Admin/OrderComps/createPrintLabel.jsx

export const createPrintLabel = (label) => {
  const printWindow = window.open("", "_blank", "width=900,height=1200");

  if (!printWindow) {
    alert("Please allow pop-ups to print the shipping label.");
    return;
  }

  const trackingNumber =
    label.wbn || label.swiftId || (label.wbns && label.wbns[0]) || "";

  const consigneeAddress = [
    label.consigneeAddress,
    label.consigneeCity,
    label.consigneeState,
    label.consigneePincode,
  ]
    .filter(Boolean)
    .join(", ");

  const returnAddress = [
    label.returnAddress,
    label.returnCity,
    label.returnState,
    label.returnPincode,
  ]
    .filter(Boolean)
    .join(", ");

  /*
   * CODE-128 barcode using an online-free SVG representation.
   * The barcode is generated from the tracking number.
   */
  const code128Patterns = [
    "212222",
    "222122",
    "222221",
    "121223",
    "121322",
    "131222",
    "122213",
    "122312",
    "132212",
    "221213",
    "221312",
    "231212",
    "112232",
    "122132",
    "122231",
    "113222",
    "123122",
    "123221",
    "223211",
    "221132",
    "221231",
    "213212",
    "223112",
    "312131",
    "311222",
    "321122",
    "321221",
    "312212",
    "322112",
    "322211",
    "212123",
    "212321",
    "232121",
    "111323",
    "131123",
    "131321",
    "112313",
    "132113",
    "132311",
    "211313",
    "231113",
    "231311",
    "112133",
    "112331",
    "132131",
    "113123",
    "113321",
    "133121",
    "313121",
    "211331",
    "231131",
    "213113",
    "213311",
    "213131",
    "311123",
    "311321",
    "331121",
    "312113",
    "312311",
    "332111",
    "314111",
    "221411",
    "431111",
    "111224",
    "111422",
    "121124",
    "121421",
    "141122",
    "141221",
    "112214",
    "112412",
    "122114",
    "122411",
    "142112",
    "142211",
    "241211",
    "221114",
    "413111",
    "241112",
    "134111",
    "111242",
    "121142",
    "121241",
    "114212",
    "124112",
    "124211",
    "411212",
    "421112",
    "421211",
    "212141",
    "214121",
    "412121",
    "111143",
    "111341",
    "131141",
    "114113",
    "114311",
    "411113",
    "411311",
    "113141",
    "114131",
    "311141",
    "411131",
    "211412",
    "211214",
    "211232",
    "2331112",
  ];

  const code128B = {};

  for (let i = 0; i < 96; i++) {
    code128B[String.fromCharCode(32 + i)] = i;
  }

  const createBarcodeSVG = (value) => {
    if (!value) return "";

    let checksum = 104;
    let encoded = [104];

    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);

      if (charCode < 32 || charCode > 127) continue;

      const code = code128B[String.fromCharCode(charCode)];
      encoded.push(code);
      checksum += code * i;
    }

    checksum %= 103;
    encoded.push(checksum);
    encoded.push(106);

    const moduleWidth = 2;
    const height = 80;

    let x = 10;
    let bars = "";

    encoded.forEach((code) => {
      const pattern = code128Patterns[code];

      let black = true;

      for (let i = 0; i < pattern.length; i++) {
        const width = parseInt(pattern[i], 10) * moduleWidth;

        if (black) {
          bars += `<rect x="${x}" y="0" width="${width}" height="${height}" />`;
        }

        x += width;
        black = !black;
      }
    });

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${x + 10} ${height}"
        width="100%"
        height="95"
        preserveAspectRatio="none"
      >
        <rect width="100%" height="100%" fill="white"/>
        <g fill="black">
          ${bars}
        </g>
      </svg>
    `;
  };

  const barcodeSVG = createBarcodeSVG(trackingNumber);

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shipping Label - ${label.orderNumber || trackingNumber}</title>
        <style>
          @page {
            size: 100mm 150mm;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
          }

          body {
            width: 100mm;
            min-height: 150mm;
          }

          .label {
            width: 100mm;
            min-height: 150mm;
            padding: 5mm;
            background: white;
          }

          .top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1.5px solid #111;
            padding-bottom: 3mm;
          }

          .brand {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #173f2a;
          }

          .vendor {
            font-size: 9px;
            margin-top: 1mm;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: .8px;
          }

          .payment {
            border: 1px solid #111;
            padding: 2mm 3mm;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .section {
            padding: 3mm 0;
            border-bottom: 1px solid #d1d5db;
          }

          .section-title {
            font-size: 8px;
            font-weight: 800;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 1.5mm;
          }

          .name {
            font-size: 15px;
            font-weight: 800;
            margin-bottom: 1mm;
          }

          .phone {
            font-size: 10px;
            font-weight: 700;
            margin-bottom: 1.5mm;
          }

          .address {
            font-size: 10px;
            line-height: 1.45;
          }

          .tracking {
            text-align: center;
            padding: 3mm 0 2mm;
          }

          .tracking-label {
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #6b7280;
            text-transform: uppercase;
          }

          .tracking-number {
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 1.5px;
            margin-top: 1mm;
          }

          .barcode {
            width: 100%;
            margin-top: 2mm;
          }

          .barcode-number {
            font-family: monospace;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-top: 1mm;
          }

          .details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 1px solid #111;
            border-left: 1px solid #111;
          }

          .detail {
            padding: 2mm;
            border-right: 1px solid #111;
            border-bottom: 1px solid #111;
          }

          .detail-label {
            font-size: 7px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 800;
          }

          .detail-value {
            font-size: 9px;
            font-weight: 800;
            margin-top: 1mm;
          }

          .return {
            font-size: 8px;
            line-height: 1.4;
            color: #4b5563;
          }

          .footer {
            text-align: center;
            padding-top: 3mm;
            font-size: 7px;
            color: #9ca3af;
          }

          @media print {
            html,
            body {
              width: 100mm;
              height: 150mm;
            }

            .label {
              page-break-after: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="top">
            <div>
              <div class="brand">EATPUR Naturals LLP</div>
              <div class="vendor">Fuel Your Body Naturally</div>
            </div>
            <div class="payment">
              ${label.paymentMode || "PREPAID"}
            </div>
          </div>
          <div class="section">
            <div class="section-title">Ship To</div>
            <div class="name">${label.consigneeName || ""}</div>
            <div class="phone">${label.consigneePhone || ""}</div>
            <div class="address">${consigneeAddress}</div>
          </div>
          <div class="tracking">
            <div class="tracking-label">Tracking / AWB</div>
            <div class="tracking-number">${trackingNumber}</div>
            <div class="barcode">${barcodeSVG}</div>
            <div class="barcode-number">${trackingNumber}</div>
          </div>
          <div class="details">
            <div class="detail">
              <div class="detail-label">Order</div>
              <div class="detail-value">${label.orderNumber || "-"}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Invoice</div>
              <div class="detail-value">${label.invoiceNumber || "-"}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Amount</div>
              <div class="detail-value">₹${label.totalAmount || "0.00"}</div>
            </div>
            <div class="detail">
              <div class="detail-label">Courier</div>
              <div class="detail-value">${label.vendor || "EKART"}</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Return Address</div>
            <div class="return">
              ${returnAddress}<br />
              ${label.returnPhone || ""}
            </div>
          </div>
          <div class="footer">Thank you for choosing EATPUR!</div>
        </div>
        <script>
          window.onload = function () {
            setTimeout(function () {
              window.print();
              setTimeout(function () {
                window.close();
              }, 500);
            }, 300);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};
