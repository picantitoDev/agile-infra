const express = require("express")
const router = express.Router()
const controladorMovimientos = require("../controllers/controladorMovimientos")
const PDFLib = require("pdf-lib")
const fs = require("fs")

// Ruta para obtener todos los movimientos
router.get("/", controladorMovimientos.obtenerMovimientos)
router.get("/detalle/:id", controladorMovimientos.verDetalleMovimiento)
router.get("/registrar-venta", controladorMovimientos.registrarVentaGet)
router.post("/registrar-venta", controladorMovimientos.registrarVentaPost)
router.get("/registrar-entrada", controladorMovimientos.registrarEntradaGet)
router.post("/registrar-entrada", controladorMovimientos.registrarEntradaPost)
router.get("/registrar-sobrante", controladorMovimientos.registrarSobranteGet)
router.post("/registrar-sobrante", controladorMovimientos.registrarSobrantePost)
router.get("/registrar-merma", controladorMovimientos.registrarMermaGet)
router.post("/registrar-merma", controladorMovimientos.registrarMermaPost)
router.get("/detalle/:id/comprobante", async (req, res) => {
  const { PDFDocument, rgb, StandardFonts } = PDFLib

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width, height } = page.getSize()

  // Load fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Colors
  const blueColor = rgb(0, 0.2, 0.6)
  const blackColor = rgb(0, 0, 0)

  // Logo (Blue Square Placeholder)
  const pngImageBytes = fs.readFileSync("public/stockLogo.png")
  const pngImage = await pdfDoc.embedPng(pngImageBytes)
  const pngDims = pngImage.scale(0.5) // Scale to 50% of original size, adjust as needed

  // Draw the image
  page.drawImage(pngImage, {
    x: 40,
    y: height - 100, // Adjust y-coordinate to account for image height
    width: pngDims.width,
    height: pngDims.height,
  })

  // Stock Cloud Title
  page.drawText("STOCK CLOUD", {
    x: 135,
    y: height - 60,
    size: 18,
    font: fontBold,
    color: blueColor,
  })

  // Subtitle
  page.drawText("Teléfono 976167251 Trujillo-Perú", {
    x: 135,
    y: height - 80,
    size: 10,
    font,
  })

  page.drawText("Av. América Sur 1910, Trujillo 13006", {
    x: 135,
    y: height - 95,
    size: 10,
    font,
  })

  const rectX = width - 250 // Left position of the rectangle
  const rectY = height - 100 // Top position of the rectangle
  const rectWidth = 210 // Width of the rectangle
  const rectHeight = 80 // Height of the rectangle

  // Calculate the horizontal center position of the rectangle
  const centerX = rectX + rectWidth / 2

  // Adjust the vertical spacing (reduce the line height)
  const lineHeight = rectHeight / 3.5 // Decreased the spacing to bring the text closer

  // Padding at the top of the rectangle
  const paddingTop = 5 // Adjust this value for more or less padding

  // Draw the rectangle (Boleta Box)
  page.drawRectangle({
    x: rectX,
    y: rectY,
    width: rectWidth,
    height: rectHeight,
    borderColor: blackColor,
    borderWidth: 1,
  })

  const texts = [
    "R.U.C. No. 132345423345",
    "BOLETA DE VENTA ELECTRONICA",
    "B012-04883929",
  ]

  // Draw each line of text, centered horizontally and evenly spaced vertically
  texts.forEach((text, index) => {
    const textWidth = fontBold.widthOfTextAtSize(text, 10) // Calculate text width for centering
    const xPos = centerX - textWidth / 2 // Center the text horizontally
    const yPos =
      rectY +
      rectHeight -
      (index + 1) * lineHeight +
      lineHeight / 2 +
      paddingTop // Evenly space the text vertically with top padding

    page.drawText(text, {
      x: xPos,
      y: yPos - 11.5,
      size: 10,
      font: fontBold,
    })
  })

  // Customer Data
  const customerInfo = [
    { label: "SEÑOR(ES):", value: "Juan Pérez López" },
    { label: "DNI:", value: "87654321" },
    { label: "FECHA EMISIÓN:", value: "25/04/2023" },
    { label: "DIRECCIÓN:", value: "Av. Los Jardines 123, Trujillo" },
    { label: "TIPO MONEDA:", value: "PEN" },
  ]

  let startY = height - 140
  customerInfo.forEach((item) => {
    page.drawText(item.label, { x: 50, y: startY, size: 10, font: fontBold })
    page.drawText(item.value, { x: 150, y: startY, size: 10, font })
    startY -= 20
  })

  // Table Headers
  const tableStartY = startY - 30
  const colX = [50, 120, 280, 360, 470]

  const headers = [
    "CODIGO",
    "DESCRIPCION",
    "CANTIDAD",
    "PRECIO UNITARIO",
    "PRECIO VENTA",
  ]

  // Blue background for the header with white text
  page.drawRectangle({
    x: colX[0] - 5, // Adding padding to the left
    y: tableStartY - 5, // Adding padding to the top
    width: colX[colX.length - 1] + 35, // Adding padding to the right
    height: 20, // Height of the header
    color: rgb(0.11764705882, 0.16470588235, 0.52549019607), // Blue color
    borderColor: rgb(0, 0, 0), // Black border
    borderWidth: 0.5, // Thin border (0.5 points)
  })

  for (let i = 0; i < colX.length; i++) {
    // Skip the first column's left border as it's already part of the rectangle
    if (i > 0) {
      page.drawLine({
        start: { x: colX[i] - 5, y: tableStartY - 5 },
        end: { x: colX[i] - 5, y: tableStartY + 15 }, // 20px height
        thickness: 0.5,
        color: rgb(0, 0, 0), // Black line
      })
    }
  }

  headers.forEach((text, i) => {
    let xPosition = colX[i]

    // For columns 3, 4, and 5 (indices 2, 3, 4), move text to the right
    if (i === 2) {
      xPosition = colX[i] + 7 // Add 15 points to move right
    }

    page.drawText(text, {
      x: xPosition,
      y: tableStartY,
      size: 10,
      font: fontBold,
      color: rgb(1, 1, 1), // White text color
      borderColor: rgb(0, 0, 0), // Black border
      borderWidth: 0.5, // Thin border (0.5 points)
    })
  })

  // Table Rows
  const products = [
    ["PROD001", "Laptop HP 15-dw1024la", "1", "S/ 2499.00", "S/ 2499.00"],
    ["PROD002", "Mouse Inalámbrico Logitech", "2", "S/ 89.90", "S/ 179.80"],
    ["PROD003", "Teclado Mecánico RGB", "1", "S/ 199.00", "S/ 199.00"],
    [, , , "TOTAL", "S/ 2877.80"],
  ]

  // Loop through each product and add to the table
  let rowY = tableStartY - 20
  products.forEach((row, rowIndex) => {
    // If it's the last row, add a yellow background with black text
    if (rowIndex === products.length - 1) {
      page.drawRectangle({
        x: colX[0] - 5, // Adding padding to the left
        y: rowY - 5, // Adding padding to the top
        width: colX[colX.length - 1] + 35, // Adding padding to the right
        height: 20, // Height of the row
        color: rgb(0.99607843137, 0.94509803921, 0.81960784313), // Yellow background for the last row
        borderColor: rgb(0, 0, 0), // Black border
        borderWidth: 0.5, // Thin border (0.5 points)
      })
      row.forEach((cell, i) => {
        page.drawText(cell, {
          x: colX[i],
          y: rowY,
          size: 10,
          font: fontBold,
          color: rgb(0, 0, 0), // Black text for the total row
          borderColor: rgb(0, 0, 0), // Black border
          borderWidth: 0.5, // Thin border (0.5 points)
        })
      })
      for (let i = 0; i < colX.length; i++) {
        if (i === colX.length - 1) {
          page.drawLine({
            start: { x: colX[i] - 5, y: rowY - 5 },
            end: { x: colX[i] - 5, y: rowY + 15 }, // 20px height
            thickness: 0.5,
            color: rgb(0, 0, 0), // Black line
          })
        }
      }
    } else {
      // Default white background for other rows
      page.drawRectangle({
        x: colX[0] - 5, // Adding padding to the left
        y: rowY - 5, // Adding padding to the top
        width: colX[colX.length - 1] + 35, // Adding padding to the right
        height: 20, // Height of the row
        color: rgb(1, 1, 1), // White background for other rows
        borderColor: rgb(0, 0, 0), // Black border
        borderWidth: 0.5, // Thin border (0.5 points)
      })
      row.forEach((cell, i) => {
        let xPosition = colX[i]

        if (i === 2) {
          xPosition = colX[i] + 35 // Add 15 points to move right
        }

        if (i > 2) {
          xPosition = colX[i] + 15
        }

        page.drawText(cell, {
          x: xPosition,
          y: rowY,
          size: 10,
          font: font,
          color: rgb(0, 0, 0), // Black text for other rows
        })
      })

      // Draw vertical lines for regular rows
      for (let i = 0; i < colX.length; i++) {
        if (i > 0) {
          page.drawLine({
            start: { x: colX[i] - 5, y: rowY - 5 },
            end: { x: colX[i] - 5, y: rowY + 15 }, // 20px height
            thickness: 0.2,
            color: rgb(0, 0, 0), // Black line
          })
        }
      }
    }
    rowY -= 20
  })

  // Total

  // Amount in Words
  page.drawText("Son : DOS MIL OCHOCIENTOS SETENTA Y SIETE CON 80/100 SOLES", {
    x: 50,
    y: rowY - 40,
    size: 10,
    font: fontBold,
  })

  // Footer Values
  const footerInfo = [
    "Total Valor de Venta - Operaciones Gravadas: S/ 0.00",
    "Total Valor de Venta - Operaciones Inafecta: S/ 2877.80",
    "IGV: S/ 0.00",
    "Importe Total: S/ 2877.80",
  ]

  let footerY = rowY - 80
  footerInfo.forEach((text, i) => {
    const textWidth = font.widthOfTextAtSize(text, 10) // Calculate text width for right alignment
    let xPos = 540 - textWidth // Default to 20px padding from the right edge of the page

    // If it's the third line (i === 2), move the text a bit to the right
    if (i === 2) {
      xPos += 4 // Adjust the horizontal position (move to the right by 10px)
    }

    page.drawText(text, {
      x: xPos - 2,
      y: footerY,
      size: 10,
      font: i === 3 ? fontBold : font, // Bold the last line
    })
    footerY -= 20
  })

  // Serialize PDF
  const pdfBytes = await pdfDoc.save()

  // Set headers
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"')

  // Send PDF
  res.send(Buffer.from(pdfBytes))
})
module.exports = router
