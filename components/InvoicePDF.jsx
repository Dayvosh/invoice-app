import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

Font.register({
  family: 'GeistMono',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/geistmono/v1/or3NQ6H71RcLxj_yFp_R0A.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/geistmono/v1/or3NQ6H71RcLxj_yFp_R0A.woff2', fontWeight: 700 },
  ]
})

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 44,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    fontSize: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  logoBox: {
    backgroundColor: '#2e7d32',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  logoImg: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  logoText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  invoiceTitleBlock: {
    alignItems: 'flex-end',
  },
  invoiceWord: {
    fontSize: 30,
    fontFamily: 'Courier',
    color: '#111',
  },
  invoiceDate: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: '#888',
    marginTop: 4,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  metaLeft: {
    flex: 1,
  },
  metaRight: {
    alignItems: 'flex-end',
  },
  metaSmallLabel: {
    fontSize: 8,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  metaClientName: {
    fontSize: 14,
    fontFamily: 'Courier-Bold',
    color: '#111',
    marginBottom: 4,
  },
  metaDetail: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: '#666',
    marginBottom: 2,
  },
  metaInvoiceNumber: {
    fontSize: 13,
    fontFamily: 'Courier-Bold',
    color: '#111',
    marginBottom: 12,
  },
  metaAmountLabel: {
    fontSize: 8,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  metaAmount: {
    fontSize: 20,
    fontFamily: 'Courier-Bold',
    color: '#111',
  },
  tableContainer: {
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Courier',
  },
  colDesc: { flex: 3 },
  colDue: { flex: 2 },
  colQty: { flex: 1, textAlign: 'center' },
  colRate: { flex: 2, textAlign: 'right' },
  colAmount: { flex: 2, textAlign: 'right' },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 0,
    marginBottom: 32,
  },
  totalsTable: {
    width: 220,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalsLabel: {
    fontSize: 10,
    color: '#888',
    fontFamily: 'Courier',
  },
  totalsValue: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Courier',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: 'Courier-Bold',
    color: '#111',
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: '#111',
  },
  bottomSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  paymentKey: {
    fontSize: 9,
    color: '#888',
    width: 100,
    fontFamily: 'Courier',
  },
  paymentValue: {
    fontSize: 9,
    fontFamily: 'Courier-Bold',
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#bbb',
    fontFamily: 'Courier',
  },
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function InvoicePDF({ form, lineItems, logo, applyVat, vatRate }) {
  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0)
  const vatAmount = applyVat ? subtotal * (Number(vatRate) / 100) : 0
  const total = subtotal + vatAmount

  const fmt = (n) => 'NGN ' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2 })

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.headerRow}>
          <View>
            {logo ? (
              <Image src={logo} style={styles.logoImg} />
            ) : (
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>{(form.companyName || 'COMPANY').toUpperCase()}</Text>
              </View>
            )}
          </View>
          <View style={styles.invoiceTitleBlock}>
            <Text style={styles.invoiceWord}>Invoice</Text>
            <Text style={styles.invoiceDate}>{formatDate(form.invoiceDate)}</Text>
          </View>
        </View>

        <View style={styles.metaSection}>
          <View style={styles.metaLeft}>
            <Text style={styles.metaSmallLabel}>Invoice to</Text>
            <Text style={styles.metaClientName}>{form.clientName}</Text>
            <Text style={styles.metaDetail}>{form.clientAddress}</Text>
            <Text style={styles.metaDetail}>{form.clientEmail}</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.metaSmallLabel}>Invoice number</Text>
            <Text style={styles.metaInvoiceNumber}>{form.invoiceNumber}</Text>
            <Text style={styles.metaAmountLabel}>Amount to pay</Text>
            <Text style={styles.metaAmount}>{fmt(total)}</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Item & description</Text>
            <Text style={[styles.tableHeaderText, styles.colDue]}>Due date</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
          </View>

          {lineItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.colDue]}>{formatDate(form.dueDate)}</Text>
              <Text style={[styles.tableCell, styles.colQty, {textAlign:'center'}]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.colRate, {textAlign:'right'}]}>{fmt(item.rate)}</Text>
              <Text style={[styles.tableCell, styles.colAmount, {textAlign:'right'}]}>{fmt(Number(item.quantity) * Number(item.rate))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{fmt(subtotal)}</Text>
            </View>
            {applyVat && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>VAT ({vatRate}%)</Text>
                <Text style={styles.totalsValue}>{fmt(vatAmount)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{fmt(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.paymentTitle}>Payment details</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Account Name</Text>
            <Text style={styles.paymentValue}>{form.accountName}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Account Number</Text>
            <Text style={styles.paymentValue}>{form.accountNumber}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Bank Name</Text>
            <Text style={styles.paymentValue}>{form.bankName}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{form.companyName}</Text>
          <Text style={styles.footerText}>Generated by Invoice App</Text>
        </View>

      </Page>
    </Document>
  )
}