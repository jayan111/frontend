import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { paymentAPI } from '../services/api';
import { setMembership } from '../store/slices/membershipSlice';

// GET /payment/membership → { firstName, lastName, email, isPremium, membershipType }
// Free users: membershipType === "free" and isPremium === false
const normalizeMembership = (data) => ({
  isPremium: data.isPremium === true,
  membershipType: data.membershipType === 'free' ? null : data.membershipType,
  expiryDate: data.expiryDate || null,
});

export const useMembership = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['membership'],
    queryFn: async () => {
      const res = await paymentAPI.getMembership();
      const normalized = normalizeMembership(res.data);
      dispatch(setMembership(normalized));
      return res.data;
    },
    retry: false,
  });
};

export const useCreateOrder = () =>
  useMutation({
    mutationFn: (data) => paymentAPI.createOrder(data).then((r) => r.data),
  });

// POST /payment/verify → { message, membershipType }
// isPremium is NOT in the response — dispatch it as true manually, then refetch profile
export const useVerifyPayment = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentAPI.verify(data).then((r) => r.data),
    onSuccess: (data) => {
      dispatch(setMembership({ isPremium: true, membershipType: data.membershipType }));
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['membership'] });
    },
  });
};
