const PDFLib = require("pdf-lib")
const fs = require("fs")

async function generarComprobantePDF(data) {
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
  const lh = rectHeight / 3.5 // Decreased the spacing to bring the text closer

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

  const prefijo = data[0].tipo_comprobante === "boleta" ? "B" : "F"
  const tipoComprobante =
    data[0].tipo_comprobante === "boleta" ? "BOLETA" : "FACTURA"

  const texts = [
    "R.U.C. No. 132345423345",
    `${tipoComprobante} DE VENTA ELECTRONICA`,
    `${prefijo}012-04883929`,
  ]

  // Draw each line of text, centered horizontally and evenly spaced vertically
  texts.forEach((text, index) => {
    const textWidth = fontBold.widthOfTextAtSize(text, 10) // Calculate text width for centering
    const xPos = centerX - textWidth / 2 // Center the text horizontally
    const yPos = rectY + rectHeight - (index + 1) * lh + lh / 2 + paddingTop // Evenly space the text vertically with top padding

    page.drawText(text, {
      x: xPos,
      y: yPos - 11.5,
      size: 10,
      font: fontBold,
    })
  })

  // Data formateada

  const clientePlaceholder =
    data[0].tipo_comprobante === "boleta" ? "SEÑOR(ES):" : "RAZÓN SOCIAL:"

  const documentoPlaceholder =
    data[0].tipo_comprobante === "boleta" ? "DNI:" : "RUC:"

  const cliente =
    data[0].tipo_comprobante === "boleta"
      ? data[0].nombre_cliente
      : data[0].razon_social

  const documento =
    data[0].tipo_comprobante === "boleta"
      ? data[0].dni_cliente
      : data[0].ruc_cliente

  const isoDate = data[0].fecha
  const date = new Date(isoDate)

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // los meses van de 0 a 11
  const year = date.getFullYear()

  const fechaFormateada = `${day}/${month}/${year}`

  const direccion = data[0].direccion_cliente
  // Customer Data
  const customerInfo = [
    { label: `${clientePlaceholder}`, value: `${cliente}` },
    { label: `${documentoPlaceholder}`, value: `${documento}` },
    { label: "FECHA EMISIÓN:", value: `${fechaFormateada}` },
    { label: "DIRECCIÓN:", value: `${direccion}` },
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
  const products = data.map((item, index) => [
    `PROD${String(item.id_producto).padStart(3, "0")}`,
    item.producto,
    item.cantidad.toString(),
    `S/ ${parseFloat(item.precio_unitario).toFixed(2)}`,
    `S/ ${parseFloat(item.subtotal).toFixed(2)}`,
  ])

  const total = data.reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
  products.push(["", "", "", "TOTAL", `S/ ${total.toFixed(2)}`])

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
      // Fila de producto
      const descriptionIndex = 1 // Assuming description is in column index 1
      const maxWidth = 155 // Max width for description column
      const lineHeight = 12 // Height per text line
      const baseRowHeight = 20 // Base row height
      const padding = 5 // Padding for borders

      // Calculate needed height for this row
      let rowHeight = baseRowHeight
      const lines = wrapText(row[descriptionIndex], maxWidth, font, 10)
      if (row[descriptionIndex]) {
        if (lines.length > 1) {
          rowHeight = baseRowHeight + (lines.length - 1) * lineHeight
        }
      }

      let bonus = 0
      if (lines.length > 1) {
        bonus = lines.length * 5 + 1.5
      }

      // Draw rectangle with dynamic height
      page.drawRectangle({
        x: colX[0] - padding,
        y: rowY - padding - bonus,
        width: colX[colX.length - 1] + 35,
        height: rowHeight,
        color: rgb(1, 1, 1),
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5,
      })

      // Escritura de campos
      row.forEach((cell, i) => {
        let xPosition = colX[i]
        if (i === 2) xPosition = colX[i] + 35
        if (i > 2) xPosition = colX[i] + 15

        if (i === descriptionIndex) {
          // Handle multi-line description
          const lines = wrapText(cell, maxWidth, font, 10)
          lines.forEach((line, lineIndex) => {
            page.drawText(line, {
              x: xPosition,
              y: rowY - lineIndex * lineHeight,
              size: 10,
              font: font,
              color: rgb(0, 0, 0),
            })
          })
        } else {
          // Regular single-line cells
          page.drawText(cell, {
            x: xPosition,
            y: rowY,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          })
        }
      })

      let linePlus = 0
      if (lines.length > 1) {
        linePlus = lines.length * 20
      }

      // Lineas verticales with dynamic height
      for (let i = 0; i < colX.length; i++) {
        if (i > 0) {
          page.drawLine({
            start: {
              x: colX[i] - padding,
              y: rowY + rowHeight - padding,
            }, // Top of line
            end: { x: colX[i] - padding, y: rowY - padding - 2 * bonus }, // Bottom of line
            thickness: 0.2,
            color: rgb(0, 0, 0),
          })
        }
      }

      rowY -= rowHeight
    }
  })

  // Amount in Words
  const textoNatural = numberToText(total)
  const str = "Son : " + textoNatural.toUpperCase() + " SOLES"
  page.drawText(str, {
    x: 50,
    y: rowY - 40,
    size: 10,
    font: fontBold,
  })

  // Footer Values
  const footerInfo = [
    "Total Valor de Venta - Operaciones Gravadas: S/ 0.00",
    `Total Valor de Venta - Operaciones Inafecta: S/ ${total.toFixed(2)}`,
    "IGV: S/ 0.00",
    `Importe Total: S/ ${total.toFixed(2)}`,
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
  return pdfBytes
}

