import axios from 'axios';
import { getCookie } from 'cookies-next';
import useSWR, { type SWRResponse } from 'swr';

type Product = { last_name?: string; [key: string]: unknown };

// Create a custom SWR hook for a specific endpoint
export default function useProducts(): SWRResponse<Product[]> {
  return useSWR<Product[]>(
    '/products',
    async () =>
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        ? (
            await axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_URI}/v1/products`, {
              headers: {
                Authorization: `Bearer ${getCookie('jwt')}`,
              },
            })
          ).data
            .map((x: Product) => ({ ...x }))
            .sort((a: Product, b: Product) => ((a.last_name ?? '') > (b.last_name ?? '') ? 1 : -1))
        : [],
    {
      fallbackData: [],
    },
  );
}
