import apiClient from './apiClient';
import type { AddressDto } from './models/AddressDto';

const baseUrl = 'https://du-mock-checkout-7d42d0a76fbf.herokuapp.com';

//ADDRESS
export const getAddressList = async (): Promise<Array<AddressDto>> => {
  const response = await apiClient.get<Array<AddressDto>>(`${baseUrl}/api/Address`);
  return response.data;
};

export const addAddress = async (
  id: string, addressLine1: string, addressLine2: string, city: string, 
  state: string, zipCode: string, country: string, saved: boolean
): Promise<AddressDto> => {
  const response = await apiClient.post<AddressDto>(`${baseUrl}/api/Adress`, {
    id, addressLine1, addressLine2, city, state, zipCode, country, saved
  });
  return response.data;
};

export const getAddress = async (id: string): Promise<AddressDto> => {
  const response = await apiClient.get<AddressDto>(`${baseUrl}/api/Address/${id}`);
  return response.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  const response = await apiClient.delete<void>(`${baseUrl}/api/Address/${id}`);
  return response.data;
};

export const replaceAddress = async (id: string, addressLine1: string, addressLine2: string, city: string, 
  state: string, zipCode: string, country: string, saved: boolean): Promise<void> => {
  const response = await apiClient.patch<void>(`${baseUrl}/api/Address/${id}`, {
    id, addressLine1, addressLine2, city, state, zipCode, country, saved
  });
  return response.data;
};

export const selectAddress = async (id: string): Promise<void> => {
  const response = await apiClient.put<void>(`${baseUrl}/api/Address/select/${id}`);
  return response.data;
};

export const getCountriesList = async (): Promise<Array<string>> => {
  const response = await apiClient.get<Array<string>>(`${baseUrl}/api/Address/countries`);
  return response.data;
};

export const getStatesList = async (country: string): Promise<Array<string>> => {
  const response = await apiClient.get<Array<string>>(`${baseUrl}/api/Address/states/${country}`);
  return response.data;
};

// //CART

// //ORDER

// //PAYMENT
