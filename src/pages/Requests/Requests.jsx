import { useReceivedRequests, useReviewRequest } from '../../hooks/useConnections';
import Loader from '../../components/common/Loader/Loader';
import styles from './Requests.module.css';

const RequestCard = ({ request, onReview, isPending }) => {
  const user = request.fromUserId;
  const tier = user.membershipType?.toLowerCase();

  return (
    <div className={styles.card}>
      <img src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} className={styles.photo} />
      <div className={styles.info}>
        <h3 className={styles.name}>
          {user.firstName} {user.lastName}
          {user.isPremium && tier && (
            <span className={`${styles.badge} ${styles[`badge--${tier}`]}`}>
              {tier === 'gold' ? '👑' : '✦'} {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </span>
          )}
        </h3>
        {user.age && user.gender && <p className={styles.meta}>{user.age} · {user.gender}</p>}
        {user.about && <p className={styles.about}>{user.about}</p>}
        {user.skills?.length > 0 && (
          <div className={styles.skills}>
            {user.skills.map((s) => <span key={s} className={styles.skill}>{s}</span>)}
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <button disabled={isPending} className={`${styles.btn} ${styles.btnReject}`} onClick={() => onReview('rejected', request._id)}>Reject</button>
        <button disabled={isPending} className={`${styles.btn} ${styles.btnAccept}`} onClick={() => onReview('accepted', request._id)}>Accept</button>
      </div>
    </div>
  );
};

const Requests = () => {
  const { data: requests, isLoading, isError } = useReceivedRequests();
  const review = useReviewRequest();

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Connection Requests</h1>

      {isLoading && <Loader size="lg" />}
      {isError   && <p className={styles.err}>Failed to load requests.</p>}

      {!isLoading && !isError && requests?.length === 0 && (
        <p className={styles.empty}>No pending requests right now.</p>
      )}

      {requests?.length > 0 && (
        <div className={styles.grid}>
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              onReview={(status, id) => review.mutate({ status, requestId: id })}
              isPending={review.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
