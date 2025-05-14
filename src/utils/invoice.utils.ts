import fs from 'fs-extra';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const titleFontSize = 25;
const subTitleFontSize = 14;
const leadingFontSize = 12;
const contentFontSize = 10;
const paperSizeHeight =841.89;
const paperSizeWidth = 595.28;
const paperMargin = 30;
const lineSpacing = 15;
const bottomGap = 20; // Adjust as needed for spacing between sections

export async function createInvoice(invoice) {
  let doc = new PDFDocument({
    size: [paperSizeWidth, paperSizeHeight],
    margin: paperMargin,
  });

  const fileDir = './uploads/qr';
  const fileName = `${fileDir}/${Date.now().toString()}.png`;
  await fs.ensureDir(fileDir);
  await QRCode.toFile(fileName, 'Abhit Prints');

  generateHeader(doc, fileName, invoice, 50);
  await generateOrderInformation(doc, invoice, 180);
  await generateCompanyInformation(doc, invoice, 260);
  generateInvoiceTable(doc, invoice, 320);
  generateFooter(doc);
  await fs.unlink(fileName);
  return doc;
}

function generateHeader(doc, fileName, invoice, customerInformationTop) {
  const leftColumnX = paperMargin;
  const qrCodeSize = 100; // Size of the QR code
  const rightColumnX = paperSizeWidth - paperMargin - qrCodeSize; // Adjusted to fit the QR code and some margin

  doc
    .fillColor('#444444')
    .fontSize(titleFontSize)
    .font('Helvetica-Bold')
    .text('Invoice', { align: 'center' })
    .image(fileName, rightColumnX, customerInformationTop, {
      width: qrCodeSize,
      height: qrCodeSize,
    })
    .fontSize(subTitleFontSize)
    .font('Helvetica')
    .text(
      'Abhit Prints',
      leftColumnX,
      customerInformationTop + lineSpacing * 2,
    )
    .fontSize(leadingFontSize)
    .font('Helvetica-Bold')
    .text(
      'Shipping Address:',
      leftColumnX,
      customerInformationTop + lineSpacing * 3,
    )
    .fontSize(contentFontSize)
    .font('Helvetica-Bold')
    .text(
      invoice.shipping.name,
      leftColumnX,
      customerInformationTop + lineSpacing * 4,
    )
    .font('Helvetica')
    .text(
      invoice.shipping.address,
      leftColumnX,
      customerInformationTop + lineSpacing * 5,
    )
    .text(
      `${invoice.shipping.city}, ${invoice.shipping.state}, ${invoice.shipping.country}`,
      leftColumnX,
      customerInformationTop + lineSpacing * 6,
    )
    .moveDown(); // Add space after the section
}

async function generateOrderInformation(doc, invoice, customerInformationTop) {
  const leftColumnX = paperMargin;
  const rightColumnX = paperSizeWidth - paperMargin - 350; // Adjusted to fit the content on the right side

  // Left column text
  doc
    .fontSize(contentFontSize)
    .font('Helvetica-Bold')
    .text(
      `GST NO : ${invoice.sellerDetails.gstNo}`,
      leftColumnX,
      customerInformationTop,
    )
    .text(
      `Shipment Id: ${invoice.sellerDetails.shipmentId}`,
      leftColumnX,
      customerInformationTop + lineSpacing,
    )
    .text(
      `Order No: ${invoice.sellerDetails.orderNo}`,
      leftColumnX,
      customerInformationTop + lineSpacing * 2,
    )
    .text(
      `Place Of Supply: ${invoice.sellerDetails.placeOfSupply}`,
      leftColumnX,
      customerInformationTop + lineSpacing * 3,
    );

  // Right column text
  doc
    .fontSize(contentFontSize)
    .font('Helvetica-Bold')
    .text(
      `Invoice NO: ${invoice.sellerDetails.invoiceNo}`,
      rightColumnX,
      customerInformationTop,
      { align: 'right' },
    )
    .text(
      `Invoice Date: ${invoice.sellerDetails.invoiceDate}`,
      rightColumnX,
      customerInformationTop + lineSpacing,
      { align: 'right' },
    )
    .text(
      `Order Date: ${invoice.sellerDetails.orderDate}`,
      rightColumnX,
      customerInformationTop + lineSpacing * 2,
      { align: 'right' },
    );

  // generateHr(doc, customerInformationTop + lineSpacing * 4 + bottomGap);
}

