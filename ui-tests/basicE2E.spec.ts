import { test, expect } from '@playwright/test';

test('test an end-to-end order flow', async ({ page }) => {
  const url = 'https://www.saucedemo.com/';
  const username = page.locator('[data-test="username"]');
  const password = page.locator('[data-test="password"]');
  const loginButton = page.locator('[data-test="login-button"]');
  const sortDropdown = page.locator('[data-test="product-sort-container"]');
  const highValueItemAddButton = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
  const lowValueItemAddButton = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
  const cartLink = page.locator('[data-test="shopping-cart-link"]');
  const title = page.locator('[data-test="title"]');
  const checkoutButton = page.locator('[data-test="checkout"]');
  const firstName = page.locator('[data-test="firstName"]');
  const lastName = page.locator('[data-test="lastName"]');
  const postalCode = page.locator('[data-test="postalCode"]');
  const continueButton = page.locator('[data-test="continue"]');
  const finishButton = page.locator('[data-test="finish"]');
  const completeHeader = page.locator('[data-test="complete-header"]');
  const backToProductsButton = page.locator('[data-test="back-to-products"]');
  const menuButton = page.getByRole('button', { name: 'Open Menu' });
  const logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  // Page visit and login
  await page.goto(url);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }catch (e) {
    console.log('Error during page navigation or login:', e);
  }
  await username.click();
  await username.fill('visual_user');
  await password.click();
  await password.fill('secret_sauce');
  await loginButton.click();

  // Sort and add items to cart
  await sortDropdown.selectOption('hilo');
  await highValueItemAddButton.click();
  await sortDropdown.selectOption('lohi');
  await lowValueItemAddButton.click();

  // Go to cart and verify
  await cartLink.click();
  await expect(title).toContainText('Your Cart');

  // Proceed to checkout
  await checkoutButton.click();
  await expect(title).toContainText('Checkout: Your Information');
 
  // Fill in checkout information
  await firstName.fill('Taufiqur');
  await lastName.fill('Rahman');
  await postalCode.fill('54321');
  await continueButton.click();
  await expect(title).toContainText('Checkout: Overview');
  await finishButton.click();
  await expect(completeHeader).toContainText('Thank you for your order!');
  
  // Logout
  await backToProductsButton.click();
  await menuButton.click();
  await logoutLink.click();
});

// Run on github actions with name UI + API + LOAD Tests