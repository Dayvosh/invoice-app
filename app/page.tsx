'use client'
import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import InvoicePDF from '../components/InvoicePDF'

export default function Home() {
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

  const [logo, setLogo] = useState(null)
  const [ready, setReady] = useState(false)

  const updateField = (field: string, value: string) => {

  const updateLineItem = (index: number, field: string, value: string) => {
    const updated = [...lineItems]
    updated[index][field] = value
    setLineItems(updated)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: '', rate: '' }])
  }

  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setLogo(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0)
  const vat = subtotal * 0.075
  const total = subtotal + vat

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f0ee; }
        ::placeholder { color: #c8c8c8 !important; opacity: 1; }

        .page-wrap { max-width: 640px; margin: 0 auto; padding: 48px 20px 100px; }

        .page-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: #aaa; margin-bottom: 6px; }
        .page-title { font-size: 28px; font-weight: 600; color: #111; margin-bottom: 6px; letter-spacing: -.02em; }
        .page-sub { font-size: 14px; color: #aaa; margin-bottom: 40px; }

        .card { background: #fff; border-radius: 20px; padding: 28px; margin-bottom: 12px; border: 1px solid #ebebeb; }
        .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
        .card-number { width: 22px; height: 22px; border-radius: 50%; background: #111; color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .card-title { font-size: 13px; font-weight: 600; color: #111; letter-spacing: .01em; }

        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .field:last-child { margin-bottom: 0; }
        .label { font-size: 11px; font-weight: 500; color: #aaa; letter-spacing: .04em; text-transform: uppercase; }
        .input { padding: 11px 14px; border: 1px solid #ebebeb; border-radius: 12px; font-size: 14px; color: #111; width: 100%; outline: none; background: #fafafa; transition: all .15s; font-family: inherit; }
        .input:focus { border-color: #111; background: #fff; }

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
        .logo-box-label { font-size: 12px; color: #bbb; }
        .logo-hint { font-size: 11px; color: #ccc; margin-top: 6px; }

        .line-row { display: grid; grid-template-columns: 3fr 80px 130px 36px; gap: 8px; align-items: end; margin-bottom: 10px; }
        .line-labels { display: grid; grid-template-columns: 3fr 80px 130px 36px; gap: 8px; margin-bottom: 6px; }
        .line-label { font-size: 11px; font-weight: 500; color: #aaa; letter-spacing: .04em; text-transform: uppercase; }

        .add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: #fafafa; border: 1px solid #ebebeb; border-radius: 10px; cursor: pointer; color: #555; font-size: 13px; font-weight: 500; margin-top: 6px; font-family: inherit; transition: all .15s; }
        .add-btn:hover { background: #f0f0f0; border-color: #ddd; }

        .remove-btn { width: 36px; height: 44px; background: #fafafa; border: 1px solid #ebebeb; border-radius: 10px; cursor: pointer; color: #ccc; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all .15s; font-family: inherit; }
        .remove-btn:hover { background: #fff0f0; border-color: #fca5a5; color: #dc2626; }

        .totals-card { background: #fff; border-radius: 20px; padding: 24px 28px; margin-bottom: 12px; border: 1px solid #ebebeb; }
        .totals-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 13px; color: #aaa; }
        .totals-row span:last-child { color: #555; }
        .totals-divider { border: none; border-top: 1px solid #f0f0f0; margin: 10px 0; }
        .totals-total { display: flex; justify-content: space-between; align-items: center; }
        .totals-total-label { font-size: 15px; font-weight: 600; color: #111; }
        .totals-total-value { font-size: 22px; font-weight: 600; color: #111; letter-spacing: -.02em; }

        .generate-btn { width: 100%; padding: 16px; background: #111; color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 500; cursor: pointer; margin-top: 4px; letter-spacing: .01em; text-decoration: none; display: block; text-align: center; font-family: inherit; transition: background .15s; }
        .generate-btn:hover { background: #333; }
      `}</style>

      <div className="page-wrap">
        <p className="page-eyebrow">Invoice generator</p>
        <h1 className="page-title">Create an invoice</h1>
        <p className="page-sub">Fill in the details below and download your PDF</p>

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
          <div className="totals-row"><span>VAT (7.5%)</span><span>NGN {vat.toLocaleString()}</span></div>
          <hr className="totals-divider" />
          <div className="totals-total">
            <span className="totals-total-label">Total due</span>
            <span className="totals-total-value">NGN {total.toLocaleString()}</span>
          </div>
        </div>

        {!ready ? (
          <button className="generate-btn" onClick={() => setReady(true)}>
            Generate Invoice PDF
          </button>
        ) : (
          <PDFDownloadLink
            document={<InvoicePDF form={form} lineItems={lineItems} logo={logo} />}
            fileName={`invoice-${form.invoiceNumber || 'draft'}.pdf`}
            className="generate-btn"
          >
            {({ loading }) => loading ? 'Preparing PDF...' : '↓ Download Invoice PDF'}
          </PDFDownloadLink>
        )}
      </div>
    </>
  )
}