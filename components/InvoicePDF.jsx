import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: '40 48',
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
  },
  logoImg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#111',
    marginBottom: 3,
  },
  companyDetail: {
    fontSize: 9,
    color: '#999',
    marginBottom: 2,
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#111',
    letterSpacing: 2,
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    fontFamily: 'Courier',
  },
  amountLabel: {
    fontSize: 8,
    color: '#999',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#111',
    marginTop: 3,
    fontFamily: 'Courier-Bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 0,
  },
  metaBlock: {
    flex: 1,
    paddingRight: 16,
  },
  metaLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#bbb',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  metaValue: {
    fontSize: 10,
    color: '#111',
    marginBottom: 2,
    fontFamily: 'Helvetica',
  },
  metaValueMuted: {
    fontSize: 9,
    color: '#888',
    marginBottom: 1,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
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
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colRate: { flex: 2, textAlign: 'right' },
  colAmount: { flex: 2, textAlign: 'right' },
  totalsSection: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 32,
  },
  totalsInner: {
    width: 220,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
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
  totalsDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 6,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    backgroundColor: '#111',
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
  },
  grandTotalValue: {
    fontSize: 11,
    fontFamily: 'Courier-Bold',
    color: '#fff',
  },
  paymentSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#bbb',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  paymentKey: {
    fontSize: 9,
    color: '#999',
    width: 110,
  },
  paymentValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#ccc',
  },
})

export default function InvoicePDF({ form, lineItems, logo }) {
  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0)
  const vat = subtotal * 0.075
  const total = subtotal + vat

  const fmt = (n) => 'NGN ' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2 })

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <View>
            {logo && <Image src={logo} style={styles.logoImg} />}
            <Text style={styles.companyName}>{form.companyName}</Text>
            <Text style={styles.companyDetail}>{form.companyAddress}</Text>
            <Text style={styles.companyDetail}>{form.companyEmail}</Text>
          </View>
          <View style={styles.invoiceRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{form.invoiceNumber}</Text>
            <Text style={styles.amountLabel}>Amount due</Text>
            <Text style={styles.amountValue}>{fmt(total)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Invoice date</Text>
            <Text style={styles.metaValue}>{form.invoiceDate}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Due date</Text>
            <Text style={styles.metaValue}>{form.dueDate}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Billed to</Text>
            <Text style={styles.metaValue}>{form.clientName}</Text>
            <Text style={styles.metaValueMuted}>{form.clientAddress}</Text>
            <Text style={styles.metaValueMuted}>{form.clientEmail}</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
          </View>

          {lineItems.map((item, i) => (
            <View key={i} style={[styles.tableRow, i % 2 !== 0 && styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.tableCellMono, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.tableCellMono, styles.colRate]}>{fmt(item.rate)}</Text>
              <Text style={[styles.tableCellMono, styles.colAmount]}>{fmt(Number(item.quantity) * Number(item.rate))}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalsInner}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{fmt(subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>VAT (7.5%)</Text>
              <Text style={styles.totalsValue}>{fmt(vat)}</Text>
            </View>
            <View style={styles.totalsDivider} />
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total due</Text>
              <Text style={styles.grandTotalValue}>{fmt(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment details</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Account name</Text>
            <Text style={styles.paymentValue}>{form.accountName}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Account number</Text>
            <Text style={styles.paymentValue}>{form.accountNumber}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Bank</Text>
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