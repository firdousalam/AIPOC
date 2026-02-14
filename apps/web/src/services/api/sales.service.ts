import apiClient from './client';
import { Sale, CreateSaleDto } from '@shared/types';

export const salesService = {
  getAll: async (): Promise<Sale[]> => {
    const response = await apiClient.get('/sales');
    return response.data;
  },

  getById: async (id: string): Promise<Sale> => {
    const response = await apiClient.get(`/sales/${id}`);
    return response.data;
  },

  create: async (data: CreateSaleDto): Promise<Sale> => {
    const response = await apiClient.post('/sales', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateSaleDto>): Promise<Sale> => {
    const response = await apiClient.patch(`/sales/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sales/${id}`);
  },
};

