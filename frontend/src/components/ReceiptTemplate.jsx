export default function ReceiptTemplate({ 
  receiptNumber, 
  date, 
  time, 
  staffName, 
  clientName, 
  clientPhone, 
  services = [], 
  products = [],
  subtotal, 
  tax, 
  total, 
  paymentMethod,
  kraPin = "P051234567K", // Default KRA PIN - should be configurable
  transactionCode = null // M-Pesa transaction code
}) {

  const formatKES = (amount) => {
    return `KES ${amount.toLocaleString('en-KE')}`
  }

  return (
    <div className="receipt-print-only">
      <div 
        className="receipt-container"
        style={{
          width: '80mm',
          maxWidth: '80mm',
          margin: '0 auto',
          padding: '8mm 5mm',
          fontFamily: 'monospace',
          fontSize: '11px',
          lineHeight: '1.5',
          color: '#000',
          backgroundColor: '#fff'
        }}
      >
        {/* Print-only styles */}
        <style>
          {`
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body * {
                visibility: hidden;
              }
              .receipt-print-only,
              .receipt-print-only * {
                visibility: visible;
              }
              .receipt-print-only {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm;
                display: block !important;
              }
              .no-print {
                display: none !important;
              }
            }
            @media screen {
              .receipt-print-only {
                display: none !important;
              }
            }
          `}
        </style>

        {/* Receipt Header */}
        <div style={{ textAlign: 'center', marginBottom: '12px', borderBottom: '2px solid #000', paddingBottom: '8px' }}>
          <h1 style={{ 
            margin: '4px 0', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            PREMIUM BEAUTY SALON
          </h1>
          <p style={{ margin: '2px 0', fontSize: '9px', lineHeight: '1.3' }}>Nairobi, Kenya</p>
          <p style={{ margin: '2px 0', fontSize: '9px' }}>Tel: +254 700 000 000</p>
          <p style={{ margin: '2px 0', fontSize: '9px', fontWeight: 'bold' }}>KRA PIN: {kraPin}</p>
        </div>

        {/* Receipt Details */}
        <div style={{ marginBottom: '10px', fontSize: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span><strong>Receipt #:</strong></span>
            <span>{receiptNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span><strong>Date:</strong></span>
            <span>{date}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span><strong>Time:</strong></span>
            <span>{time}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Staff:</strong></span>
            <span>{staffName}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px dashed #333', margin: '8px 0' }}></div>

        {/* Client Information */}
        {(clientName || clientPhone) && (
          <>
            <div style={{ marginBottom: '8px', fontSize: '10px' }}>
              <p style={{ margin: '2px 0', fontWeight: 'bold' }}>Client Details:</p>
              {clientName && <p style={{ margin: '2px 0' }}>Name: {clientName}</p>}
              {clientPhone && <p style={{ margin: '2px 0' }}>Phone: {clientPhone}</p>}
            </div>
            <div style={{ borderTop: '1px dashed #333', margin: '8px 0' }}></div>
          </>
        )}

        {/* Services Header */}
        {services.length > 0 && (
          <>
            <div style={{ marginBottom: '6px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '11px', textAlign: 'center', marginBottom: '4px' }}>
                SERVICES PROVIDED
              </p>
            </div>

            {/* Services List */}
            <div style={{ marginBottom: '12px', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '6px 0' }}>
              {services.map((service, index) => (
                <div 
                  key={`service-${index}`}
                  style={{ 
                    marginBottom: index < services.length - 1 ? '6px' : '0',
                    fontSize: '10px',
                    paddingBottom: index < services.length - 1 ? '6px' : '0',
                    borderBottom: index < services.length - 1 ? '1px dashed #ccc' : 'none'
                  }}
                >
                  <div style={{ marginBottom: '3px', fontWeight: 'bold' }}>
                    {service.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#555' }}>
                    <span>Qty: {service.quantity} × {formatKES(service.price)}</span>
                    <span style={{ fontWeight: 'bold', color: '#000' }}>
                      {formatKES(service.price * service.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Products Header */}
        {products.length > 0 && (
          <>
            <div style={{ marginBottom: '6px', marginTop: services.length > 0 ? '12px' : '0' }}>
              <p style={{ fontWeight: 'bold', fontSize: '11px', textAlign: 'center', marginBottom: '4px' }}>
                PRODUCTS SOLD
              </p>
            </div>

            {/* Products List */}
            <div style={{ marginBottom: '12px', borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '6px 0' }}>
              {products.map((product, index) => (
                <div 
                  key={`product-${index}`}
                  style={{ 
                    marginBottom: index < products.length - 1 ? '6px' : '0',
                    fontSize: '10px',
                    paddingBottom: index < products.length - 1 ? '6px' : '0',
                    borderBottom: index < products.length - 1 ? '1px dashed #ccc' : 'none'
                  }}
                >
                  <div style={{ marginBottom: '3px', fontWeight: 'bold' }}>
                    {product.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#555' }}>
                    <span>Qty: {product.quantity} × {formatKES(product.price)}</span>
                    <span style={{ fontWeight: 'bold', color: '#000' }}>
                      {formatKES(product.price * product.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Totals Section */}
        <div style={{ marginBottom: '12px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
            <span>Subtotal:</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '10px' }}>
            <span>VAT (16%):</span>
            <span>{formatKES(tax)}</span>
          </div>
          <div style={{ 
            borderTop: '2px solid #000', 
            borderBottom: '2px solid #000',
            padding: '6px 0',
            marginTop: '6px',
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: 'bold', 
            fontSize: '13px' 
          }}>
            <span>TOTAL:</span>
            <span>{formatKES(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ 
          marginBottom: '12px', 
          padding: '6px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          fontSize: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Payment Method</div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#006400' }}>
            {paymentMethod ? paymentMethod.replace(/-/g, ' ').toUpperCase() : 'CASH'}
          </div>
          {transactionCode && (
            <div style={{ fontSize: '9px', color: '#666', marginTop: '4px' }}>
              Transaction: {transactionCode}
            </div>
          )}
        </div>

        {/* Manager Signature Section */}
        <div style={{ 
          marginTop: '20px',
          marginBottom: '12px',
          padding: '8px 0',
          borderTop: '1px dashed #333',
          borderBottom: '1px dashed #333'
        }}>
          <div style={{ fontSize: '10px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Manager's Signature:</div>
            <div style={{ 
              height: '30px',
              borderBottom: '1px solid #000',
              marginBottom: '4px'
            }}></div>
            <div style={{ fontSize: '9px', color: '#666', textAlign: 'right' }}>
              Date: ________________
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '2px solid #000', margin: '12px 0 8px 0' }}></div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '9px', lineHeight: '1.4' }}>
          <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Thank you for choosing us!</p>
          <p style={{ margin: '4px 0' }}>We appreciate your business</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '8px', color: '#666' }}>
            Receipt #: {receiptNumber}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '8px', color: '#666' }}>
            For inquiries: +254 700 000 000
          </p>
        </div>
      </div>
    </div>
  )
}
