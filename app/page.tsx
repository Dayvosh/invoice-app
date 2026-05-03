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
          .pv-wrap { max-width: 680px; margin: 0 auto; padding: 24px 16px 80px; letter-spacing: -0.02em; }
          .pv-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
          .pv-heading { font-size: 18px; font-weight: 600; color: #111; letter-spacing: -.02em; }
          .pv-sub { font-size: 12px; color: #aaa; margin-top: 2px; }
          .pv-back { padding: 10px 16px; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; cursor: pointer; color: #333; font-size: 13px; font-weight: 500; font-family: inherit; transition: all .15s; }
          .pv-back:hover { border-color: #111; }
          .pv-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e8e8e8; margin-bottom: 10px; }
          .pv-inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px; }
          .pv-logo { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; display: block; margin-bottom: 10px; }
          .pv-company-name { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 3px; }
          .pv-company-detail { font-size: 11px; color: #aaa; margin-bottom: 2px; }
          .pv-inv-right { text-align: right; flex-shrink: 0; }
          .pv-inv-title { font-size: 22px; font-weight: 600; color: #111; letter-spacing: -.02em; }
          .pv-inv-num { font-size: 11px; color: #aaa; margin-top: 3px; margin-bottom: 12px; }
          .pv-amt-label { font-size: 9px; color: #aaa; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 3px; }
          .pv-amt { font-size: 16px; font-weight: 600; color: #111; }
          .pv-divider { border: none; border-top: 1px solid #f0f0f0; margin: 0 0 20px; }
          .pv-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .pv-meta-full { grid-column: 1 / -1; }
          .pv-meta-label { font-size: 9px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
          .pv-meta-value { font-size: 13px; color: #111; margin-bottom: 2px; font-weight: 500; }
          .pv-meta-muted { font-size: 11px; color: #aaa; margin-bottom: 1px; }
          .pv-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
          .pv-table thead th { font-size: 9px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: .06em; padding: 8px 10px; background: #f7f7f7; text-align: left; }
          .pv-table thead th.r { text-align: right; }
          .pv-table thead th.c { text-align: center; }
          .pv-table tbody td { padding: 10px 10px; border-bottom: 1px solid #f5f5f5; color: #333; vertical-align: top; }
          .pv-table tbody td.r { text-align: right; }
          .pv-table tbody td.c { text-align: center; }
          .pv-table tbody tr:nth-child(even) td { background: #fafafa; }
          .pv-totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
          .pv-totals-inner { width: 220px; }
          .pv-tot-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: #888; border-bottom: 1px solid #f5f5f5; }
          .pv-tot-row span:last-child { color: #444; }
          .pv-tot-grand { display: flex; justify-content: space-between; align-items: center; background: #111; border-radius: 8px; padding: 10px 14px; margin-top: 6px; }
          .pv-tot-grand-label { font-size: 12px; font-weight: 600; color: #fff; }
          .pv-tot-grand-val { font-size: 14px; font-weight: 600; color: #fff; }
          .pv-payment { background: #f9f9f9; border-radius: 10px; padding: 16px; }
          .pv-payment-title { font-size: 9px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px; }
          .pv-payment-row { display: flex; gap: 10px; margin-bottom: 6px; font-size: 12px; }
          .pv-payment-key { color: #aaa; width: 110px; flex-shrink: 0; }
          .pv-payment-val { color: #333; font-weight: 500; }
          .dl-btn { width: 100%; padding: 16px; background: #111; color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 500; cursor: pointer; letter-spacing: -.01em; text-decoration: none; display: block; text-align: center; font-family: inherit; transition: background .15s; margin-top: 4px; }
          .dl-btn:hover { background: #333; }
          @media (max-width: 480px) {
            .pv-wrap { padding: 16px 12px 80px; }
            .pv-card { padding: 16px; }
            .pv-inv-header { flex-direction: column; gap: 16px; }
            .pv-inv-right { text-align: left; }
            .pv-meta { grid-template-columns: 1fr 1fr; gap: 12px; }
            .pv-table { font-size: 11px; }
            .pv-table thead th { padding: 7px 8px; }
            .pv-table tbody td { padding: 8px 8px; }
            .pv-totals-inner { width: 100%; }
            .pv-totals { display: block; }
          }
        `}</style>

        <div className="pv-wrap">
          <div className="pv-topbar">
            <div>
              <div className="pv-heading">Preview</div>
              <div className="pv-sub">Looks good? Download below</div>
            </div>
            <button className="pv-back" onClick={() => setScreen('form')}>← Edit</button>
          </div>

          <div className="pv-card">
            <div className="pv-inv-header">
              <div>
                {logo && <img src={logo} className="pv-logo" alt="logo" />}
                <div className="pv-company-name">{form.companyName || '—'}</div>
                <div className="pv-company-detail">{form.companyAddress}</div>
                <div className="pv-company-detail">{form.companyEmail}</div>
              </div>
              <div className="pv-inv-right">
                <div className="pv-inv-title">INVOICE</div>
                <div className="pv-inv-num">#{form.invoiceNumber}</div>
                <div className="pv-amt-label">Amount due</div>
                <div className="pv-amt">{fmt(total)}</div>
              </div>
            </div>

            <hr className="pv-divider" />

            <div className="pv-meta">
              <div>
                <div className="pv-meta-label">Invoice date</div>
                <div className="pv-meta-value">{form.invoiceDate || '—'}</div>
              </div>
              <div>
                <div className="pv-meta-label">Due date</div>
                <div className="pv-meta-value">{form.dueDate || '—'}</div>
              </div>
              <div className="pv-meta-full">
                <div className="pv-meta-label">Billed to</div>
                <div className="pv-meta-value">{form.clientName || '—'}</div>
                <div className="pv-meta-muted">{form.clientAddress}</div>
                <div className="pv-meta-muted">{form.clientEmail}</div>
              </div>
            </div>

            <table className="pv-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="c">Qty</th>
                  <th className="r">Rate</th>
                  <th className="r">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description || '—'}</td>
                    <td className="c">{item.quantity || '0'}</td>
                    <td className="r">{fmt(Number(item.rate))}</td>
                    <td className="r">{fmt(Number(item.quantity) * Number(item.rate))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pv-totals">
              <div className="pv-totals-inner">
                <div className="pv-tot-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                {applyVat && <div className="pv-tot-row"><span>VAT ({vatRate}%)</span><span>{fmt(vatAmount)}</span></div>}
                <div className="pv-tot-grand">
                  <span className="pv-tot-grand-label">Total due</span>
                  <span className="pv-tot-grand-val">{fmt(total)}</span>
                </div>
              </div>
            </div>

            <div className="pv-payment">
              <div className="pv-payment-title">Payment details</div>
              <div className="pv-payment-row"><span className="pv-payment-key">Account name</span><span className="pv-payment-val">{form.accountName || '—'}</span></div>
              <div className="pv-payment-row"><span className="pv-payment-key">Account number</span><span className="pv-payment-val">{form.accountNumber || '—'}</span></div>
              <div className="pv-payment-row"><span className="pv-payment-key">Bank</span><span className="pv-payment-val">{form.bankName || '—'}</span></div>
            </div>
          </div>

          <PDFDownloadLink
            document={<InvoicePDF form={form} lineItems={lineItems} logo={logo} vatRate={vatRate} applyVat={applyVat} />}
            fileName={`invoice-${form.invoiceNumber || 'draft'}.pdf`}
            className="dl-btn"
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
        body { background: #f0f0ee; -webkit-text-size-adjust: 100%; }
        ::placeholder { color: #bbb !important; opacity: 1; }

        .wrap { max-width: 640px; margin: 0 auto; padding: 40px 16px 100px; letter-spacing: -0.02em; }
        .page-title { font-size: 26px; font-weight: 600; color: #111; margin-bottom: 6px; letter-spacing: -.03em; }
        .page-sub { font-size: 14px; color: #999; margin-bottom: 32px; }

        .card { background: #fff; border-radius: 16px; padding: 20px; margin-bottom: 10px; border: 1px solid #e8e8e8; }
        .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .card-num { width: 24px; height: 24px; border-radius: 50%; background: #111; color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .card-title { font-size: 14px; font-weight: 600; color: #111; }

        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .field:last-child { margin-bottom: 0; }
        .label { font-size: 12px; font-weight: 600; color: #666; letter-spacing: .01em; }

        .input {
          padding: 13px 14px;
          border: 1.5px solid #e8e8e8;
          border-radius: 12px;
          font-size: 16px;
          color: #111;
          width: 100%;
          outline: none;
          background: #fafafa;
          transition: border-color .15s, background .15s;
          font-family: inherit;
          letter-spacing: -.01em;
          -webkit-appearance: none;
          appearance: none;
          min-height: 48px;
        }
        .input:focus { border-color: #111; background: #fff; }

        input[type="date"].input {
          color: #bbb;
          min-height: 48px;
        }
        input[type="date"].input:before {
          content: attr(placeholder);
          color: #bbb;
          pointer-events: none;
        }
        input[type="date"].input:focus:before,
        input[type="date"].input.has-value:before {
          display: none;
        }
        input[type="date"].input::-webkit-datetime-edit { color: #bbb; }
        input[type="date"].input::-webkit-datetime-edit-fields-wrapper { color: #bbb; }
        input[type="date"].input.has-value { color: #111; }
        input[type="date"].input.has-value::-webkit-datetime-edit { color: #111; }
        input[type="date"].input.has-value::-webkit-datetime-edit-fields-wrapper { color: #111; }
        input[type="number"].input::-webkit-outer-spin-button,
        input[type="number"].input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        @media (max-width: 480px) {
          .wrap { padding: 24px 12px 100px; }
          .two-col { grid-template-columns: 1fr; }
          .page-title { font-size: 22px; }
        }

        .logo-box { width: 100%; height: 100px; border-radius: 12px; border: 1.5px dashed #ddd; background: #fafafa; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; transition: border-color .15s; gap: 8px; }
        .logo-box:hover { border-color: #111; }
        .logo-box img { width: 100%; height: 100%; object-fit: cover; }
        .logo-box-text { font-size: 13px; color: #bbb; }
        .logo-hint { font-size: 11px; color: #ccc; margin-top: 4px; }

        .line-item { background: #fafafa; border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
        .line-item-num { font-size: 11px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px; }
        .line-item-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        .line-item-input { padding: 12px 14px; border: 1.5px solid #e0e0e0; border-radius: 10px; font-size: 16px; color: #111; width: 100%; outline: none; background: #fff; font-family: inherit; -webkit-appearance: none; appearance: none; min-height: 48px; transition: border-color .15s; }
        .line-item-input:focus { border-color: #111; }
        input[type="number"].line-item-input::-webkit-outer-spin-button,
        input[type="number"].line-item-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .line-item-label { font-size: 11px; font-weight: 600; color: #888; margin-bottom: 5px; }
        .remove-item-btn { margin-top: 10px; width: 100%; padding: 10px; background: #fff; border: 1.5px solid #fca5a5; border-radius: 10px; cursor: pointer; color: #dc2626; font-size: 13px; font-weight: 500; font-family: inherit; transition: all .15s; }
        .remove-item-btn:hover { background: #fff0f0; }

        .add-btn { width: 100%; padding: 13px; background: #fafafa; border: 1.5px dashed #ddd; border-radius: 12px; cursor: pointer; color: #666; font-size: 14px; font-weight: 500; margin-top: 4px; font-family: inherit; transition: all .15s; }
        .add-btn:hover { border-color: #111; color: #111; background: #f5f5f5; }

        .vat-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-top: 1.5px solid #f0f0f0; margin-top: 12px; }
        .vat-text { font-size: 14px; color: #444; font-weight: 500; }
        .vat-subtext { font-size: 11px; color: #bbb; margin-top: 2px; }
        .toggle { width: 44px; height: 26px; border-radius: 13px; background: #e0e0e0; position: relative; cursor: pointer; transition: background .2s; border: none; flex-shrink: 0; }
        .toggle.on { background: #111; }
        .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #fff; top: 4px; left: 4px; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
        .toggle.on::after { transform: translateX(18px); }
        .vat-rate-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; padding: 14px; background: #fafafa; border-radius: 12px; border: 1.5px solid #e8e8e8; }
        .vat-rate-label { font-size: 14px; color: #666; font-weight: 500; flex: 1; }
        .vat-rate-input { width: 80px; padding: 10px 12px; border: 1.5px solid #e0e0e0; border-radius: 10px; font-size: 16px; color: #111; outline: none; background: #fff; font-family: inherit; text-align: right; -webkit-appearance: none; }
        .vat-rate-input:focus { border-color: #111; }
        input[type="number"].vat-rate-input::-webkit-outer-spin-button,
        input[type="number"].vat-rate-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .vat-pct { font-size: 14px; color: #aaa; }

        .totals-card { background: #fff; border-radius: 16px; padding: 20px; margin-bottom: 10px; border: 1px solid #e8e8e8; }
        .tot-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; font-size: 14px; color: #888; border-bottom: 1px solid #f5f5f5; }
        .tot-row span:last-child { color: #444; font-weight: 500; }
        .tot-grand { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; margin-top: 4px; }
        .tot-grand-label { font-size: 15px; font-weight: 600; color: #111; }
        .tot-grand-val { font-size: 22px; font-weight: 600; color: #111; letter-spacing: -.02em; }

        .preview-btn { width: 100%; padding: 16px; background: #111; color: #fff; border: none; border-radius: 14px; font-size: 16px; font-weight: 500; cursor: pointer; letter-spacing: -.01em; display: block; text-align: center; font-family: inherit; transition: background .15s; -webkit-appearance: none; }
        .preview-btn:hover { background: #333; }
        .preview-btn:active { background: #000; transform: scale(0.99); }
      `}</style>

      <div className="wrap">
        <h1 className="page-title">Create an invoice</h1>
        <p className="page-sub">Fill in the details below</p>

        <div className="card">
          <div className="card-header">
            <div className="card-num">1</div>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" stroke="#ccc" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" fill="#ccc"/><path d="M2 17l6-6 4 4 3-3 7 7" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="logo-box-text">Tap to upload logo</span>
                </>
              )}
            </label>
            <span className="logo-hint">PNG or JPG · Appears on your PDF</span>
          </div>
          <div className="field">
            <label className="label">Company name</label>
            <input className="input" placeholder="Taxaide Technologies" value={form.companyName} onChange={e => updateField('companyName', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Address</label>
            <input className="input" placeholder="423 Road, Festac Town, Lagos" value={form.companyAddress} onChange={e => updateField('companyAddress', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="hello@company.com" value={form.companyEmail} onChange={e => updateField('companyEmail', e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-num">2</div>
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
            <input className="input" type="email" placeholder="client@company.com" value={form.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-num">3</div>
            <div className="card-title">Invoice details</div>
          </div>
          <div className="field">
            <label className="label">Invoice number</label>
            <input className="input" placeholder="INV-001" value={form.invoiceNumber} onChange={e => updateField('invoiceNumber', e.target.value)} />
          </div>
          <div className="two-col">
            <div className="field">
              <label className="label">Issue date</label>
              <div style={{position:'relative'}}>
                <input
                  className={`input${form.invoiceDate ? ' has-value' : ''}`}
                  type="date"
                  placeholder="DD/MM/YY"
                  value={form.invoiceDate}
                  onChange={e => updateField('invoiceDate', e.target.value)}
                  style={{paddingRight:'44px'}}
                />
                <svg style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="#bbb" strokeWidth="1.3"/><path d="M6 1v3M12 1v3M2 7h14" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
            </div>
            <div className="field">
              <label className="label">Due date</label>
              <div style={{position:'relative'}}>
                <input
                  className={`input${form.dueDate ? ' has-value' : ''}`}
                  type="date"
                  placeholder="DD/MM/YY"
                  value={form.dueDate}
                  onChange={e => updateField('dueDate', e.target.value)}
                  style={{paddingRight:'44px'}}
                />
                <svg style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="#bbb" strokeWidth="1.3"/><path d="M6 1v3M12 1v3M2 7h14" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-num">4</div>
            <div className="card-title">Line items</div>
          </div>
          {lineItems.map((item, index) => (
            <div key={index} className="line-item">
              <div className="line-item-num">Item {index + 1}</div>
              <div className="field" style={{margin:0}}>
                <label className="line-item-label">Description</label>
                <input className="line-item-input" placeholder="e.g. Website design" value={item.description} onChange={e => updateLineItem(index, 'description', e.target.value)} />
              </div>
              <div className="line-item-row">
                <div>
                  <div className="line-item-label">Quantity</div>
                  <input className="line-item-input" type="number" placeholder="1" value={item.quantity} onChange={e => updateLineItem(index, 'quantity', e.target.value)} />
                </div>
                <div>
                  <div className="line-item-label">Rate (NGN)</div>
                  <input className="line-item-input" type="number" placeholder="50,000" value={item.rate} onChange={e => updateLineItem(index, 'rate', e.target.value)} />
                </div>
              </div>
              {lineItems.length > 1 && (
                <button className="remove-item-btn" onClick={() => removeLineItem(index)}>Remove item</button>
              )}
            </div>
          ))}
          <button className="add-btn" onClick={addLineItem}>+ Add line item</button>
          <div className="vat-toggle-row">
            <div>
              <div className="vat-text">Apply VAT</div>
              <div className="vat-subtext">Add VAT to this invoice</div>
            </div>
            <button className={`toggle ${applyVat ? 'on' : ''}`} onClick={() => setApplyVat(!applyVat)} />
          </div>
          {applyVat && (
            <div className="vat-rate-row">
              <span className="vat-rate-label">VAT rate</span>
              <input className="vat-rate-input" type="number" value={vatRate} onChange={e => setVatRate(e.target.value)} placeholder="7.5" />
              <span className="vat-pct">%</span>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-num">5</div>
            <div className="card-title">Payment details</div>
          </div>
          <div className="field">
            <label className="label">Account name</label>
            <input className="input" placeholder="William Isabella" value={form.accountName} onChange={e => updateField('accountName', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Account number</label>
            <input className="input" placeholder="0123456789" value={form.accountNumber} onChange={e => updateField('accountNumber', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Bank name</label>
            <input className="input" placeholder="First Bank of Nigeria" value={form.bankName} onChange={e => updateField('bankName', e.target.value)} />
          </div>
        </div>

        <div className="totals-card">
          <div className="tot-row"><span>Subtotal</span><span>NGN {subtotal.toLocaleString()}</span></div>
          {applyVat && <div className="tot-row"><span>VAT ({vatRate}%)</span><span>NGN {vatAmount.toLocaleString()}</span></div>}
          <div className="tot-grand">
            <span className="tot-grand-label">Total due</span>
            <span className="tot-grand-val">NGN {total.toLocaleString()}</span>
          </div>
        </div>

        <button className="preview-btn" onClick={() => setScreen('preview')}>
          Preview Invoice →
        </button>
      </div>
    </>
  )
}