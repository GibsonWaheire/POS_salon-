export default function ReceiptTemplate({ 
  receiptNumber, 
  date, 
  time, 
  staffName, 
  clientName, 
  clientPhone, 
  services, 
  subtotal, 
  tax, 
  total, 
  paymentMethod, 
  commission 
}) {

  const formatKES = (amount) => {
    return `KES ${amount.toLocaleString('en-KE')}`
  }

  return (
    <div className="hidden">
      <div 
        className="print-receipt"
        style={{
          width: '80mm',
          margin: '0 auto',
          padding: '10mm',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4'
        }}
      >
        {/* Print-only styles */}
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-receipt,
              .print-receipt * {
                visibility: visible;
              }
              .print-receipt {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm;
              }
            }
            @media screen {
              .print-receipt {
                display: none;
              }
            }
          `}
        </style>

        {/* Receipt Header */}
        <div style={{ textAlign: 'center', marginBottom: '15px', borderBottom: '2px dashed #000', paddingBottom: '10px' }}>
          <h1 style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>PREMIUM BEAUTY SALON</h1>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>Nairobi, Kenya</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>Tel: +254 700 000 000</p>
        </div>

        {/* Receipt Info */}
        <div style={{ marginBottom: '10px', fontSize: '11px' }}>
          <p style={{ margin: '3px 0' }}><strong>Receipt No:</strong> {receiptNumber}</p>
          <p style={{ margin: '3px 0' }}><strong>Date:</strong> {date}</p>
          <p style={{ margin: '3px 0' }}><strong>Time:</strong> {time}</p>
          <p style={{ margin: '3px 0' }}><strong>Staff:</strong> {staffName}</p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

        {/* Client Info */}
        {(clientName || clientPhone) && (
          <div style={{ marginBottom: '10px', fontSize: '11px' }}>
            <p style={{ margin: '3px 0' }}><strong>Client:</strong> {clientName || 'Walk-in'}</p>
            {clientPhone && <p style={{ margin: '3px 0' }}><strong>Phone:</strong> {clientPhone}</p>}
          </div>
        )}

        {/* Services List */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '5px 0' }}>
            {services.map((service, index) => (
              <div key={index} style={{ marginBottom: '5px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>{service.name} x {service.quantity}</span>
                  <span>{formatKES(service.price * service.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div style={{ marginBottom: '10px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>Subtotal:</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span>VAT (8%):</span>
            <span>{formatKES(tax)}</span>
          </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: '5px', marginTop: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px' }}>
            <span>TOTAL:</span>
            <span>{formatKES(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: '10px', fontSize: '11px', padding: '5px', backgroundColor: '#f0f0f0' }}>
          <p style={{ margin: '3px 0' }}><strong>Payment Method:</strong> {paymentMethod}</p>
        </div>

        {/* Staff Commission */}
        <div style={{ marginBottom: '15px', fontSize: '11px', padding: '5px', backgroundColor: '#e8f5e9' }}>
          <p style={{ margin: '3px 0' }}><strong>Staff Commission:</strong> {formatKES(commission)}</p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '2px dashed #000', margin: '10px 0' }}></div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px' }}>
          <p style={{ margin: '5px 0' }}>Thank you for your business!</p>
          <p style={{ margin: '5px 0' }}>Visit us again</p>
          <p style={{ margin: '10px 0 0 0', fontSize: '9px' }}>Receipt #{receiptNumber}</p>
        </div>
      </div>
    </div>
  )
}

