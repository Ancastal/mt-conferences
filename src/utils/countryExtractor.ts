import { Conference } from "@/types/conference";

/**
 * Extracts country from a conference place string or a conference object
 */
export function extractCountry(input: string | Conference): string | null {
  // If input is a Conference object, use its country property
  if (typeof input !== 'string') {
    return input.country || null;
  }
  
  if (!input) return null;
  
  // Extract the last part after the last comma, which is typically the country
  const parts = input.split(',');
  let country = parts[parts.length - 1].trim();
  
  // Handle special cases like "USA" which might appear in different forms
  if (['USA', 'U.S.A.', 'United States', 'United States of America'].includes(country)) {
    return 'USA';
  }
  
  // Handle "UK" variations
  if (['UK', 'U.K.', 'United Kingdom', 'England', 'Scotland', 'Wales'].includes(country)) {
    return 'UK';
  }
  
  // For places without commas, try to extract known countries
  if (parts.length === 1) {
    const knownCountries = [
      'USA', 'Canada', 'China', 'Japan', 'Germany', 'France', 'UK', 'Italy', 
      'Spain', 'Australia', 'Brazil', 'India', 'Singapore', 'South Korea', 
      'Netherlands', 'Sweden', 'Switzerland', 'Belgium', 'Austria', 'Portugal',
      'UAE', 'Thailand', 'Hawaii', 'Russia', 'Lithuania'
    ];
    
    for (const country of knownCountries) {
      if (input.includes(country)) {
        return country;
      }
    }
  }
  
  return country;
}

/**
 * Gets all unique countries from conferences data
 */
export function getAllCountries(conferences: Conference[]): string[] {
  if (!Array.isArray(conferences)) return [];
  
  const countries = new Set<string>();
  
  conferences.forEach(conf => {
    if (conf.country) {
      countries.add(conf.country);
    }
  });
  
  return Array.from(countries).sort();
} 