// /**
//  * Location Code Mapper - Converts city/country to official UN/LOCODEs
//  */

// // Official UN/LOCODE Data Mapping
// const UN_LOCODE_DB = {
//   "US": { "los angeles": "USLAX", "la": "USLAX", "new york": "USNYC", "long beach": "USLGB", "savannah": "USSAV", "houston": "USHTX", "seattle": "USTAC", "miami": "USMIA", "chicago": "USCHI", "charleston": "USCHS", "oakland": "USOAK", "norfolk": "USORF" },
//   "MA": { "casablanca": "MACAS", "tanger": "MATNG", "tangier": "MATNG", "tanger med": "MATNG", "agadir": "MAAGA", "jorf lasfar": "MAJFL", "kenitra": "MAKEN", "nador": "MANDR", "safi": "MASFI" },
//   "DE": { "hamburg": "DEHAM", "bremerhaven": "DEBRE", "wilhelmshaven": "DEWVN", "duisburg": "DEDUI", "rostock": "DEROS" },
//   "CN": { "shanghai": "CNSHA", "shenzhen": "CNSZX", "guangzhou": "CNGZH", "ningbo": "CNNGB", "qingdao": "CNTAO", "tianjin": "CNTJN", "xiamen": "CNXMN", "dalian": "CNDLN", "shekou": "CNSHK" },
//   "SG": { "singapore": "SGSIN" },
//   "AE": { "dubai": "AEDXB", "jebel ali": "AEJAL", "abu dhabi": "AEAUH", "sharjah": "AESHJ", "khor fakkan": "AEKFK" },
//   "GB": { "london": "GBLON", "southampton": "GBSOU", "felixstowe:": "GBFXT", "liverpool": "GBLIV", "grangemouth": "GBGRG" },
//   "NL": { "rotterdam": "NLRTM", "amsterdam": "NLAMS", "moerdijk": "NLMOE" },
//   "BE": { "antwerp": "BEANR", "zeebrugge": "BEZEE", "ostend": "BEOST" },
//   "FR": { "marseille": "FRMRS", "le havre": "FRLEH", "fos sur mer": "FRFOS", "dunkerque": "FRDKK", "bordeaux": "FRBOD" },
//   "ES": { "barcelona": "ESBCN", "valencia": "ESVLC", "algeciras": "ESALG", "bilbao": "ESBIO", "las palmas": "ESLPA" },
//   "IT": { "genoa": "ITGOA", "la spezia": "ITSPE", "trieste:": "ITTRS", "naples": "ITNAP", "livorno": "ITLIV" },
//   "IN": { "mumbai": "INBOM", "nhava sheva": "INNSA", "mundra": "INMUN", "chennai": "INMAA", "kolkata": "INCCU" },
//   "JP": { "tokyo": "JPTYO", "yokohama": "JPYOK", "osaka": "JPOSA", "kobe": "JPUKB", "nagoya": "JPNGO" },
//   "VN": { "ho chi minh": "VNSGN", "haiphong": "VNHPH", "da nang": "VNDAD", "qui nhon": "VNUIH" },
//   "TR": { "istanbul": "TRIST", "izmir": "TRIZM", "mersin": "TRMER", "gemlik": "TRGEM", "ambarli": "TRAMB" },
//   "PA": { "colon": "PAONX", "balboa": "PABLB", "panama city": "PAPTY" },
//   "CA": { "vancouver": "CAVAN", "montreal": "CAMTR", "toronto": "CATOR", "halifax": "CAHAL" },
//   "KR": { "busan": "KRPUS", "incheon": "KRINC", "pyeongtaek": "KRPTK" },
//   "MY": { "port klang": "MYPKG", "tanjung pelepas": "MYTPP", "penang": "MYPEN" }
// };

// /**
//  * Convert country name to ISO 3166-1 alpha-2 code
//  */
// const countryNameToCode = (country) => {
//   if (!country) return null;
//   const countryMap = {
//     "united states": "US", "usa": "US", "us": "US",
//     "morocco": "MA", "ma": "MA",
//     "germany": "DE", "de": "DE",
//     "china": "CN", "cn": "CN",
//     "singapore": "SG", "sg": "SG",
//     "united arab emirates": "AE", "uae": "AE",
//     "united kingdom": "GB", "uk": "GB",
//     "netherlands": "NL", "nl": "NL",
//     "belgium": "BE", "be": "BE",
//     "france": "FR", "fr": "FR",
//     "spain": "ES", "es": "ES",
//     "italy": "IT", "it": "IT",
//     "india": "IN", "in": "IN",
//     "japan": "JP", "jp": "JP",
//     "vietnam": "VN", "vn": "VN",
//     "turkey": "TR", "tr": "TR",
//     "panama": "PA", "pa": "PA",
//     "canada": "CA", "ca": "CA",
//     "south korea": "KR", "kr": "KR",
//     "malaysia": "MY", "my": "MY"
//   };
  
//   return countryMap[country.toLowerCase().trim()] || null;
// };

// /**
//  * Get location code from city and country
//  */
// export const getLocationCode = (city, country, countryCode = null) => {
//   if (!city || !country) return null;
  
//   const cc = countryCode || countryNameToCode(country);
//   if (!cc) return null;

//   const normalizedCity = city.toLowerCase().trim();
  
//   // 1. Check official mapping
//   if (UN_LOCODE_DB[cc] && UN_LOCODE_DB[cc][normalizedCity]) {
//     return UN_LOCODE_DB[cc][normalizedCity];
//   }

//   // 2. Fallback: Systematic generation (Warning: This is a guess if not in DB)
//   const cityCode = normalizedCity.replace(/\s+/g, "").substring(0, 3).toUpperCase();
//   return `${cc}${cityCode}`;
// };

// /**
//  * Batch get location codes for origin and destination
//  */
// export const getLocationCodes = (polCity, polCountry, polCountryCode, podCity, podCountry, podCountryCode) => {
//   return {
//     polCode: getLocationCode(polCity, polCountry, polCountryCode) || "USLAX",
//     podCode: getLocationCode(podCity, podCountry, podCountryCode) || "DEHAM",
//   };
// };

// export default {
//   getLocationCode,
//   getLocationCodes,
// };