import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

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
    fontFamily: 'Helvetica',
    color: '#111',
    letterSpacing: 0,
  },
  invoiceDate: {
    fontSize: 10,
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
  },
  metaClientName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#111',
    marginBottom: 4,
  },
  metaDetail: {
    fontSize: 9,
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
    fontFamily: 'Helvetica',
  },
  tableCellMono: {
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
    borderTopWidth: 0,
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
    fontFamily: 'Helvetica-Bold',
    color: '#111',
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: '#111',
  },

  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentBlock: {
    flex: 1,
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
  },
  paymentValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
  },

  signatureBlock: {
    alignItems: 'flex-end',
    width: 140,
  },
  signatureLine: {
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 6,
    marginTop: 16,
  },
  signatureName: {
    fontSize: 9,
    color: '#555',
    textAlign: 'center',
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
  footerCol: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 7,
    color: '#bbb',
    marginBottom: 2,
  },
  footerLink: {
    fontSize: 8,
    color: '#555',
    textDecoration: 'underline',
  },
  footerRight: {
    flex: 2,
    alignItems: 'flex-end',
  },
  footerDetail: {
    fontSize: 8,
    color: '#888',
    marginBottom: 2,
  },
})

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
            <Text style={styles.invoiceDate}>{form.invoiceDate}</Text>
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
              <Text style={[styles.tableCell, styles.colDue]}>{form.dueDate}</Text>
              <Text style={[styles.tableCellMono, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCellMono, styles.colRate]}>{fmt(item.rate)}</Text>
              <Text style={[styles.tableCellMono, styles.colAmount]}>{fmt(Number(item.quantity) * Number(item.rate))}</Text>
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
          <View style={styles.paymentBlock}>
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

          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{form.companyName}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.footerLabel}>Generated by</Text>
            <Text style={styles.footerLink}>Invoice App</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerDetail}>{form.companyAddress}</Text>
            <Text style={styles.footerDetail}>{form.companyEmail}</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}