//global vars
const GRAPHQL_ENDPOINT = "https://dev-54ta5gq-f3ef32mfqsxfe.us-4.magentosite.cloud/graphql";
// const GRAPHQL_ENDPOINT = "https://master-7rqtwti-f3ef32mfqsxfe.us-4.magentosite.cloud/graphql";
const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

const fetchRequests = async (url, method, headers, body) => {
    const requestOptions = {
      method,
      headers,
      body,
      redirect: 'follow',
    };
    const response = await fetch(url, requestOptions);
    return await response.json();
}

export const utilities = {
    GRAPHQL_ENDPOINT,
    HEADERS,
    fetchRequests,
  };