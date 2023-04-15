import React, { FC, useState, useEffect } from 'react'
import { Invoice, ProductLine } from '../data/types'
import { initialInvoice, initialProductLine } from '../data/initialData'
import EditableInput from './EditableInput'
import EditableSelect from './EditableSelect'
import EditableTextarea from './EditableTextarea'

import EditableCalendarInput from './EditableCalendarInput'
import EditableFileImage from './EditableFileImage'
import countryList from '../data/countryList'
import Document from './Document'
import Page from './Page'
import View from './View'
import Text from './Text'
import { Font } from '@react-pdf/renderer'
import Download from './DownloadPDF'
import format from 'date-fns/format'

Font.register({
  family: 'Nunito',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf' },
    { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf', fontWeight: 600 },
  ],
})

interface Props {
  data?: Invoice
  pdfMode?: boolean
  onChange?: (invoice: Invoice) => void
}

const InvoicePage: FC<Props> = ({ data, pdfMode, onChange }) => {
  const [invoice, setInvoice] = useState<Invoice>(data ? { ...data } : { ...initialInvoice })
  const [subTotal, setSubTotal] = useState<number>()
  const [saleTax, setSaleTax] = useState<number>()

  const dateFormat = 'MMM dd, yyyy'
  const invoiceDate = invoice.invoiceDate !== '' ? new Date(invoice.invoiceDate) : new Date()
  const invoiceDueDate =
    invoice.invoiceDueDate !== ''
      ? new Date(invoice.invoiceDueDate)
      : new Date(invoiceDate.valueOf())

  if (invoice.invoiceDueDate === '') {
    invoiceDueDate.setDate(invoiceDueDate.getDate() + 30)
  }

  const handleChange = (name: keyof Invoice, value: string | number) => {
    if (name !== 'productLines') {
      const newInvoice = { ...invoice }

      if (name === 'logoWidth' && typeof value === 'number') {
        newInvoice[name] = value
      } else if (name !== 'logoWidth' && typeof value === 'string') {
        newInvoice[name] = value
      }

      setInvoice(newInvoice)
    }
  }

  const handleProductLineChange = (index: number, name: keyof ProductLine, value: string) => {
    const productLines = invoice.productLines.map((productLine, i) => {
      if (i === index) {
        const newProductLine = { ...productLine }

        if (name === 'description') {
          newProductLine[name] = value
        } else {
          if (
            value[value.length - 1] === '.' ||
            (value[value.length - 1] === '0' && value.includes('.'))
          ) {
            newProductLine[name] = value
          } else {
            const n = parseFloat(value)

            newProductLine[name] = (n ? n : 0).toString()
          }
        }

        return newProductLine
      }

      return { ...productLine }
    })

    setInvoice({ ...invoice, productLines })
  }

  const handleRemove = (i: number) => {
    const productLines = invoice.productLines.filter((productLine, index) => index !== i)

    setInvoice({ ...invoice, productLines })
  }

  const handleAdd = () => {
    const productLines = [...invoice.productLines, { ...initialProductLine }]

    setInvoice({ ...invoice, productLines })
  }

  const calculateAmount = (quantity: string, rate: string) => {
    const quantityNumber = parseFloat(quantity)
    const rateNumber = parseFloat(rate)
    const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

    return amount.toFixed(2)
  }

  useEffect(() => {
    let subTotal = 0

    invoice.productLines.forEach((productLine) => {
      const quantityNumber = parseFloat(productLine.quantity)
      const rateNumber = parseFloat(productLine.rate)
      const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

      subTotal += amount
    })

    setSubTotal(subTotal)
  }, [invoice.productLines])

  useEffect(() => {
    const match = invoice.taxLabel.match(/(\d+)%/)
    const taxRate = match ? parseFloat(match[1]) : 0
    const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0

    setSaleTax(saleTax)
  }, [subTotal, invoice.taxLabel])

  useEffect(() => {
    if (onChange) {
      onChange(invoice)
    }
  }, [onChange, invoice])

  return (
    <Document pdfMode={pdfMode}>
      <Page className="invoice-wrapper" pdfMode={pdfMode}>
        {!pdfMode && <Download data={invoice} />}

        <View className="flex" pdfMode={pdfMode}>
          <View className="w-50" pdfMode={pdfMode}>
            {/* <EditableFileImage
              className="logo"
              placeholder="Your Logo"
              value={invoice.logo}
              width={invoice.logoWidth}
              pdfMode={pdfMode}
              onChangeImage={(value) => handleChange('logo', value)}
              onChangeWidth={(value) => handleChange('logoWidth', value)}
            /> */}
             <svg width="130" height="50" viewBox="0 0 173 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.69 4.75874C20.58 5.35874 21.37 6.05874 22.06 6.85874C22.75 7.65874 23.33 8.51874 23.81 9.43874C24.28 10.3687 24.64 11.3487 24.89 12.3787C25.14 13.4087 25.25 14.4487 25.22 15.4887C25.17 16.8187 24.92 18.1187 24.48 19.3887C24.04 20.6587 23.41 21.8187 22.6 22.8887C21.58 24.2187 20.34 25.2987 18.88 26.1187C17.42 26.9387 15.86 27.4587 14.22 27.6687C12.55 27.8787 10.91 27.7487 9.31 27.2987C7.7 26.8387 6.24 26.1187 4.9 25.1287V31.5487C4.9 32.2287 4.66 32.7987 4.19 33.2687C3.72 33.7387 3.14 33.9687 2.45 33.9687C1.76 33.9687 1.19 33.7387 0.71 33.2687C0.24 32.7987 0 32.2287 0 31.5487V14.9787C0 14.7687 0 14.5687 0.02 14.3687C0.03 14.1687 0.05 13.9687 0.08 13.7587C0.18 12.6887 0.44 11.6487 0.84 10.6487C1.25 9.64874 1.76 8.70874 2.37 7.84874C2.98 6.98874 3.7 6.20874 4.53 5.51874C5.35 4.82874 6.25 4.24874 7.22 3.77874C9.23 2.83874 11.35 2.45874 13.57 2.61874C15.79 2.78874 17.83 3.49874 19.69 4.74874V4.75874ZM20.33 15.6887C20.46 13.8587 20 12.2187 18.96 10.7587C18.44 9.99874 17.81 9.35874 17.06 8.83874C16.32 8.31874 15.52 7.93874 14.66 7.69874C12.89 7.19874 11.18 7.31874 9.54 8.04874C9.75 7.94874 9.96 7.84874 10.17 7.75874C10.38 7.66874 10.59 7.57874 10.8 7.50874C10.54 7.60874 10.28 7.71874 10.04 7.81874C9.79 7.91874 9.55 8.03874 9.32 8.16874C8.35 8.58874 7.52 9.20874 6.81 10.0487C5.9 11.1187 5.3 12.3487 5.03 13.7287C4.76 15.1087 4.85 16.4687 5.32 17.7987C5.69 18.7887 6.23 19.6787 6.96 20.4587C7.69 21.2387 8.55 21.8587 9.54 22.2987C10.53 22.7187 11.56 22.9287 12.63 22.9287C13.7 22.9287 14.73 22.7087 15.72 22.2587C16.14 22.0487 16.53 21.8287 16.91 21.5887C17.29 21.3587 17.65 21.0787 17.99 20.7687C18.67 20.0887 19.21 19.3087 19.63 18.4387C20.05 17.5687 20.28 16.6487 20.33 15.6787V15.6887Z" fill="#00A1D3" />
                <path d="M37.4801 2.76881C39.4901 2.42881 41.4701 2.56881 43.4101 3.19881C45.3501 3.82881 47.0501 4.86881 48.4801 6.32881C49.6501 7.49881 50.5601 8.86881 51.2001 10.4188C51.8401 11.9688 52.1501 13.5888 52.1201 15.2588C52.1201 16.5888 51.9001 17.8888 51.4701 19.1588C51.0401 20.4288 50.4301 21.5888 49.6501 22.6588C48.3701 24.3788 46.7501 25.6888 44.7901 26.5988C42.8301 27.5088 40.8001 27.8888 38.6801 27.7588C37.5801 27.6788 36.5101 27.4588 35.4701 27.0888C34.4301 26.7188 33.4501 26.2388 32.5501 25.6388C31.6501 25.0388 30.8301 24.3288 30.1001 23.5288C29.3701 22.7188 28.7601 21.8188 28.2601 20.8288C27.7901 19.8588 27.4401 18.8588 27.2201 17.8088C27.0001 16.7688 26.9101 15.7088 26.9701 14.6588C27.0201 13.5988 27.2001 12.5588 27.5001 11.5288C27.8001 10.4988 28.2401 9.52881 28.8101 8.60881C28.9901 8.26881 29.2101 7.92881 29.4801 7.58881H29.5201C30.4901 6.27881 31.6601 5.22881 33.0401 4.41881C34.4201 3.60881 35.9001 3.05881 37.4701 2.77881L37.4801 2.76881ZM45.9401 19.5688C46.4901 18.7588 46.8701 17.8888 47.1001 16.9488C47.3201 16.0088 47.3701 15.0588 47.2401 14.0888C47.0801 13.1188 46.8001 12.2788 46.3801 11.5388C45.8601 10.5988 45.1801 9.78881 44.3401 9.10881C43.5001 8.42881 42.5601 7.95881 41.5201 7.69881C40.5001 7.40881 39.4601 7.34881 38.3901 7.49881C37.3201 7.65881 36.3301 8.01881 35.4101 8.59881C34.2401 9.35881 33.3201 10.3588 32.6701 11.6188C32.0201 12.8688 31.7301 14.1988 31.8101 15.6088C31.8601 16.7088 32.1401 17.7188 32.6301 18.6588C32.7601 18.8888 32.8801 19.1388 33.0001 19.3788C33.1201 19.6288 33.2501 19.8688 33.4101 20.0988C33.1801 19.7088 32.9501 19.2988 32.7401 18.8888C33.1601 19.6488 33.6901 20.3188 34.3501 20.9088C35.0001 21.4988 35.7301 21.9688 36.5401 22.3388C37.3801 22.7088 38.2501 22.9088 39.1601 22.9488C40.0701 22.9888 40.9601 22.8688 41.8201 22.5788C42.6601 22.3188 43.4301 21.9288 44.1301 21.4088C44.8301 20.8888 45.4401 20.2688 45.9301 19.5688H45.9401Z" fill="#00A1D3" />
                <path d="M99.9899 3.25883C100.46 3.73883 100.69 4.31883 100.69 4.99883C100.69 5.67883 100.46 6.24883 99.9899 6.71883C99.5199 7.18883 98.9499 7.41883 98.2699 7.41883H91.9999V25.3188C91.9999 25.9988 91.7599 26.5688 91.2799 27.0388C90.7999 27.5088 90.2199 27.7388 89.5399 27.7388C88.8599 27.7388 88.2899 27.5088 87.8199 27.0388C87.3499 26.5688 87.1199 25.9988 87.1199 25.3188V7.42883H80.8499C80.1699 7.42883 79.5999 7.19883 79.1299 6.72883C78.6599 6.25883 78.4299 5.68883 78.4299 5.00883C78.4299 4.32883 78.6599 3.74883 79.1299 3.26883C79.5999 2.78883 80.1699 2.54883 80.8499 2.54883H98.2799C98.9599 2.54883 99.5299 2.78883 99.9999 3.26883L99.9899 3.25883Z" fill="#00A1D3" />
                <path d="M125.99 2.52881C126.67 2.52881 127.24 2.76881 127.71 3.24881C128.18 3.72881 128.41 4.30881 128.41 4.98881V15.1788C128.41 16.8988 128.08 18.5288 127.41 20.0588C126.74 21.5888 125.84 22.9188 124.71 24.0488C123.57 25.1888 122.24 26.0888 120.72 26.7488C119.19 27.4188 117.57 27.7488 115.84 27.7488C114.11 27.7488 112.45 27.4188 110.93 26.7488C109.4 26.0788 108.07 25.1788 106.94 24.0488C105.81 22.9188 104.9 21.5788 104.24 20.0588C103.57 18.5288 103.24 16.9088 103.24 15.1788V4.99881C103.24 4.31881 103.48 3.73881 103.96 3.25881C104.44 2.77881 105.02 2.53881 105.7 2.53881C106.38 2.53881 106.95 2.77881 107.42 3.25881C107.89 3.73881 108.12 4.31881 108.12 4.99881V15.1588C108.12 16.2288 108.32 17.2288 108.73 18.1488C109.13 19.0788 109.68 19.8888 110.37 20.5888C111.06 21.2888 111.88 21.8488 112.82 22.2488C113.76 22.6488 114.76 22.8588 115.84 22.8588C116.92 22.8588 117.88 22.6588 118.82 22.2488C119.76 21.8488 120.58 21.2888 121.29 20.5888C121.99 19.8888 122.55 19.0688 122.95 18.1488C123.35 17.2188 123.56 16.2288 123.56 15.1588H123.52V4.98881C123.52 4.30881 123.76 3.72881 124.24 3.24881C124.72 2.76881 125.3 2.52881 125.98 2.52881H125.99Z" fill="#00A1D3" />
                <path d="M144.93 3.2988C145.39 3.7588 145.62 4.3088 145.62 4.9588C145.62 5.6088 145.38 6.2188 144.9 6.6988C144.42 7.1788 143.84 7.4188 143.16 7.4188H142.96C141.94 7.4688 140.98 7.7088 140.08 8.1188C139.18 8.5388 138.4 9.0888 137.73 9.7788C137.06 10.4688 136.54 11.2688 136.16 12.1888C135.78 13.0988 135.59 14.0788 135.59 15.1288V25.3088C135.59 25.9888 135.35 26.5588 134.87 27.0288C134.39 27.4988 133.81 27.7288 133.13 27.7288C132.45 27.7288 131.88 27.4988 131.41 27.0288C130.94 26.5588 130.71 25.9888 130.71 25.3088V15.1388C130.71 13.4188 131.03 11.8088 131.67 10.2988C132.31 8.7988 133.18 7.4788 134.27 6.3388C135.37 5.1988 136.66 4.2988 138.15 3.6188C139.64 2.9388 141.23 2.5788 142.93 2.5188H143.28C143.93 2.5688 144.49 2.8288 144.94 3.2788L144.93 3.2988Z" fill="#00A1D3" />
                <path d="M172.79 15.1789C172.76 15.8589 172.51 16.4289 172.03 16.8989C171.55 17.3689 170.97 17.6189 170.29 17.6389H152.86C152.96 17.9489 153.11 18.2789 153.29 18.6189C153.42 18.8789 153.55 19.1289 153.68 19.3589C153.81 19.5889 153.94 19.8289 154.07 20.0589C153.94 19.8489 153.82 19.6489 153.72 19.4489C153.62 19.2489 153.51 19.0489 153.41 18.8389C153.83 19.5989 154.36 20.2789 155.02 20.8789C155.67 21.4789 156.4 21.9489 157.21 22.2889C158.07 22.6589 159.02 22.8589 160.07 22.9189H160.23C160.91 22.9189 161.48 23.1489 161.93 23.6089C162.39 24.0689 162.62 24.6289 162.62 25.3089C162.62 25.9889 162.39 26.5589 161.93 27.0289C161.47 27.4989 160.91 27.7289 160.23 27.7289H159.78C159.64 27.7289 159.5 27.7189 159.37 27.6889C158.27 27.6089 157.2 27.3889 156.16 27.0189C155.12 26.6489 154.14 26.1789 153.24 25.5889C152.34 24.9989 151.52 24.2989 150.79 23.4889C150.06 22.6789 149.45 21.7789 148.95 20.7889C147.98 18.8289 147.55 16.7589 147.64 14.5789C147.73 12.3989 148.35 10.3789 149.5 8.5289C149.6 8.3689 149.72 8.2089 149.83 8.0389C149.95 7.8689 150.07 7.7089 150.2 7.5489C151.17 6.2389 152.34 5.1789 153.72 4.3589C155.1 3.5389 156.58 2.9789 158.15 2.6989C160.16 2.3889 162.14 2.5389 164.1 3.1689C166.06 3.7989 167.74 4.8389 169.15 6.2989C170.3 7.4689 171.19 8.8089 171.83 10.2889C172.47 11.7789 172.79 13.3389 172.79 14.9889V15.1489V15.1789ZM156.07 8.5989C155.31 9.0989 154.66 9.6989 154.11 10.4189C153.56 11.1389 153.14 11.9089 152.86 12.7489H167.58C167.45 12.3589 167.27 11.9389 167.03 11.4989C166.53 10.5589 165.86 9.7589 165.01 9.0889C164.16 8.4189 163.21 7.9489 162.17 7.6589C161.15 7.3689 160.11 7.3089 159.04 7.4789C157.97 7.6489 156.98 8.0189 156.06 8.5989H156.07Z" fill="#00A1D3" />
                <path d="M72.28 3.72871C70.66 4.16871 69.03 4.26871 67.38 4.27871C65.73 4.26871 64.1 4.16871 62.48 3.72871C64.1 3.28871 65.73 3.18871 67.38 3.17871C69.03 3.18871 70.66 3.29871 72.28 3.72871Z" fill="#C8DA2B" />
                <path d="M70.28 7.05872C68.33 7.54872 66.37 7.65872 64.39 7.67872C62.41 7.66872 60.45 7.54872 58.5 7.05872C60.45 6.56872 62.41 6.44872 64.39 6.43872C66.37 6.45872 68.33 6.56872 70.28 7.05872Z" fill="#00A1D3" />
                <path d="M69.6999 10.4489C67.3199 10.9389 64.9399 11.0489 62.5399 11.0689C60.1399 11.0589 57.7499 10.9389 55.3799 10.4489C57.7499 9.94886 60.1399 9.83886 62.5399 9.82886C64.9399 9.84886 67.3299 9.95886 69.6999 10.4489Z" fill="#C8DA2B" />
                <path d="M70.2799 13.7587C68.4799 14.2487 66.6699 14.3587 64.8399 14.3787C63.0099 14.3687 61.1999 14.2487 59.3999 13.7587C61.1999 13.2687 63.0099 13.1487 64.8399 13.1387C66.6699 13.1587 68.4799 13.2687 70.2799 13.7587Z" fill="#00A1D3" />
                <path d="M72.75 16.9888C69.95 17.9188 65.76 17.9188 62.96 16.9888C65.76 16.0588 69.95 16.0588 72.75 16.9888Z" fill="#C8DA2B" />
                <path d="M73.3698 0.558756C72.1198 1.29876 70.2698 1.30876 69.0198 0.558756C70.2698 -0.191244 72.1198 -0.181244 73.3698 0.558756Z" fill="#00A1D3" />
                <path d="M64.3699 30.249C65.9899 29.809 67.6199 29.709 69.2699 29.699C70.9199 29.709 72.5499 29.809 74.1699 30.249C72.5499 30.689 70.9199 30.789 69.2699 30.799C67.6199 30.789 65.9899 30.679 64.3699 30.249Z" fill="#C8DA2B" />
                <path d="M66.3599 26.9188C68.3099 26.4288 70.2699 26.3188 72.2499 26.2988C74.2299 26.3088 76.1899 26.4288 78.1399 26.9188C76.1899 27.4088 74.2299 27.5288 72.2499 27.5388C70.2699 27.5188 68.3099 27.4088 66.3599 26.9188Z" fill="#00A1D3" />
                <path d="M66.9497 23.5289C69.3297 23.0389 71.7097 22.9289 74.1097 22.9089C76.5097 22.9189 78.8997 23.0389 81.2697 23.5289C78.8997 24.0289 76.5097 24.1389 74.1097 24.1489C71.7097 24.1289 69.3197 24.0189 66.9497 23.5289Z" fill="#C8DA2B" />
                <path d="M66.3599 20.2189C68.1599 19.7289 69.9699 19.6189 71.7999 19.5989C73.6299 19.6089 75.4399 19.7289 77.2399 20.2189C75.4399 20.7089 73.6299 20.8289 71.7999 20.8389C69.9699 20.8189 68.1599 20.7089 66.3599 20.2189Z" fill="#00A1D3" />
                <path d="M63.2798 33.4189C64.5298 32.6789 66.3798 32.6689 67.6298 33.4189C66.3798 34.1689 64.5298 34.1589 63.2798 33.4189Z" fill="#00A1D3" />
              </svg>
            {/* <EditableInput
              className="fs-20 bold"
              placeholder="Your Company"
              value={invoice.companyName}
              onChange={(value) => handleChange('companyName', value)}
              pdfMode={pdfMode}
            /> */}
            {/* <EditableInput
              placeholder="Your Name"
              value={invoice.name}
              onChange={(value) => handleChange('name', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="Company's Address"
              value={invoice.companyAddress}
              onChange={(value) => handleChange('companyAddress', value)}
              pdfMode={pdfMode}
            /> */}
            {/* <EditableInput
              placeholder="City, State Zip"
              value={invoice.companyAddress2}
              onChange={(value) => handleChange('companyAddress2', value)}
              pdfMode={pdfMode}
            />
            <EditableSelect
              options={countryList}
              value={invoice.companyCountry}
              onChange={(value) => handleChange('companyCountry', value)}
              pdfMode={pdfMode}
            /> */}
          </View>
          {/* <View className="w-50" pdfMode={pdfMode}> */}
            {/* <EditableInput
              className="fs-45 right bold"
              placeholder="Invoice"
              value={invoice.title}
              onChange={(value) => handleChange('title', value)}
              pdfMode={pdfMode}
            /> */}
          {/* </View> */}
        </View>

        <View className="flex mt-40" pdfMode={pdfMode}>
          <View className="w-55" pdfMode={pdfMode}>
            {/* <EditableInput
              className="bold dark mb-5"
              value={invoice.billTo}
              onChange={(value) => handleChange('billTo', value)}
              pdfMode={pdfMode}
            /> */}
            <h4>Bill to:</h4>
            <EditableInput
              placeholder="Patient Name"
              value={invoice.clientName}
              onChange={(value) => handleChange('clientName', value)}
              pdfMode={pdfMode}
            />
            <EditableInput
              placeholder="Patient Mobile No"
              value={invoice.clientAddress}
              onChange={(value) => handleChange('clientAddress', value)}
              pdfMode={pdfMode}
            />
            {/* <EditableInput
              placeholder="City, State Zip"
              value={invoice.clientAddress2}
              onChange={(value) => handleChange('clientAddress2', value)}
              pdfMode={pdfMode}
            />
            <EditableSelect
              options={countryList}
              value={invoice.clientCountry}
              onChange={(value) => handleChange('clientCountry', value)}
              pdfMode={pdfMode}
            /> */}
          </View>
          <View className="w-45" pdfMode={pdfMode}>
            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-40" pdfMode={pdfMode}>
                {/* <EditableInput
                  className="bold"
                  value={invoice.invoiceTitleLabel}
                  onChange={(value) => handleChange('invoiceTitleLabel', value)}
                  pdfMode={pdfMode}
                /> */}
                <h4>Invoice#</h4>
              </View>
              <View className="w-60" pdfMode={pdfMode}>
                <EditableInput
                  placeholder="INV-12"
                  value={invoice.invoiceTitle}
                  onChange={(value) => handleChange('invoiceTitle', value)}
                  pdfMode={pdfMode}
                />
              </View>
            </View>
            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-40" pdfMode={pdfMode}>
                {/* <EditableInput
                  className="bold"
                  value={invoice.invoiceDateLabel}
                  onChange={(value) => handleChange('invoiceDateLabel', value)}
                  pdfMode={pdfMode}
                /> */}
                <h4>Invoice Date:</h4>
              </View>
              <View className="w-60" pdfMode={pdfMode}>
                <EditableCalendarInput
                  value={format(invoiceDate, dateFormat)}
                  selected={invoiceDate}
                  onChange={(date) =>
                    handleChange(
                      'invoiceDate',
                      date && !Array.isArray(date) ? format(date, dateFormat) : ''
                    )
                  }
                  pdfMode={pdfMode}
                />
              </View>
            </View>
            <View className="flex mb-5" pdfMode={pdfMode}>
              <View className="w-40" pdfMode={pdfMode}>
                {/* <EditableInput
                  className="bold"
                  value={invoice.invoiceDueDateLabel}
                  onChange={(value) => handleChange('invoiceDueDateLabel', value)}
                  pdfMode={pdfMode}
                /> */}
                <h4>Due Date:</h4>
              </View>
              <View className="w-60" pdfMode={pdfMode}>
                <EditableCalendarInput
                  value={format(invoiceDueDate, dateFormat)}
                  selected={invoiceDueDate}
                  onChange={(date) =>
                    handleChange(
                      'invoiceDueDate',
                      date && !Array.isArray(date) ? format(date, dateFormat) : ''
                    )
                  }
                  pdfMode={pdfMode}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="mt-30 bg-dark flex" pdfMode={pdfMode}>
          <View className="w-48 p-4-8" pdfMode={pdfMode}>
            {/* <EditableInput
              className="white bold"
              value={invoice.productLineDescription}
              onChange={(value) => handleChange('productLineDescription', value)}
              pdfMode={pdfMode}
            /> */}
            <h4 style={{color:"white"}}>Description</h4>
          </View>
          {/* <View className="w-17 p-4-8" pdfMode={pdfMode}>
            <EditableInput
              className="white bold right"
              value={invoice.productLineQuantity}
              onChange={(value) => handleChange('productLineQuantity', value)}
              pdfMode={pdfMode}
            />
          </View> */}
          {/* <View className="w-17 p-4-8" pdfMode={pdfMode}> */}
            {/* <EditableInput
              className="white bold right"
              value={invoice.productLineQuantityRate}
              onChange={(value) => handleChange('productLineQuantityRate', value)}
              pdfMode={pdfMode}
            /> */}
            
                      {/* </View> */}
          <View className="w-18 p-4-8" pdfMode={pdfMode}>
            {/* <EditableInput
              className="white bold right"
              value={invoice.productLineQuantityAmount}
              onChange={(value) => handleChange('productLineQuantityAmount', value)}
              pdfMode={pdfMode}
            /> */}
            <h4 style={{color:"white"}}>Amount</h4>
          </View>
        </View>

        {invoice.productLines.map((productLine, i) => {
          return pdfMode && productLine.description === '' ? (
            <Text key={i}></Text>
          ) : (
            <View key={i} className="row flex" pdfMode={pdfMode}>
              <View className="w-48 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableTextarea
                  className="dark"
                  rows={2}
                  placeholder="Enter item name/description"
                  value={productLine.description}
                  onChange={(value) => handleProductLineChange(i, 'description', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark right"
                  value={productLine.quantity}
                  onChange={(value) => handleProductLineChange(i, 'quantity', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
                <EditableInput
                  className="dark right"
                  value={productLine.rate}
                  onChange={(value) => handleProductLineChange(i, 'rate', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-18 p-4-8 pb-10" pdfMode={pdfMode}>
                <Text className="dark right" pdfMode={pdfMode}>
                  {calculateAmount(productLine.quantity, productLine.rate)}
                </Text>
              </View>
              {!pdfMode && (
                <button
                  className="link row__remove"
                  aria-label="Remove Row"
                  title="Remove Row"
                  onClick={() => handleRemove(i)}
                >
                  <span className="icon icon-remove bg-red"></span>
                </button>
              )}
            </View>
          )
        })}

        <View className="flex" pdfMode={pdfMode}>
          <View className="w-50 mt-10" pdfMode={pdfMode}>
            {!pdfMode && (
              <button className="link" onClick={handleAdd}>
                <span className="icon icon-add bg-green mr-10"></span>
                Add Line Item
              </button>
            )}
          </View>
          <View className="w-50 mt-20" pdfMode={pdfMode}>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                {/* <EditableInput
                  value={invoice.subTotalLabel}
                  onChange={(value) => handleChange('subTotalLabel', value)}
                  pdfMode={pdfMode}
                /> */}
                <h4>Sub Total</h4>
              </View>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                <Text className="right bold dark" pdfMode={pdfMode}>
                  {subTotal?.toFixed(2)}
                </Text>
              </View>
            </View>
            <View className="flex" pdfMode={pdfMode}>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                {/* <EditableInput
                  value={invoice.taxLabel}
                  onChange={(value) => handleChange('taxLabel', value)}
                  pdfMode={pdfMode}
                /> */}
                <h4>Discount%</h4>
              </View>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                <Text className="right bold dark" pdfMode={pdfMode}>
                  {saleTax?.toFixed(2)}
                </Text>
              </View>
            </View>
            <View className="flex bg-gray p-5" pdfMode={pdfMode}>
              <View className="w-50 p-5" pdfMode={pdfMode}>
                <EditableInput
                  className="bold"
                  value={invoice.totalLabel}
                  onChange={(value) => handleChange('totalLabel', value)}
                  pdfMode={pdfMode}
                />
              </View>
              <View className="w-50 p-5 flex" pdfMode={pdfMode}>
                <EditableInput
                  className="dark bold right ml-30"
                  value={invoice.currency}
                  onChange={(value) => handleChange('currency', value)}
                  pdfMode={pdfMode}
                />
                <Text className="right bold dark w-auto" pdfMode={pdfMode}>
                  {(typeof subTotal !== 'undefined' && typeof saleTax !== 'undefined'
                    ? subTotal + saleTax
                    : 0
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-20" pdfMode={pdfMode}>
          <EditableInput
            className="bold w-100"
            value={invoice.notesLabel}
            onChange={(value) => handleChange('notesLabel', value)}
            pdfMode={pdfMode}
          />
          <EditableTextarea
            className="w-100"
            rows={2}
            value={invoice.notes}
            onChange={(value) => handleChange('notes', value)}
            pdfMode={pdfMode}
          />
        </View>
        <View className="mt-20" pdfMode={pdfMode}>
          <EditableInput
            className="bold w-100"
            value={invoice.termLabel}
            onChange={(value) => handleChange('termLabel', value)}
            pdfMode={pdfMode}
          />
          <EditableTextarea
            className="w-100"
            rows={2}
            value={invoice.term}
            onChange={(value) => handleChange('term', value)}
            pdfMode={pdfMode}
          />
        </View>
      </Page>
    </Document>
  )
}

export default InvoicePage
