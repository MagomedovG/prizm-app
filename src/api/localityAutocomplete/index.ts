'use client';
import { AutocompleteResponse,ILocation } from '@/src/types';
import { useQuery } from '@tanstack/react-query';



export const useAutocomplete = (searchText: string | null, isFetch: boolean) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    return useQuery<ILocation[], Error>({
        queryKey: ['autocomplete', searchText, isFetch],
        queryFn: async () => {
            const response = await fetch(
                `${apiUrl}/api/v1/localities/get-localities-by-name/?name=${encodeURIComponent(searchText || '')}`,
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: AutocompleteResponse = await response.json();
            const combinedResults: ILocation[] = [];

            if (data.locations && data.locations.length > 0) {
                combinedResults.push(...data.locations);
            }

            if (data.regions && data.regions.length > 0) {
                combinedResults.push(...data.regions);
            }

            return combinedResults;
        },
        enabled: !!searchText && isFetch,
        staleTime: 0,
    });
};
