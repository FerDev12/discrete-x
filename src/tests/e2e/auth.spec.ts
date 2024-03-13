import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

function createTestData() {
  const identifier = randomBytes(4).toString('hex');
  const signupData = {
    username: identifier,
    email: identifier + '+clerk_test@test.com',
    password: identifier,
  };
  return signupData;
}

const otpCode = 424242;

test.describe('Auth flow', () => {
  test('Signup flow', async ({ page }) => {
    const userBtn = page.getByTestId('btn-user');
    await expect(userBtn).toBeHidden();

    // Go to signup page
    await page.goto('/signup');

    const signupData = createTestData();

    await page.getByLabel('Username').fill(signupData.username);
    await page.getByLabel('Email').fill(signupData.email);
    await page
      .getByLabel('Password', { exact: true })
      .fill(signupData.password);
    await page.getByLabel('Confirm Password').fill(signupData.password);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page
      .getByTestId('otp-code')
      .filter({ hasNot: page.getByTestId('otp-code') })
      .fill(`${otpCode}`);

    await page.getByRole('button', { name: 'Verify' }).click();

    const heroTitle = page.getByRole('heading', { level: 1 });
    expect(await heroTitle.textContent()).toBe('Discreet X');
    await expect(userBtn).toBeVisible();
  });

  test('Signout flow', async ({ page }) => {
    const userBtn = page.getByTestId('btn-user');
    await expect(userBtn).toBeHidden();

    // SIGNUP
    const signupData = createTestData();
    await page.goto('/signup');
    await page.getByLabel('Username').fill(signupData.username);
    await page.getByLabel('Email').fill(signupData.email);
    await page
      .getByLabel('Password', { exact: true })
      .fill(signupData.password);
    await page.getByLabel('Confirm Password').fill(signupData.password);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page
      .getByTestId('otp-code')
      .filter({ hasNot: page.getByTestId('otp-code') })
      .fill(`${otpCode}`);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(userBtn).toBeVisible();

    // LOGOUT
    await userBtn.click();
    const logoutBtn = page.getByTestId('logout');
    await logoutBtn.click();
    await expect(userBtn).toBeHidden();
  });

  test('Login flow', async ({ page }) => {
    const userBtn = page.getByTestId('btn-user');
    await expect(userBtn).toBeHidden();

    // SIGNUP
    const signupData = createTestData();
    await page.goto('/signup');
    await page.getByLabel('Username').fill(signupData.username);
    await page.getByLabel('Email').fill(signupData.email);
    await page
      .getByLabel('Password', { exact: true })
      .fill(signupData.password);
    await page.getByLabel('Confirm Password').fill(signupData.password);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page
      .getByTestId('otp-code')
      .filter({ hasNot: page.getByTestId('otp-code') })
      .fill(`${otpCode}`);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(userBtn).toBeVisible();

    // LOGOUT
    await userBtn.click();
    const logoutBtn = page.getByTestId('logout');
    await logoutBtn.click();
    await expect(userBtn).toBeHidden();

    // LOGIN
    await page.getByLabel('Email or Username').fill(signupData.email);
    await page.getByLabel('Password').fill(signupData.password);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(userBtn).toBeVisible();
  });
});
