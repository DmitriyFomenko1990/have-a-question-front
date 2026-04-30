import { expect, test, type Route } from 'playwright/test'

const user = {
  id: 1,
  email: 'user@example.com',
  username: 'user',
  is_email_verified: true,
  date_joined: '2026-04-30T00:00:00Z',
  created_at: '2026-04-30T00:00:00Z',
  updated_at: '2026-04-30T00:00:00Z',
}

const fulfillJson = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  })

test('registers, restores session, and logs out', async ({ page }) => {
  let isLoggedIn = false

  await page.route('**/api/auth/register', async (route) => {
    await fulfillJson(route, 201, user)
  })

  await page.route('**/api/auth/login', async (route) => {
    isLoggedIn = true

    await fulfillJson(route, 200, { user })
  })

  await page.route('**/api/auth/session', async (route) => {
    if (!isLoggedIn) {
      await fulfillJson(route, 401, { statusMessage: 'Unauthorized' })

      return
    }

    await fulfillJson(route, 200, { user })
  })

  await page.route('**/api/auth/logout', async (route) => {
    isLoggedIn = false

    await fulfillJson(route, 200, { success: true })
  })

  await page.goto('/en/auth')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
  await page.getByLabel('Username').fill(user.username)
  await page.getByLabel('Email').fill(user.email)
  await page.getByLabel('Password', { exact: true }).fill('password')
  await page.getByLabel('Confirm password').fill('password')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/en\/?$/)
  await expect(page.getByText(user.username, { exact: true })).toBeVisible()

  await page.reload()
  await expect(page.getByText(user.username, { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL(/\/en\/auth$/)
  await expect(page.getByRole('heading', { name: 'Sign in or create a profile' })).toBeVisible()
})
