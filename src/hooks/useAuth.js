import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authAPI, profileAPI } from '../services/api';
import { setUser, clearUser } from '../store/slices/authSlice';

export const useProfile = () => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileAPI.get();
      dispatch(setUser(res.data));
      return res.data;
    },
    retry: false,
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (res) => {
      dispatch(setUser(res.data));
      queryClient.invalidateQueries(['profile']);
      navigate('/feed');
    },
  });
};

export const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authAPI.signup,
    onSuccess: (res) => {
      dispatch(setUser(res.data.data));
      navigate('/feed');
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      navigate('/login');
    },
  });
};
