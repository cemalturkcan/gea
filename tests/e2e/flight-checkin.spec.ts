import { test, expect } from '@playwright/test'

test.describe('flight check-in multi-step flow and surgical DOM updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.flight-checkin')).toBeVisible({ timeout: 15000 })
  })

  test('initial render shows step 1 with luggage options', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Select Luggage' })).toBeVisible()
    // Should show all 4 luggage options
    await expect(page.locator('.option-item')).toHaveCount(4)
    // Carry-on should be selected by default (first option)
    await expect(page.locator('.option-item.selected')).toHaveCount(1)
    // No Back button on step 1
    await expect(page.locator('.nav-buttons .btn-secondary')).not.toBeVisible()
  })

  test('completes full check-in flow through all 5 steps', async ({ page }) => {
    // Step 1: Luggage
    await page.getByText('1 checked bag').nth(0).click()
    await page.locator('.nav-buttons .btn-primary').click()

    // Step 2: Seat
    await expect(page.getByRole('heading', { name: 'Select Seat' })).toBeVisible()
    await expect(page.locator('.option-item')).toHaveCount(4)
    await page.getByText('Economy Plus').nth(0).click()
    await page.locator('.nav-buttons .btn-primary').click()

    // Step 3: Meal
    await expect(page.getByRole('heading', { name: 'Select Meal' })).toBeVisible()
    await expect(page.locator('.option-item')).toHaveCount(6)
    await page.getByText('Chicken').nth(0).click()
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()

    // Step 4: Summary & Payment
    await expect(page.getByRole('heading', { name: 'Review & Payment' })).toBeVisible()
    await expect(page.locator('.summary-row')).toHaveCount(5) // base + luggage + seat + meal + total
    await page.getByPlaceholder('Passenger name').fill('Jane Smith')
    await page.getByPlaceholder(/Card number/).fill('4242424242424242')
    await page.getByPlaceholder('MM/YY').fill('1228')
    await page.locator('.payment-form .btn-primary:has-text("Pay")').click()

    // View Boarding Pass button should appear
    await page.locator('.nav-buttons .btn-primary:has-text("View Boarding Pass")').click()

    // Step 5: Boarding Pass
    await expect(page.locator('.success-message')).toHaveText(/Check-in complete!/)
    await expect(page.locator('.boarding-pass')).toBeVisible()
    await expect(page.locator('.confirmation-code')).toContainText(/SK[A-Z0-9]{6}/)
    await expect(page.locator('.flight-route')).toContainText('CPH')
    await expect(page.locator('.flight-route')).toContainText('JFK')
  })

  test('back navigation preserves selections', async ({ page }) => {
    // Select 2 checked bags and go to step 2
    await page.getByText('2 checked bags').nth(0).click()
    await page.locator('.nav-buttons .btn-primary').click()
    await expect(page.getByRole('heading', { name: 'Select Seat' })).toBeVisible()

    // Go back — luggage selection should be preserved
    await page.locator('.nav-buttons .btn-secondary').click()
    await expect(page.getByRole('heading', { name: 'Select Luggage' })).toBeVisible()
    await expect(page.getByText('2 checked bags').nth(0).locator('..').locator('..')).toHaveClass(/selected/)

    // Go forward, select seat, go to step 3
    await page.locator('.nav-buttons .btn-primary').click()
    await page.getByText('Premium Economy').nth(0).click()
    await page.locator('.nav-buttons .btn-primary').click()
    await expect(page.getByRole('heading', { name: 'Select Meal' })).toBeVisible()

    // Go back — seat selection should be preserved
    await page.locator('.nav-buttons .btn-secondary').click()
    await expect(page.getByText('Premium Economy').nth(0).locator('..').locator('..')).toHaveClass(/selected/)
  })

  test('payment form validation prevents invalid submit', async ({ page }) => {
    // Navigate to payment step
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()

    const payButton = page.locator('.payment-form .btn-primary:has-text("Pay")')

    // Empty form — button disabled
    await expect(payButton).toBeDisabled()

    // Name too short — still disabled
    await page.getByPlaceholder('Passenger name').fill('A')
    await expect(payButton).toBeDisabled()

    // Valid name but invalid card — still disabled
    await page.getByPlaceholder('Passenger name').fill('Jane Smith')
    await page.getByPlaceholder(/Card number/).fill('1234')
    await expect(payButton).toBeDisabled()

    // Valid card but no expiry — still disabled
    await page.getByPlaceholder(/Card number/).fill('4242424242424242')
    await expect(payButton).toBeDisabled()

    // Valid expiry — button now enabled
    await page.getByPlaceholder('MM/YY').fill('1228')
    await expect(payButton).toBeEnabled()
  })

  test('card number auto-formats to groups of 4', async ({ page }) => {
    // Navigate to payment step
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()

    const cardInput = page.getByPlaceholder(/Card number/)
    await cardInput.fill('4242424242424242')
    const value = await cardInput.inputValue()
    expect(value).toBe('4242 4242 4242 4242')
  })

  test('expiry auto-formats to MM/YY', async ({ page }) => {
    // Navigate to payment step
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()

    const expiryInput = page.getByPlaceholder('MM/YY')
    await expiryInput.fill('1228')
    const value = await expiryInput.inputValue()
    expect(value).toBe('12/28')
  })

  test('summary shows correct price breakdown', async ({ page }) => {
    // Select options with known prices
    await page.getByText('1 checked bag').nth(0).click() // $35
    await page.locator('.nav-buttons .btn-primary').click()

    await page.getByText('Economy Plus').nth(0).click() // $45
    await page.locator('.nav-buttons .btn-primary').click()

    await page.getByText('Chicken').nth(0).click() // $15
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()

    // Verify summary rows contain the prices
    const summaryText = await page.locator('.section-card').textContent()
    expect(summaryText).toContain('$199') // base price
    expect(summaryText).toContain('$35') // luggage
    expect(summaryText).toContain('$45') // seat
    expect(summaryText).toContain('$15') // meal
    expect(summaryText).toContain('$294') // total (199 + 35 + 45 + 15)
  })

  test('"New Check-in" resets to step 1', async ({ page }) => {
    // Complete the full flow
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()
    await page.getByPlaceholder('Passenger name').fill('Test User')
    await page.getByPlaceholder(/Card number/).fill('4242424242424242')
    await page.getByPlaceholder('MM/YY').fill('1228')
    await page.locator('.payment-form .btn-primary:has-text("Pay")').click()
    await page.locator('.nav-buttons .btn-primary:has-text("View Boarding Pass")').click()
    await expect(page.locator('.success-message')).toBeVisible()

    // Click New Check-in
    await page.getByRole('button', { name: 'New Check-in' }).click()

    // Should be back at step 1
    await expect(page.getByRole('heading', { name: 'Select Luggage' })).toBeVisible()
  })

  test('boarding pass displays passenger name from payment form', async ({ page }) => {
    // Navigate through with a specific name
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()
    await page.getByPlaceholder('Passenger name').fill('Jane Smith')
    await page.getByPlaceholder(/Card number/).fill('4242424242424242')
    await page.getByPlaceholder('MM/YY').fill('1228')
    await page.locator('.payment-form .btn-primary:has-text("Pay")').click()
    await page.locator('.nav-buttons .btn-primary:has-text("View Boarding Pass")').click()

    // Boarding pass should show the passenger name (uppercased)
    const passText = await page.locator('.boarding-pass-details').textContent()
    expect(passText?.toUpperCase()).toContain('JANE SMITH')
  })

  test('option selection is mutually exclusive within a step', async ({ page }) => {
    // Click first option
    await page.locator('.option-item').nth(0).click()
    await expect(page.locator('.option-item.selected')).toHaveCount(1)

    // Click second option — first should deselect
    await page.locator('.option-item').nth(1).click()
    await expect(page.locator('.option-item.selected')).toHaveCount(1)
    await expect(page.locator('.option-item').nth(1)).toHaveClass(/selected/)
    await expect(page.locator('.option-item').nth(0)).not.toHaveClass(/selected/)

    // Click third option
    await page.locator('.option-item').nth(2).click()
    await expect(page.locator('.option-item.selected')).toHaveCount(1)
    await expect(page.locator('.option-item').nth(2)).toHaveClass(/selected/)
  })

  test('selecting an option preserves correct option count and structure', async ({ page }) => {
    const countBefore = await page.locator('.option-item').count()

    // Click second option
    await page.locator('.option-item').nth(1).click()
    await expect(page.locator('.option-item').nth(1)).toHaveClass(/selected/)

    // Option count must remain the same (no duplication or loss)
    await expect(page.locator('.option-item')).toHaveCount(countBefore)

    // Each option should still have a label
    for (let i = 0; i < countBefore; i++) {
      await expect(page.locator('.option-item').nth(i).locator('.label')).not.toBeEmpty()
    }
  })

  test('step header shows correct step number', async ({ page }) => {
    // Step 1
    await expect(page.locator('.step-number')).toHaveText('1')

    // Step 2
    await page.locator('.nav-buttons .btn-primary').click()
    await expect(page.locator('.step-number')).toHaveText('2')

    // Step 3
    await page.locator('.nav-buttons .btn-primary').click()
    await expect(page.locator('.step-number')).toHaveText('3')
  })

  test('copy confirmation code shows feedback', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // Complete flow to boarding pass
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary').click()
    await page.locator('.nav-buttons .btn-primary:has-text("Review & Pay")').click()
    await page.getByPlaceholder('Passenger name').fill('Test User')
    await page.getByPlaceholder(/Card number/).fill('4242424242424242')
    await page.getByPlaceholder('MM/YY').fill('1228')
    await page.locator('.payment-form .btn-primary:has-text("Pay")').click()
    await page.locator('.nav-buttons .btn-primary:has-text("View Boarding Pass")').click()
    await expect(page.locator('.success-message')).toBeVisible()

    // Click copy button
    await page.locator('.confirmation-copy-button').click()
    await expect(page.locator('.confirmation-copy-button.copied')).toBeVisible({ timeout: 3000 })
  })

  test('free option items display "Included" instead of a price', async ({ page }) => {
    // Step 1: carry-on should show as free/included
    const freeOption = page.locator('.option-item').first().locator('.price')
    await expect(freeOption).toHaveClass(/free/)
  })

  test.describe('DOM Stability', () => {
    test('selecting a different luggage option does not rebuild the mount root', async ({ page }) => {
      const root = page.locator('#app')
      await expect(root).toBeVisible()

      // Mark the mount root (outside the component tree)
      await root.evaluate((el) => el.setAttribute('data-dom-stability-marker', 'original'))

      // Select a different option
      await page.locator('.option-item').nth(2).click()
      await expect(page.locator('.option-item').nth(2)).toHaveClass(/selected/)

      // Verify the mount root survived
      const markerSurvived = await page.locator('[data-dom-stability-marker="original"]').count()
      expect(markerSurvived).toBe(1)
    })

    test('no data-gea-compiled-child-root attributes in the DOM', async ({ page }) => {
      const count = await page.locator('[data-gea-compiled-child-root]').count()
      expect(count).toBe(0)
    })
  })
})
