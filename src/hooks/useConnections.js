import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAPI, requestAPI } from '../services/api';

// GET /user/connections → { data: [...users] }
export const useConnections = () =>
  useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const res = await userAPI.getConnections();
      return res.data.data;
    },
    retry: false,
  });

// GET /user/requests/received → { message, data: [{ _id, fromUserId, status }] }
export const useReceivedRequests = () =>
  useQuery({
    queryKey: ['receivedRequests'],
    queryFn: async () => {
      const res = await userAPI.getReceivedRequests();
      return res.data.data;
    },
    retry: false,
  });

// POST /request/review/:status/:requestId
export const useReviewRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ status, requestId }) => requestAPI.review(status, requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receivedRequests'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};
