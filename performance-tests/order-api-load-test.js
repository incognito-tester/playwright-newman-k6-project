import http from 'k6/http';
import {check, sleep} from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export let options = {
    vus: 10,
    duration: '20s',
};

// Base URL and Endpoints
const BASE_URL = 'https://simple-grocery-store-api.click';
const AUTH = '/api-clients';
const PRODUCTS = '/products';
const CART = '/carts';
const ORDERS = '/orders';
export default function () {
    // Create unique clientName and Email to pass each AUTH API call
    let unique_client_name = `Client_${__VU}_${Date.now()}`;
    let unique_email = `user$${__VU}_${Math.floor(Math.random() * 100000)}@example.com`;

    // Registration API Call
    let authPayload = JSON.stringify({
        clientName: unique_client_name,
        clientEmail: unique_email,
    });

    let authResponse = http.post(`${BASE_URL}${AUTH}`, authPayload, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    check(authResponse, {
        'is status 201': (r) => r.status === 201,
        'is response not empty': (r) => r.body.length > 0,
    });
    let authToken = authResponse.json('accessToken'); // Extract access token

    // Get Products API Call
    let productsResponse = http.get(`${BASE_URL}${PRODUCTS}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    check(productsResponse, {
        'is status 200': (r) => r.status === 200,
        'is products list not empty': (r) => r.json().length > 0,
    });
    let products = productsResponse.json();
    // Select a random product if stock is available
    let availableProducts = products.filter(product => product.inStock == true);
    //let index = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    let productId = availableProducts[0].id; // Get product ID

    // // Create Cart API Call
    let cartResponse = http.post(`${BASE_URL}${CART}`, null, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    check(cartResponse, {
        'is status 201': (r) => r.status === 201,
        'is cart created': (r) => r.json('cartId') !== null,
    });
    let cartId = cartResponse.json('cartId'); // Extract cart ID

    // Add Item to Cart API Call
    let addToCartPayload = JSON.stringify({
        productId: productId,
    });
    let addToCartResponse = http.post(`${BASE_URL}${CART}/${cartId}/items`, addToCartPayload, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    check(addToCartResponse, {
        'is status 201': (r) => r.status === 201,
        'is item added to cart': (r) => r.json('created') === true,
    });
    // let itemId = addToCartResponse.json('itemId'); // Extract item ID

    // Create Order API Call
    let uniqueCustomerName = `Customer_${__VU}_${Date.now()}`;
    let createOrderPayload = JSON.stringify({
        cartId: cartId,
        customerName: uniqueCustomerName,
    });
    let createOrderResponse = http.post(`${BASE_URL}${ORDERS}`, createOrderPayload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Use the extracted token
        },
    });

    // Validate if order is created successfully with an order ID
    check(createOrderResponse, {
        'is status 201': (r) => r.status === 201,
        'is order created': (r) => r.json('orderId') !== null,
    });

    sleep(1) 
}

export function handleSummary(data) {
    return {
        'k6-report/index.html': htmlReport(data),
    };
}