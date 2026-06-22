import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { feedAPI, requestAPI } from '../services/api';
import { setFeed, removeUserFromFeed } from '../store/slices/feedSlice';

export const useFeed = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const res = await feedAPI.get();
      dispatch(setFeed(res.data.data));
      return res.data;
    },
  });
};

export const useSendRequest = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ status, toUserId }) => requestAPI.send(status, toUserId),
    onSuccess: (_, variables) => {
      dispatch(removeUserFromFeed(variables.toUserId));
    },
  });
};
