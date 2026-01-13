import { useQuery, useMutation } from "@tanstack/react-query";
import { MOCK_SHIPPING_OPTIONS } from "@/constants/compareOptionsResults";
import  submitCompareOptions  from "@/services/CompareOptionsService";

/**
 * Fetch shipping options
 */
const fetchShippingOptions = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return MOCK_SHIPPING_OPTIONS;
};

/**
 * Hook to submit compare options form
 */
export const useSubmitCompareOptions = () => {
  return useMutation({
    mutationFn: submitCompareOptions,
  });
};

/**
 * Hook to fetch shipping options
 */
export const useShippingOptions = () => {
  return useQuery({
    queryKey: ["shipping-options"],
    queryFn: fetchShippingOptions,
    enabled: false, // Only fetch when explicitly called
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
