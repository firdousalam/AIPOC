import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from '@/services/api/sales.service';
import { CreateSaleDto } from '@shared/types';

export function useSales() {
  return useQuery({
    queryKey: ['sales'],
    queryFn: () => salesService.getAll(),
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSaleDto) => salesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });
}

