import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('Inkwell (local mode)', () => {
  test('dashboard loads and can open demo project', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Inkwell').first()).toBeVisible()
    await expect(page.getByText('The Ember Coast')).toBeVisible()
    await page.getByText('The Ember Coast').click()
    await expect(page.getByRole('heading', { name: 'The Ember Coast' })).toBeVisible()
    await expect(page.getByText('Scene timeline')).toBeVisible()
  })

  test('can navigate to characters tab', async ({ page }) => {
    await page.goto('/')
    await page.getByText('The Ember Coast').click()
    await page.getByRole('button', { name: 'Characters' }).click()
    await expect(page.getByText('Lyra Ashveil')).toBeVisible()
  })
})
