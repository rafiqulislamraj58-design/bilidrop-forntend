import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, MapPin, Phone, ShieldCheck, X } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosInstance from '../api/axiosInstance';

export default function CheckoutModal({ book, isOpen, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    phone: '+880 1711-223344',
    address: 'House 42, Road 11, Block D, Dhanmondi, Dhaka',
  });

  if (!isOpen || !book) return null;

  const totalFee = (book.rentalFee || 0) + (book.depositFee || 0);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    setErrorMessage('');

    try {

      const { data } = await axiosInstance.post('/payments/create-payment-intent', {
        amount: totalFee,
        bookId: book._id,
      });

      const clientSecret = data.clientSecret;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        setErrorMessage(paymentResult.error.message);
        setProcessing(false);
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
     
        await axiosInstance.post('/deliveries', {
          bookId: book._id,
          bookTitle: book.title,
          rentalFee: book.rentalFee,
          depositFee: book.depositFee,
          transactionId: paymentResult.paymentIntent.id,
          phone: formData.phone,
          deliveryAddress: formData.address,
        });

        setProcessing(false);
        onClose();
        
        Swal.fire({
          title: 'Payment Successful!',
          text: `Your rental order for "${book.title}" has been confirmed!`,
          icon: 'success',
          confirmButtonColor: '#4f46e5',
        });

        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setProcessing(false);
      setErrorMessage(err.response?.data?.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-base-100 border border-base-300 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
     {/* Modal Header */}
        <div className="p-5 border-b border-base-200 flex justify-between items-center bg-base-200/50">
          <div className="flex items-center gap-2">
            <CreditCard className="text-primary" size={20} />
            <h3 className="font-extrabold text-lg">Confirm Rental Payment</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
          
        
          <div className="bg-base-200/60 p-4 rounded-2xl space-y-2 text-xs">
            <div className="font-bold text-sm text-base-content border-b border-base-300 pb-2 flex justify-between items-center">
              <span className="truncate max-w-[250px]">{book.title}</span>
              <span className="badge badge-primary badge-outline text-[11px] font-mono">7 Days Rental</span>
            </div>
            <div className="flex justify-between text-base-content/70">
              <span>Rental Charge:</span>
              <span className="font-semibold">${book.rentalFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base-content/70">
              <span>Refundable Security Deposit:</span>
              <span className="font-semibold">${book.depositFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-primary border-t border-base-300 pt-2">
              <span>Total Payable Now:</span>
              <span>${totalFee.toFixed(2)}</span>
            </div>
          </div>

       
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-base-content/70 tracking-wider">Delivery Information</h4>
            
            <div className="form-control">
              <label className="label label-text text-xs font-semibold py-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={15} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input input-bordered input-sm w-full pl-9 font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label label-text text-xs font-semibold py-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-base-content/50" size={15} />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered textarea-sm w-full pl-9 text-xs"
                  rows="2"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-base-content/70 tracking-wider flex items-center justify-between">
              <span>Credit / Debit Card</span>
              <span className="text-[10px] text-success flex items-center gap-1 font-mono">
                <ShieldCheck size={12} /> Encrypted by Stripe
              </span>
            </label>
            <div className="p-3.5 border border-base-300 rounded-xl bg-base-100 shadow-inner">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '14px',
                      color: '#374151',
                      '::placeholder': { color: '#9ca3af' },
                    },
                    invalid: { color: '#ef4444' },
                  },
                }}
              />
            </div>
            {errorMessage && <p className="text-xs text-error font-semibold mt-1">{errorMessage}</p>}
          </div>

       
          <button
            type="submit"
            disabled={!stripe || processing}
            className="btn btn-primary w-full gap-2 text-sm shadow-md"
          >
            {processing ? (
              <>
                <span className="loading loading-spinner loading-xs"></span> Processing Payment...
              </>
            ) : (
              <>Pay ${totalFee.toFixed(2)} & Complete Order</>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}