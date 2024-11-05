// Tremor Raw cx [v0.0.0]

import clsx from "clsx"
import { twMerge } from "tailwind-merge"
import crg from 'country-reverse-geocoding';

export function cn(...args) {
  return twMerge(clsx(...args))
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  // border color
  "focus:border-blue-500 focus:dark:border-blue-700",
]

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
]

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
]

const usdToEur = 0.92;
const usdToEgp = 50;

export const convertPrice = (price, currency) => {
  if(currency === 'USD') return price;
  if(currency === 'EUR') return (price * usdToEur).toFixed(2);
  if(currency === 'EGP') return (price * usdToEgp).toFixed(2);
  return price;
}

export const convertToUSD = (price, currency) => {
  if(currency === 'USD') return price;
  if(currency === 'EUR') return (price / usdToEur).toFixed(2);
  if(currency === 'EGP') return (price / usdToEgp).toFixed(2);
  return price;
}

const airportCodeToCity = {
  LGW: "London Gatwick",
  LHR: "London Heathrow",
  STN: "London Stansted",
  SAW: "Istanbul Sabiha Gökçen",
  DMK: "Bangkok Don Mueang",
  VCP: "Campinas",
  SSA: "Salvador",
  YVR: "Vancouver",
  ATL: "Atlanta",
  PEK: "Beijing",
  LAX: "Los Angeles",
  DXB: "Dubai",
  HND: "Tokyo",
  ORD: "Chicago",
  HKG: "Hong Kong",
  PVG: "Shanghai",
  CDG: "Paris",
  DFW: "Dallas",
  AMS: "Amsterdam",
  DEL: "Delhi",
  CAN: "Guangzhou",
  FRA: "Frankfurt",
  IST: "Istanbul",
  ICN: "Seoul",
  SIN: "Singapore",
  DEN: "Denver",
  BKK: "Bangkok",
  JFK: "New York",
  SFO: "San Francisco",
  CLT: "Charlotte",
  LAS: "Las Vegas",
  SEA: "Seattle",
  MIA: "Miami",
  MUC: "Munich",
  SYD: "Sydney",
  YYZ: "Toronto",
  IAH: "Houston",
  SCL: "Santiago",
  GRU: "São Paulo",
  MEX: "Mexico City",
  BOM: "Mumbai",
  MAD: "Madrid",
  BCN: "Barcelona",
  EZE: "Buenos Aires",
  ZRH: "Zurich",
  JNB: "Johannesburg",
  KUL: "Kuala Lumpur",
  GIG: "Rio de Janeiro",
  PHX: "Phoenix",
  BOS: "Boston",
  TLV: "Tel Aviv",
  YUL: "Montreal",
  MEL: "Melbourne",
  FCO: "Rome",
  MSP: "Minneapolis",
  ORY: "Paris",
  CPH: "Copenhagen",
  HEL: "Helsinki",
  ARN: "Stockholm",
  DUB: "Dublin",
  VIE: "Vienna",
  MAN: "Manchester",
  LIS: "Lisbon",
  DOH: "Doha",
  BNE: "Brisbane",
  OSL: "Oslo",
  ATH: "Athens",
  NRT: "Tokyo",
  SHA: "Shanghai",
  AKL: "Auckland",
  EWR: "Newark",
  YTZ: "Toronto",
  OPO: "Paris",
};

export function getCityName(code) {
  return airportCodeToCity[code] || code;
}

const cityToCountry = {
  "London": "United Kingdom",
  "New York City": "United States",
  "Paris": "France",
  "Tokyo": "Japan",
  "Madrid": "Spain",
  "Copenhagen": "Denmark",
  "London Heathrow": "United Kingdom",
  "Istanbul Sabiha Gökçen": "Turkey",
  "Bangkok Don Mueang": "Thailand",
  "Seoul Incheon": "South Korea",
  "Campinas": "Brazil",
  "Salvador": "El Salvador",
  "Buenos Aires": "Argentina",
  "Zurich": "Switzerland",
  "Johannesburg": "South Africa",
  "Kuala Lumpur": "Malaysia",
  "Rio de Janeiro": "Brazil",
  "Boston": "United States",
  "Tel Aviv": "Israel",
  "Mumbai": "India",
  "Manchester": "United Kingdom",
  "Lisbon": "Portugal",
  "Doha": "Qatar",
  "Brisbane": "Australia",
  "Oslo": "Norway",
  "Athens": "Greece",
  "Chicago": "United States",
  "Beijing": "China",
  "Los Angeles": "United States",
  "Dubai": "United Arab Emirates",
  "Tokyo": "Japan",
  "Toronto": "Canada",
  "Vancouver": "Canada",
  "Atlanta": "United States",
  "Phoenix": "United States",
  "Berlin": "Germany",
  "Barcelona": "Spain",
  "Egypt": "Egypt",
  "Rome": "Italy",
  "Zurich": "Switzerland",
  "Kuala Lumpur": "Malaysia",
  "Giza": "Egypt",
  "Phnom Penh": "Cambodia",
  "Brisbane": "Australia",
  "Sydney": "Australia",
  "Auckland": "New Zealand",
  "Montreal": "Canada",      
}

export function getCountryName(code) {
  return cityToCountry[code] || code;
}

export function getCountryFromCoordinates(latitude, longitude) {
  const reverseGeocode = crg.country_reverse_geocoding();
  try {
      const result = reverseGeocode.get_country(latitude, longitude);
      
      if (result) {
          return {
              countryName: result.name,
              countryCode: result.code,
              success: true
          };
      }
      
      return {
          countryName: null,
          countryCode: null,
          success: false,
          error: 'No country found for these coordinates'
      };
  } catch (error) {
      return {
          countryName: null,
          countryCode: null,
          success: false,
          error: error.message
      };
  }
}