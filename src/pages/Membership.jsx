import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMembership, useCreateOrder, useVerifyPayment } from '../hooks/usePayment';

const PLANS = [
  {
    type: 'silver',
    name: 'Silver',
    price: 300,
    color: '#C0C0C0',
    features: [
      '50 connections per day',
      'See who liked you',
      'Priority in feed',
      'Silver badge on profile',
    ],
  },
  {
    type: 'gold',
    name: 'Gold',
    price: 500,
    color: '#FFD700',
    features: [
      'Unlimited connections',
      'See who liked you',
      'Top of feed ranking',
      'Gold badge on profile',
      'Super likes (5/day)',
    ],
  },
];

const loadStripeJS = () =>
  new Promise((resolve, reject) => {
    if (window.Stripe) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });

// Keep the card div always in DOM (display:none when hidden) so the mounted
// Stripe card element survives step transitions (form → processing → form on retry).
const PaymentModal = ({ plan, onClose, onSuccess }) => {
  const cardDivRef = useRef(null);
  const stripeRef = useRef(null);
  const cardElRef = useRef(null);
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const [step, setStep] = useState('loading'); // loading | form | processing | success | error
  const [clientSecret, setClientSecret] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // Create the Stripe PaymentIntent on mount
  useEffect(() => {
    createOrder.mutateAsync({ membershipType: plan.type })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setStep('form');
      })
      .catch(() => {
        setErrMsg('Could not create order. Please try again.');
        setStep('error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mount Stripe card element once clientSecret is set (fires once)
  useEffect(() => {
    if (!clientSecret || !cardDivRef.current) return;
    let stale = false;

    loadStripeJS()
      .then(() => {
        if (stale) return;
        const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        stripeRef.current = window.Stripe(pk);
        const elements = stripeRef.current.elements();
        cardElRef.current = elements.create('card', {
          style: {
            base: {
              color: '#ffffff',
              fontSize: '16px',
              fontFamily: 'sans-serif',
              '::placeholder': { color: '#777777' },
            },
          },
        });
        cardElRef.current.mount(cardDivRef.current);
      })
      .catch(() => {
        if (!stale) {
          setErrMsg('Failed to load payment SDK. Check your connection.');
          setStep('error');
        }
      });

    return () => {
      stale = true;
      cardElRef.current?.unmount();
      cardElRef.current = null;
    };
  }, [clientSecret]);

  const handlePay = async () => {
    if (!stripeRef.current || !cardElRef.current) return;
    setStep('processing');
    setErrMsg('');

    const { error, paymentIntent } = await stripeRef.current.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElRef.current } }
    );

    if (error) {
      setErrMsg(error.message);
      setStep('form');
      return;
    }

    try {
      await verifyPayment.mutateAsync({
        paymentIntentId: paymentIntent.id,
        membershipType: plan.type,
      });
      setStep('success');
      setTimeout(onSuccess, 1500);
    } catch {
      setErrMsg(`Payment received but activation failed. Contact support. ID: ${paymentIntent.id}`);
      setStep('error');
    }
  };

  const showForm = step === 'form' || step === 'processing';

  return (
    <div style={mS.overlay} onClick={(e) => { if (e.target === e.currentTarget && step !== 'processing') onClose(); }}>
      <div style={mS.box}>
        <h3 style={mS.title}>
          <span style={{ color: plan.color }}>{plan.name}</span> Membership — ₹{plan.price}
        </h3>

        {step === 'loading' && <p style={mS.muted}>Preparing payment…</p>}

        {/* Keep in DOM always so the mounted card element survives step changes */}
        <div style={{ display: showForm ? 'block' : 'none' }}>
          <p style={mS.label}>Card details</p>
          <div ref={cardDivRef} style={mS.cardEl} />
          {errMsg && <p style={mS.err}>{errMsg}</p>}
          <div style={mS.row}>
            <button
              onClick={handlePay}
              disabled={step === 'processing'}
              style={{ ...mS.payBtn, opacity: step === 'processing' ? 0.65 : 1 }}
            >
              {step === 'processing' ? 'Processing…' : `Pay ₹${plan.price}`}
            </button>
            <button
              onClick={onClose}
              disabled={step === 'processing'}
              style={mS.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>

        {step === 'success' && (
          <p style={mS.success}>✓ Payment successful! Activating your membership…</p>
        )}

        {step === 'error' && (
          <div>
            <p style={mS.err}>{errMsg}</p>
            <button onClick={onClose} style={mS.cancelBtn}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

const mS = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  box: {
    background: '#16213e', borderRadius: '12px', padding: '32px',
    width: '420px', maxWidth: '92vw', color: '#fff',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  title: { margin: '0 0 24px', fontSize: '20px', fontWeight: 'bold' },
  muted: { color: '#aaa', textAlign: 'center', padding: '20px 0' },
  label: { color: '#aaa', fontSize: '13px', marginBottom: '8px' },
  cardEl: {
    background: '#0f3460', border: '1px solid #334466',
    borderRadius: '6px', padding: '14px 12px', minHeight: '42px',
  },
  err: { color: '#e94560', fontSize: '13px', marginTop: '10px' },
  success: { color: '#4caf50', textAlign: 'center', fontSize: '16px', padding: '20px 0' },
  row: { display: 'flex', gap: '10px', marginTop: '20px' },
  payBtn: {
    flex: 1, background: '#e94560', color: '#fff', border: 'none',
    padding: '12px', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '15px',
  },
  cancelBtn: {
    background: '#2a2a4a', color: '#fff', border: 'none',
    padding: '12px 18px', borderRadius: '6px', cursor: 'pointer',
  },
};

const PlanCard = ({ plan, currentType, isPremium, onBuy }) => {
  const isCurrent = isPremium && currentType?.toLowerCase() === plan.type;
  const isUpgrade = isPremium && plan.type === 'gold' && currentType?.toLowerCase() === 'silver';

  return (
    <div style={{ ...pS.card, borderColor: plan.color }}>
      <span style={{ ...pS.planBadge, background: plan.color }}>{plan.name}</span>
      <div style={pS.price}>
        ₹{plan.price}
        <span style={pS.period}> / lifetime</span>
      </div>
      <ul style={pS.list}>
        {plan.features.map((f) => (
          <li key={f} style={pS.item}>✓ {f}</li>
        ))}
      </ul>
      {isCurrent ? (
        <div style={{ ...pS.activePill, borderColor: plan.color, color: plan.color }}>
          Active Plan ✓
        </div>
      ) : (
        <button
          onClick={() => onBuy(plan)}
          style={{ ...pS.buyBtn, background: plan.color }}
        >
          {isUpgrade ? 'Upgrade to Gold' : `Get ${plan.name}`}
        </button>
      )}
    </div>
  );
};

const pS = {
  card: {
    background: '#16213e', border: '2px solid', borderRadius: '16px',
    padding: '28px 24px', width: '280px', color: '#fff',
    display: 'flex', flexDirection: 'column', gap: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  planBadge: {
    display: 'inline-block', padding: '4px 16px', borderRadius: '20px',
    color: '#111', fontWeight: 'bold', fontSize: '14px', alignSelf: 'flex-start',
  },
  price: { fontSize: '34px', fontWeight: 'bold' },
  period: { fontSize: '14px', fontWeight: 'normal', color: '#aaa' },
  list: {
    listStyle: 'none', padding: 0, margin: 0,
    display: 'flex', flexDirection: 'column', gap: '10px', flex: 1,
  },
  item: { color: '#ccc', fontSize: '14px' },
  buyBtn: {
    border: 'none', padding: '12px', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', color: '#111',
    marginTop: 'auto',
  },
  activePill: {
    border: '2px solid', borderRadius: '8px', padding: '10px',
    textAlign: 'center', fontWeight: 'bold', marginTop: 'auto',
  },
};

const MembershipPage = () => {
  const { isLoading } = useMembership();
  const { isPremium, membershipType } = useSelector((s) => s.membership);
  const [activePlan, setActivePlan] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div style={pgS.wrap}>
      <h1 style={pgS.heading}>Choose Your Plan</h1>
      <p style={pgS.sub}>Unlock premium features and stand out on DevTinder</p>

      {toast && <div style={pgS.toast}>{toast}</div>}

      {isLoading ? (
        <p style={pgS.muted}>Loading…</p>
      ) : (
        <>
          {isPremium && (
            <div style={pgS.premiumBanner}>
              👑 You have an active <strong style={{ textTransform: 'capitalize' }}>{membershipType}</strong> membership
            </div>
          )}
          <div style={pgS.cards}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.type}
                plan={plan}
                currentType={membershipType}
                isPremium={isPremium}
                onBuy={setActivePlan}
              />
            ))}
          </div>
        </>
      )}

      {activePlan && (
        <PaymentModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onSuccess={() => {
            setActivePlan(null);
            showToast('🎉 Membership activated successfully!');
          }}
        />
      )}
    </div>
  );
};

const pgS = {
  wrap: {
    minHeight: '80vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px', background: '#0f0f23',
  },
  heading: { color: '#fff', fontSize: '36px', margin: '0 0 8px', textAlign: 'center' },
  sub: { color: '#aaa', margin: '0 0 40px', textAlign: 'center' },
  muted: { color: '#aaa' },
  premiumBanner: {
    background: '#1a1a3e', border: '1px solid #FFD700', borderRadius: '8px',
    padding: '12px 24px', color: '#FFD700', marginBottom: '32px', fontSize: '15px',
  },
  cards: { display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' },
  toast: {
    position: 'fixed', top: '72px', left: '50%', transform: 'translateX(-50%)',
    background: '#4caf50', color: '#fff', padding: '12px 28px',
    borderRadius: '8px', fontWeight: 'bold', zIndex: 2000, fontSize: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
  },
};

export default MembershipPage;
