'use client'
import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import InvoicePDF from '../components/InvoicePDF'

export default function Home() {
  const [screen, setScreen] = useState('form')
  const [form, setForm] = useState({
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
  })

  const [lineItems, setLineItems] = useState([
    { description: '', quantity: '', rate: '' }
  ])

  const [logo, setLogo] = useState<string | null>(null)
  const [applyVat, setApplyVat] = useState(false)
  const [vatRate, setVatRate] = useState('7.5')

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const updateLineItem = (index: number, field: string, value: string) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: '', rate: '' }])
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setLogo(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0)
  const vatAmount = applyVat ? subtotal * (Number(vatRate) / 100) : 0
  const total = subtotal + vatAmount

  const fmt = (n: number) => 'NGN ' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2 })

  if (screen === 'preview') {
    return (
      <>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #f0f0ee; }
          .preview-wrap { max-width: 680px; margin: 0 auto; padding: 40px 20px 100px; letter-spacing: -0.03em; }
          .preview-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
          .preview-title { font-size: 14px; font-weight: 600; color: #111; }
          .preview-sub { font-size: 12px; color: #aaa; margin-top: 2px; }
          .back-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: #fff; border: 1px solid #ebebeb; border-radius: 10px; cursor: pointer; color: #555; font-size: 13px; font-weight: 500; font-family: inherit; transition: all .15s; letter-spacing: -.01em; text-decoration: none; }
          .back-btn:hover { border-color: #111; color: #111; }
          .invoice-card { background: #fff; border-radius: 20px; padding: 40px; border: 1px solid #ebebeb; margin-bottom: 12px; }
          .inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
          .inv-logo { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; margin-bottom: 12px; display: block; }
          .inv-company-name { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 4px; }
          .inv-company-detail { font-size: 12px; color: #aaa; margin-bottom: 2px; }
          .inv-right { text-align: right; }
          .inv-title { font-size: 26px; font-weight: 600; color: #111; letter-spacing: -.03em; margin-bottom: 4px; }
          .inv-number { font-size: 12px; color: #aaa; margin-bottom: 16px; }
          .inv-amount-label { font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
          .inv-amount { font-size: 22px; font-weight: 600; color: #111; letter-spacing: -.03em; }
          .inv-divider { border: none; border-top: 1px solid #f0f0f0; margin: 0 0 24px; }
          .inv-meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 28px; }
          .inv-meta-label { font-size: 10px; font-weight: 500; color: #bbb; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; }
          .inv-meta-value { font-size: 13px; color: #111; margin-bottom: 2px; }
          .inv-meta-muted { font-size: 11px; color: #aaa; margin-bottom: 1px; }
          .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .inv-table thead th { font-size: 10px; font-weight: 500; color: #aaa; text-transform: uppercase; letter-spacing: .06em; padding: 8px 12px; background: #f7f7f7; text-align: left; }
          .inv-table thead th:last-child { text-align: right; }
          .inv-table thead th:nth-child(2) { text-align: center; }
          .inv-table thead th:nth-child(3) { text-align: right; }
          .inv-table tbody td { font-size: 13px; color: #333; padding: 12px 12px; border-bottom: 1px solid #f5f5f5; }
          .inv-table tbody td:last-child { text-align: right; }
          .inv-table tbody td:nth-child(2) { text-align: center; }
          .inv-table tbody td:nth-child(3) { text-align: right; }
          .inv-table tbody tr:nth-child(even) td { background: #fafafa; }
          .inv-totals { display: flex; justify-content: flex-end; margin-bottom: 28px; }
          .inv-totals-inner { width: 240px; }
          .inv-totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; color: #888; }
          .inv-totals-row span:last-child { color: #444; }
          .inv-totals-divider { border: none; border-top: 1px solid #f0f0f0; margin: 8px 0; }
          .inv-total-row { display: flex; justify-content: space-between; align-items: center; background: #111; border-radius: 10px; padding: 12px 16px; margin-top: 4px; }
          .inv-total-label { font-size: 13px; font-weight: 600; color: #fff; }
          .inv-total-value { font-size: 16px; font-weight: 600; color: #fff; }
          .inv-payment { background: #f9f9f9; border-radius: 12px; padding: 18px; margin-top: 8px; }
          .inv-payment-title { font-size: 10px; font-weight: 500; color: #bbb; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
          .inv-payment-row { display: flex; gap: 12px; margin-bottom: 6px; font-size: 12px; }
          .inv-payment-key { color: #aaa; width: 110px; flex-shrink: 0; }
          .inv-payment-val { color: #333; font-weight: 500; }
          .download-btn { width: 100%; padding: 16px; background: #111; color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 500; cursor: pointer; letter-spacing: -.01em; text-decoration: none; display: block; text-align: center; font-family: inherit; transition: background .15s; }
          .download-btn:hover { background: #333; }
          @media (max-width: 520px) {
            .inv-meta { grid-template-columns: 1fr 1fr; }
            .inv-header { flex-direction: column; gap: 20px; }
            .inv-right { text-align: left; }
          }
        `}</style>

        <div className="preview-wrap">
          <div className="preview-topbar">
            <div>
              <div className="preview-title">Invoice preview</div>
              <div className="preview-sub">Review before downloading</div>
            </div>
            <button className="back-btn" onClick={() => setScreen('form')}>← Edit invoice</button>
          </div>

          <div className="invoice-card">
            <div className="inv-header">
              <div>
                {logo && <img src={logo} className="inv-logo" alt="logo" />}
                <div className="inv-company-name">{form.companyName || '—'}</div>
                <div className="inv-company-detail">{form.companyAddress}</div>
                <div className="inv-company-detail">{form.companyEmail}</div>
              </div>
              <div className="inv-right">
                <div className="inv-title">INVOICE</div>
                <div className="inv-number">#{form.invoiceNumber}</div>
                <div className="inv-amount-label">Amount due</div>
                <div className="inv-amount">{fmt(total)}</div>
              </div>
            </div>

            <hr className="inv-divider" />

            <div className="inv-meta">
              <div>
                <div className="inv-meta-label">Invoice date</div>
                <div className="inv-meta-value">{form.invoiceDate || '—'}</div>
              </div>
              <div>
                <div className="inv-meta-label">Due date</div>
                <div className="inv-meta-value">{form.dueDate || '—'}</div>
              </div>
              <div>
                <div className="inv-meta-label">Billed to</div>
                <div className="inv-meta-value">{form.clientName || '—'}</div>
                <div className="inv-meta-muted">{form.clientAddress}</div>
                <div className="inv-meta-muted">{form.clientEmail}</div>
              </div>
            </div>

            <table className="inv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description || '—'}</td>
                    <td>{item.quantity || '0'}</td>
                    <td>{fmt(Number(item.rate))}</td>
                    <td>{fmt(Number(item.quantity) * Number(item.rate))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="inv-totals">
              <div className="inv-totals-inner">
                <div className="inv-totals-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                {applyVat && (
                  <div className="inv-totals-row"><span>VAT ({vatRate}%)</span><span>{fmt(vatAmount)}</span></div>
                )}
                <div className="inv-totals-divider" />
                <div className="inv-total-row">
                  <span className="inv-total-label">Total due</span>
                  <span className="inv-total-value">{fmt(total)}</span>
                </div>
              </div>
            </div>

            <div className="inv-payment">
              <div className="inv-payment-title">Payment details</div>
              <div className="inv-payment-row">
                <span className="inv-payment-key">Account name</span>
                <span className="inv-payment-val">{form.accountName || '—'}</span>
              </div>
              <div className="inv-payment-row">
                <span className="inv-payment-key">Account number</span>
                <span className="inv-payment-val">{form.accountNumber || '—'}</span>
              </div>
              <div className="inv-payment-row">
                <span className="inv-payment-key">Bank</span>
                <span className="inv-payment-val">{form.bankName || '—'}</span>
              </div>
            </div>
          </div>

          <PDFDownloadLink
            document={<InvoicePDF form={form} lineItems={lineItems} logo={logo} vatRate={vatRate} applyVat={applyVat} />}
            fileName={`invoice-${form.invoiceNumber || 'draft'}.pdf`}
            className="download-btn"
          >
            {({ loading }) => loading ? 'Preparing PDF...' : '↓ Download Invoice PDF'}
          </PDFDownloadLink>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f0ee; }
        ::placeholder { color: #c8c8c8 !important; opacity: 1; }
        .page-wrap { max-width: 640px; margin: 0 auto; padding: 48px 20px 100px; letter-spacing: -0.03em; }
        .page-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase; color: #aaa; margin-bottom: 6px; }
        .page-title { font-size: 28px; font-weight: 600; color: #111; margin-bottom: 6px; letter-spacing: -.03em; }
        .page-sub { font-size: 14px; color: #aaa; margin-bottom: 40px; letter-spacing: -.01em; }
        .card { background: #fff; border-radius: 20px; padding: 28px; margin-bottom: 12px; border: 1px solid #ebebeb; }
        .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
        .card-number { width: 22px; height: 22px; border-radius: 50%; background: #111; color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .card-title { font-size: 13px; font-weight: 600; color: #111; letter-spacing: -.01em; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .field:last-child { margin-bottom: 0; }
        .label { font-size: 11px; font-weight: 500; color: #aaa; letter-spacing: .04em; text-transform: uppercase; }
        .input { padding: 11px 14px; border: 1px solid #ebebeb; border-radius: 12px; font-size: 14px; color: #111; width: 100%; outline: none; background: #fafafa; transition: all .15s; font-family: inherit; letter-spacing: -.02em; }
        .input:focus { border-color: #111; background: #fff; }
        .input[type="date"] { color: #c8c8c8; }
        .input[type="date"]::-webkit-datetime-edit { color: #c8c8c8; }
        .input[type="date"]::-webkit-datetime-edit-fields-wrapper { color: #c8c8c8; }
        .input[type="date"]:not([value=""]) { color: #111; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media (max-width: 520px) {
          .two-col { grid-template-columns: 1fr; }
          .three-col { grid-template-columns: 1fr; }
          .line-row { grid-template-columns: 1fr 1fr !important; }
          .line-row .desc { grid-column: 1 / -1; }
          .page-title { font-size: 22px; }
        }
        .logo-box { width: 100%; height: 110px; border-radius: 14px; border: 1.5px dashed #ddd; background: #fafafa; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; transition: border-color .15s; gap: 8px; }
        .logo-box:hover { border-color: #111; }
        .logo-box img { width: 100%; height: 100%; object-fit: cover; }
        .logo-box-label { font-size: 12px; color: #bbb; letter-spacing: -.01em; }
        .logo-hint { font-size: 11px; color: #ccc; margin-top: 6px; letter-spacing: -.01em; }
        .line-row { display: grid; grid-template-columns: 3fr 80px 130px 36px; gap: 8px; align-items: end; margin-bottom: 10px; }
        .line-labels { display: grid; grid-template-columns: 3fr 80px 130px 36px; gap: 8px; margin-bottom: 6px; }
        .line-label { font-size: 11px; font-weight: 500; color: #aaa; letter-spacing: .04em; text-transform: uppercase; }
        .add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: #fafafa; border: 1px solid #ebebeb; border-radius: 10px; cursor: pointer; color: #555; font-size: 13px; font-weight: 500; margin-top: 6px; font-family: inherit; transition: all .15s; letter-spacing: -.01em; }
        .add-btn:hover { background: #f0f0f0; border-color: #ddd; }
        .remove-btn { width: 36px; height: 44px; background: #fafafa; border: 1px solid #ebebeb; border-radius: 10px; cursor: pointer; color: #ccc; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all .15s; font-family: inherit; }
        .remove-btn:hover { background: #fff0f0; border-color: #fca5a5; color: #dc2626; }
        .vat-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-top: 1px solid #f0f0f0; margin-top: 8px; }
        .vat-toggle-left { display: flex; align-items: center; gap: 10px; }
        .vat-label-text { font-size: 13px; color: #555; letter-spacing: -.01em; }
        .vat-sublabel { font-size: 11px; color: #bbb; letter-spacing: -.01em; }
        .toggle { width: 36px; height: 20px; border-radius: 10px; background: #e5e5e5; position: relative; cursor: pointer; transition: background .2s; border: none; flex-shrink: 0; }
        .toggle.on { background: #111; }
        .toggle::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff; top: 3px; left: 3px; transition: transform .2s; }
        .toggle.on::after { transform: translateX(16px); }
        .vat-input-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; padding: 12px 14px; background: #fafafa; border-radius: 12px; border: 1px solid #ebebeb; }
        .vat-input-label { font-size: 13px; color: #888; flex: 1; letter-spacing: -.01em; }
        .vat-input { width: 70px; padding: 6px 10px; border: 1px solid #ebebeb; border-radius: 8px; font-size: 14px; color: #111; outline: none; background: #fff; font-family: inherit; text-align: right; letter-spacing: -.01em; }
        .vat-input:focus { border-color: #111; }
        .vat-pct { font-size: 13px; color: #aaa; }
        .totals-card { background: #fff; border-radius: 20px; padding: 24px 28px; margin-bottom: 12px; border: 1px solid #ebebeb; }
        .totals-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 13px; color: #aaa; letter-spacing: -.01em; }
        .totals-row span:last-child { color: #555; }
        .totals-divider { border: none; border-top: 1px solid #f0f0f0; margin: 10px 0; }
        .totals-total { display: flex; justify-content: space-between; align-items: center; }
        .totals-total-label { font-size: 15px; font-weight: 600; color: #111; letter-spacing: -.02em; }
        .totals-total-value { font-size: 22px; font-weight: 600; color: #111; letter-spacing: -.03em; }
        .preview-btn { width: 100%; padding: 16px; background: #111; color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 500; cursor: pointer; margin-top: 4px; letter-spacing: -.01em; display: block; text-align: center; font-family: inherit; transition: background .15s; }
        .preview-btn:hover { background: #333; }
      `}</style>

      <div className="page-wrap">
        <p className="page-eyebrow">Invoice generator</p>
        <h1 className="page-title">Create an invoice</h1>
        <p className="page-sub">Fill in the details below and preview your invoice</p>

        <div className="card">
          <div className="card-header">
            <div className="card-number">1</div>
            <div className="card-title">Your business</div>
          </div>
          <div className="field">
            <label className="label">Company logo</label>
            <label className="logo-box" style={{cursor:'pointer'}}>
              <input type="file" accept="image/*" onChange={handleLogo} style={{display:'none'}} />
              {logo ? (
                <img src={logo} alt="logo" />
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="18" rx="3" stroke="#ccc" strokeWidth="1.3"/><circle cx="7.5" cy="7.5" r="1.5" fill="#ccc"/><path d="M2 15l5-5 4 4 3-3 6 6" stroke="#ccc" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="logo-box-label">Click to upload logo</span>
                </>
              )}
            </label>
            <span className="logo-hint">PNG or JPG · Max 2MB · Appears on your PDF</span>
          </div>
          <div className="field">
            <label className="label">Company name</label>
            <input className="input" placeholder="Taxaide Technologies" value={form.companyName} onChange={e => updateField('companyName', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Address</label>
            <input className="input" placeholder="House 1C, 423 Road, Festac Town, Lagos" value={form.companyAddress} onChange={e => updateField('companyAddress', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" placeholder="hello@company.com" value={form.companyEmail} onChange={e => updateField('companyEmail', e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-number">2</div>
            <div className="card-title">Client</div>
          </div>
          <div className="field">
            <label className="label">Client name</label>
            <input className="input" placeholder="Wale Enterprise Ltd" value={form.clientName} onChange={e => updateField('clientName', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Address</label>
            <input className="input" placeholder="5 Broad Street, Lagos" value={form.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" placeholder="client@company.com" value={form.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-number">3</div>
            <div className="card-title">Invoice details</div>
          </div>
          <div className="three-col">
            <div className="field">
              <label className="label">Invoice no.</label>
              <input className="input" placeholder="INV-001" value={form.invoiceNumber} onChange={e => updateField('invoiceNumber', e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Issue date</label>
              <input className="input" type="date" value={form.invoiceDate} onChange={e => updateField('invoiceDate', e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Due date</label>
              <input className="input" type="date" value={form.dueDate} onChange={e => updateField('dueDate', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-number">4</div>
            <div className="card-title">Line items</div>
          </div>
          <div className="line-labels">
            <span className="line-label">Description</span>
            <span className="line-label">Qty</span>
            <span className="line-label">Rate (NGN)</span>
            <span></span>
          </div>
          {lineItems.map((item, index) => (
            <div key={index} className="line-row">
              <input className="input desc" placeholder="e.g. Website design" value={item.description} onChange={e => updateLineItem(index, 'description', e.target.value)} />
              <input className="input" type="number" placeholder="1" value={item.quantity} onChange={e => updateLineItem(index, 'quantity', e.target.value)} />
              <input className="input" type="number" placeholder="50,000" value={item.rate} onChange={e => updateLineItem(index, 'rate', e.target.value)} />
              <button className="remove-btn" onClick={() => removeLineItem(index)}>×</button>
            </div>
          ))}
          <button className="add-btn" onClick={addLineItem}>+ Add line item</button>

          <div className="vat-toggle-row">
            <div className="vat-toggle-left">
              <div>
                <div className="vat-label-text">Apply VAT</div>
                <div className="vat-sublabel">Toggle to add VAT to this invoice</div>
              </div>
            </div>
            <button className={`toggle ${applyVat ? 'on' : ''}`} onClick={() => setApplyVat(!applyVat)} />
          </div>

          {applyVat && (
            <div className="vat-input-row">
              <span className="vat-input-label">VAT rate</span>
              <input className="vat-input" type="number" value={vatRate} onChange={e => setVatRate(e.target.value)} placeholder="7.5" />
              <span className="vat-pct">%</span>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-number">5</div>
            <div className="card-title">Payment details</div>
          </div>
          <div className="field">
            <label className="label">Account name</label>
            <input className="input" placeholder="William Isabella" value={form.accountName} onChange={e => updateField('accountName', e.target.value)} />
          </div>
          <div className="two-col">
            <div className="field">
              <label className="label">Account number</label>
              <input className="input" placeholder="0123456789" value={form.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Bank name</label>
              <input className="input" placeholder="First Bank of Nigeria" value={form.bankName} onChange={e => updateField('bankName', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="totals-card">
          <div className="totals-row"><span>Subtotal</span><span>NGN {subtotal.toLocaleString()}</span></div>
          {applyVat && (
            <div className="totals-row"><span>VAT ({vatRate}%)</span><span>NGN {vatAmount.toLocaleString()}</span></div>
          )}
          <hr className="totals-divider" />
          <div className="totals-total">
            <span className="totals-total-label">Total due</span>
            <span className="totals-total-value">NGN {total.toLocaleString()}</span>
          </div>
        </div>

        <button className="preview-btn" onClick={() => setScreen('preview')}>
          Preview Invoice →
        </button>
      </div>
    </>
  )
}