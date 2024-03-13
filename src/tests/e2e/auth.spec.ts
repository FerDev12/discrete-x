import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

function createTestData() {
  const identifier = randomBytes(4).toString('hex');
  const testData = {
    username: identifier,
    email: identifier + '+clerk_test@test.com',
    password: identifier,
  };
  return testData;
}

const otpCode = 424242;

test('Normal authentication flow', async ({ page }) => {
  // Make sure user is not logged in
  const userBtn = page.getByTestId('btn-user');
  await expect(userBtn).toBeHidden();

  // Go to signup page
  await page.goto('/signup');

  // Create test data
  const testData = createTestData();

  // Sign In
  await page.getByLabel('Username').fill(testData.username);
  await page.getByLabel('Email').fill(testData.email);
  await page.getByLabel('Password', { exact: true }).fill(testData.password);
  await page.getByLabel('Confirm Password').fill(testData.password);
  await page.getByRole('button', { name: 'Continue' }).click();
  await page
    .getByTestId('otp-code')
    .filter({ hasNot: page.getByTestId('otp-code') })
    .fill(`${otpCode}`);
  await page.getByRole('button', { name: 'Verify' }).click();
  const heroTitle = page.getByRole('heading', { level: 1, name: 'Discrete X' });
  await expect(heroTitle).toBeVisible();
  await expect(userBtn).toBeVisible();

  // Logout
  await userBtn.click();
  const logoutBtn = page.getByTestId('btn-logout');
  await logoutBtn.click();
  await expect(userBtn).toBeHidden();

  // Login
  await page.getByLabel('Email or Username').fill(testData.email);
  await page.getByLabel('Password').fill(testData.password);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(userBtn).toBeVisible();
  await expect(heroTitle).toBeVisible();
});
