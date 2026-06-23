import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMembership, useCreateOrder, useVerifyPayment } from '../../hooks/usePayment';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import Loader from '../../components/common/Loader/Loader';
import styles from './Membership.module.css';

const PLANS = [
  {
    type: 'silver',
    name: 'Silver',
    price: 300,
    color: 'var(--color-silver)',
    variant: 'silver',
    features: ['50 connections per day', 'See who liked you', 'Priority in feed', 'Silver badge on profile'],
  },
  {
    type: 'gold',
    name: 'Gold',
    price: 500,
    color: 'var(--color-gold)',
    variant: 'gold',
    features: ['Unlimited connections', 'See who liked you', 'Top of feed ranking', 'Gold badge on profile', 'Super likes (5/day)'],
  },
];

const loadStripeJS = () =>
  new Promise((resolve, reject) => {
    if (window.Stripe) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://js.stripe.com/v3/';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(s);
  });

const PaymentModal = ({ plan, onClose, onSuccess }) => {
  const cardDivRef = useRef(null);
  const stripeRef  = useRef(null);
  const cardElRef  = useRef(null);
  const createOrder  = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const [step, setStep] = useState('loading');
  const [clientSecret, setClientSecret] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    createOrder.mutateAsync({ membershipType: plan.type })
      .then((data) => { setClientSecret(data.clientSecret); setStep('form'); })
      .catch(() => { setErrMsg('Could not create order. Please try again.'); setStep('error'); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!clientSecret || !cardDivRef.current) return;
    let stale = false;
    loadStripeJS()
      .then(() => {
        if (stale) return;
        stripeRef.current = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        const elements = stripeRef.current.elements();
        cardElRef.current = elements.create('card', {
          style: { base: { color: 'var(--color-text-primary)', fontSize: '16px', '::placeholder': { color: 'var(--color-text-muted)' } } },
        });
        cardElRef.current.mount(cardDivRef.current);
      })
      .catch(() => { if (!stale) { setErrMsg('Payment SDK failed to load.'); setStep('error'); } });
    return () => { stale = true; cardElRef.current?.unmount(); cardElRef.current = null; };
  }, [clientSecret]);

  const handlePay = async () => {
    if (!stripeRef.current || !cardElRef.current) return;
    setStep('processing');
    const { error, paymentIntent } = await stripeRef.current.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElRef.current },
    });
    if (error) { setErrMsg(error.message); setStep('form'); return; }
    try {
      await verifyPayment.mutateAsync({ paymentIntentId: paymentIntent.id, membershipType: plan.type });
      setStep('success');
      setTimeout(onSuccess, 1500);
    } catch {
      setErrMsg(`Payment done but activation failed. ID: ${paymentIntent.id}`);
      setStep('error');
    }
  };

  const showForm = step === 'form' || step === 'processing';

  return (
    <Modal onClose={step !== 'processing' ? onClose : undefined} closeOnOverlay={step !== 'processing'}>
      <h3 className={styles.modalLabel} style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-6)', color: plan.color }}>
        {plan.name} Membership — ₹{plan.price}
      </h3>

      {step === 'loading' && <p className={styles.modalMuted}>Preparing payment…</p>}

      <div style={{ display: showForm ? 'block' : 'none' }}>
        <p className={styles.modalLabel}>Card details</p>
        <div ref={cardDivRef} className={styles.cardEl} />
        {errMsg && <p className={styles.modalError}>{errMsg}</p>}
        <div className={styles.modalActions}>
          <Button onClick={handlePay} disabled={step === 'processing'} fullWidth style={{ opacity: step === 'processing' ? 0.65 : 1 }}>
            {step === 'processing' ? 'Processing…' : `Pay ₹${plan.price}`}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={step === 'processing'}>Cancel</Button>
        </div>
      </div>

      {step === 'success' && <p className={styles.modalSuccess}>✓ Payment successful! Activating membership…</p>}

      {step === 'error' && (
        <>
          <p className={styles.modalError}>{errMsg}</p>
          <Button variant="secondary" onClick={onClose} style={{ marginTop: 'var(--sp-4)' }}>Close</Button>
        </>
      )}
    </Modal>
  );
};

const PlanCard = ({ plan, currentType, isPremium, onBuy }) => {
  const isCurrent = isPremium && currentType?.toLowerCase() === plan.type;
  const isUpgrade = isPremium && plan.type === 'gold' && currentType?.toLowerCase() === 'silver';

  return (
    <div className={styles.planCard} style={{ borderColor: plan.color }}>
      <span className={styles.planBadge} style={{ background: plan.color }}>{plan.name}</span>
      <div className={styles.price}>₹{plan.price}<span className={styles.pricePer}> / lifetime</span></div>
      <ul className={styles.featureList}>
        {plan.features.map((f) => <li key={f} className={styles.feature}>✓ {f}</li>)}
      </ul>
      {isCurrent ? (
        <div className={styles.activePill} style={{ borderColor: plan.color, color: plan.color }}>Active Plan ✓</div>
      ) : (
        <Button variant={plan.variant} onClick={() => onBuy(plan)} fullWidth>
          {isUpgrade ? 'Upgrade to Gold' : `Get ${plan.name}`}
        </Button>
      )}
    </div>
  );
};

const MembershipPage = () => {
  const { isLoading } = useMembership();
  const { isPremium, membershipType } = useSelector((s) => s.membership);
  const [activePlan, setActivePlan] = useState(null);
  const { showToast } = useNotification();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Choose Your Plan</h1>
      <p className={styles.sub}>Unlock premium features and stand out on DevTinder</p>

      {isLoading ? <Loader size="md" /> : (
        <>
          {isPremium && (
            <div className={styles.banner}>
              👑 You have an active <strong style={{ textTransform: 'capitalize' }}>{membershipType}</strong> membership
            </div>
          )}
          <div className={styles.cards}>
            {PLANS.map((plan) => (
              <PlanCard key={plan.type} plan={plan} currentType={membershipType} isPremium={isPremium} onBuy={setActivePlan} />
            ))}
          </div>
        </>
      )}

      {activePlan && (
        <PaymentModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onSuccess={() => { setActivePlan(null); showToast('🎉 Membership activated!'); }}
        />
      )}
    </div>
  );
};

export default MembershipPage;
