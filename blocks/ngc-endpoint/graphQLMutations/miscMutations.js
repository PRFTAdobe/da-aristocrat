import { utilities } from "./utility.js";

//get countries
const getCountries = async () => {
    const query = JSON.stringify({
      query: `query {countries { id two_letter_abbreviation three_letter_abbreviation full_name_locale full_name_english available_regions { id code name } } }`,
      variables: {},
    });
  
    const response = await utilities.fetchRequests(utilities.GRAPHQL_ENDPOINT, 'POST', utilities.HEADERS, query);
  
    return response.data.countries;
}

//get regions
const getRegionsByCountry = async (countryId) => {
    const query = JSON.stringify({
      query: `query { country(id: "${countryId}") { id full_name_english available_regions { id code name } } }`,
      variables: {},
    });
  
    const response = await utilities.fetchRequests(utilities.GRAPHQL_ENDPOINT, 'POST', utilities.HEADERS, query);
  
    return response.data.country.available_regions;
}

// getter setter - cartID on Local storage
export const getCartIDFromLS = () => localStorage.getItem("shoppingCartID");
const setCartIDtoLS = (cartID) => localStorage.setItem("shoppingCartID", cartID);
const removeCartIDFromLS = () => localStorage.removeItem("shoppingCartID");

export const miscMutations = {
  getCountries,
  getRegionsByCountry,
  getCartIDFromLS,
  setCartIDtoLS,
  removeCartIDFromLS
} 