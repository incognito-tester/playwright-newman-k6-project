import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js';
import { browser } from 'k6/browser';
import http from 'k6/http';

export function protocolTest() {
  // Get the home page of k6's Quick Pizza app
  const response = http.get('https://quickpizza.grafana.com/');

  // Simple assertions
  expect(response.status).toBe(200);
  expect(response.error).toEqual('');
  expect(response.body).toBeDefined();
}

export async function browserTest() {
  const page = await browser.newPage();

  try {
    await page.goto('https://quickpizza.grafana.com/');

    // Assert the "Pizza Please" button is visible
    await expect(page.locator('button[name=pizza-please]')).toBeVisible();
  } finally {
    await page.close();
  }
}

export const options = {
  scenarios: {
    // Protocol tests
    protocol: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      exec: 'protocolTest',
    },

    // Browser tests
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      exec: 'browserTest',
    },
  },
};