async function generateCompanyInformation(
  doc,
  invoice,
  customerInformationTop,
) {
  const lineSpacing = 20; // Adjust line spacing as needed

  doc
    .fontSize(contentFontSize)
    .font('Helvetica')
    .text(
      `Sold By: Sold by ${invoice.sellerDetails.placeOfSupply}`,
      paperMargin,
      customerInformationTop,
    )
    .moveDown()
    .fontSize(contentFontSize)
    .font('Helvetica')
    .text(
      `Dispatched From ${invoice.sellerDetails.placeOfSupply}`,
      paperMargin,
      customerInformationTop + lineSpacing,
    )
    .moveDown();
}

function generateHr(doc, y) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(paperMargin, y)
    .lineTo(paperSizeWidth - paperMargin, y)
    .stroke();
}

function generateFooter(doc) {
  const footerText =
    'Keep shopping & enjoying benefits. This is computer generated invoice and requires no signature & stamp.';
  const footerHeight = 20; // Adjust as needed for footer height
  const footerY = doc.page.height - doc.page.margins.bottom - footerHeight;

  doc.fontSize(10).text(footerText, doc.page.margins.left, footerY, {
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'center',
  });
}

function generateInvoiceTable(doc, invoice, invoiceTableTop) {
  console.log(invoice.cgst)
  let i;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Qty',
    'Mrp',
    'Disc.',
    'Total',
  );
  generateHr(doc, invoiceTableTop + lineSpacing);
  doc.font('Helvetica');

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.idCardsStock.title,
      item.quantity,
      item.idCardsStock.price,
      item.idCardsStock.discount,
      item.idCardsStock.finalPrice,
    );

    generateHr(doc, position + 18);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableTotal(
    doc,
    subtotalPosition,
    'Sub Total',
    formatCurrency(invoice.subtotal),
  );

  const discountPosition = subtotalPosition + lineSpacing;
  generateTableTotal(doc, discountPosition, 'Discount', formatCurrency(invoice.discount));

  const walletPosition = discountPosition + lineSpacing;
  generateTableTotal(doc, walletPosition, 'IGST', invoice.igst);

  const cGSTPosition = walletPosition + lineSpacing;
  generateTableTotal(doc, cGSTPosition, 'CGST', invoice.cgst);

  const sGSTPosition = cGSTPosition + lineSpacing;
  generateTableTotal(doc, sGSTPosition, 'SGST', invoice.sgst);

  const scPosition = sGSTPosition + lineSpacing;
  generateTableTotal(
    doc,
    scPosition,
    'Shipping Charge',
    formatCurrency(invoice.shippingCharge),
  );

  const totalPosition = scPosition + lineSpacing;
  doc.font('Helvetica-Bold');
  generateTableTotal(
    doc,
    totalPosition,
    'Total Amt.',
    formatCurrency(invoice.total),
  );
  doc.font('Helvetica');

  // const paidPosition = totalPosition + lineSpacing;
  // doc.font('Helvetica-Bold');
  // generateTableTotal(
  //   doc,
  //   paidPosition,
  //   'Paid Amt.',
  //   formatCurrency(invoice.paid),
  // );
  // doc.font('Helvetica');

  // const duePosition = paidPosition + lineSpacing;
  // doc.font('Helvetica-Bold');
  // generateTableTotal(doc, duePosition, 'Due Amt.', formatCurrency(invoice.due));
  // doc.font('Helvetica');

  // const refundedPosition = duePosition + lineSpacing;
  // doc.font('Helvetica-Bold');
  // generateTableTotal(
  //   doc,
  //   refundedPosition,
  //   invoice.refunded > 0 ? 'Refund Amt.' : '',
  //   invoice.refunded > 0 ? formatCurrency(invoice.refunded) : '',
  // );
  // doc.font('Helvetica');
}

function generateTableRow(doc, y, item, qty, mrp, disc, total) {
  doc
    .fontSize(contentFontSize)
    .text(item, paperMargin, y, { width: 300, align: 'left' })
    .text(qty, paperMargin + 350, y, { width: 50, align: 'left' })
    .text(mrp, paperMargin + 400, y, { width: 50, align: 'left' })
    .text(disc, paperMargin + 450, y, { width: 50, align: 'left' })
    .text(total, paperMargin + 500, y, { width: 50, align: 'left' });
}

function generateTableTotal(doc, y, title, total) {
  doc
    .fontSize(contentFontSize)
    .text(title, 50, y, { width: 450, align: 'right' })
    .text(total, 530, y, { width: 50, align: 'left' });
}

function formatCurrency(amount) {
  return parseFloat(amount).toFixed(1);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}
