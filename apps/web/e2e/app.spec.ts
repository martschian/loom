import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('Loom (local mode)', () => {
  test('dashboard loads and can open demo project', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Loom').first()).toBeVisible()
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

  test('can navigate to locations tab', async ({ page }) => {
    await page.goto('/')
    await page.getByText('The Ember Coast').click()
    await page.getByRole('button', { name: 'Locations' }).click()
    await expect(page.getByText('The Cinderport')).toBeVisible()
  })

  test('can create a new project from the dashboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '+ New project' }).click()
    await page.getByPlaceholder('Your story\'s title').fill('E2E Novel')
    await page.getByRole('button', { name: 'Create project' }).click()
    await expect(page.getByRole('heading', { name: 'E2E Novel' })).toBeVisible()
  })

  test('can add a scene on the timeline', async ({ page }) => {
    await page.goto('/')
    await page.getByText('The Ember Coast').click()
    await page.getByRole('button', { name: '+ Add scene' }).click()
    await page.getByPlaceholder('e.g. The Storm Breaks').fill('E2E Test Scene')
    await page
      .getByRole('button', { name: 'Add scene', exact: true })
      .click()
    await expect(page.getByText('E2E Test Scene')).toBeVisible()
  })
})