function wrapText(text, maxWidth, font, fontSize) {
  const words = text.split(" ")
  const lines = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = font.widthOfTextAtSize(currentLine + " " + word, fontSize)
    if (width < maxWidth) {
      currentLine += " " + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

function numberToText(number) {
  const units = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ]

  const teens = [
    "",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ]

  const tens = [
    "",
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ]

  const hundreds = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ]

  const numToString = (num) => {
    if (num === 0) return "cero"
    if (num < 10) return units[num]
    if (num < 20) return teens[num - 10]

    // Casos especiales para números entre 21-29
    if (num < 30 && num > 20) {
      return "veinti" + units[num % 10]
    }

    if (num < 100) {
      const decena = tens[Math.floor(num / 10)]
      const unidad = num % 10
      return decena + (unidad !== 0 ? " y " + units[unidad] : "")
    }

    if (num < 1000) {
      if (num === 100) return "cien"
      const centena = hundreds[Math.floor(num / 100)]
      const resto = num % 100
      return centena + (resto !== 0 ? " " + numToString(resto) : "")
    }

    if (num < 1000000) {
      const miles = Math.floor(num / 1000)
      const resto = num % 1000
      let milesText = ""

      if (miles === 1) {
        milesText = "mil"
      } else {
        milesText = numToString(miles) + " mil"
      }

      return milesText + (resto !== 0 ? " " + numToString(resto) : "")
    }

    return "Número demasiado grande"
  }

  // Manejo de decimales
  const formatDecimalPart = (decimalPart) => {
    // Convertimos a string y tomamos los primeros 2 dígitos
    const decimalStr = decimalPart.toString().padEnd(2, "0").substring(0, 2)
    const decimalNum = parseInt(decimalStr)

    if (decimalNum === 0) return ""

    // Si el número decimal es menor que 10, lo tratamos como un solo dígito
    if (decimalNum < 10) {
      return ` con ${decimalStr}/100`
    }

    return ` con ${decimalNum}/100`
  }

  // Separamos parte entera y decimal
  const integerPart = Math.floor(number)
  const decimalPart = Math.round((number - integerPart) * 100) // Obtenemos centavos

  const integerText = numToString(integerPart)
  const decimalText = decimalPart > 0 ? formatDecimalPart(decimalPart) : ""

  // Convertimos "uno" a "un" cuando es parte de miles (para casos como 1,000)
  const finalText = integerText.replace(/^uno mil/, "un mil") + decimalText

  return finalText.charAt(0).toUpperCase() + finalText.slice(1) // Capitalizamos la primera letra
}

module.exports = {
  generarComprobantePDF,
}
