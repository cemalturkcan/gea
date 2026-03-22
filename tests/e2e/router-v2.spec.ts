import { test, expect } from '@playwright/test'

test.describe('router-v2 guards, layouts, and surgical DOM updates', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state so each test starts unauthenticated
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('user'))
    await page.goto('/')
  })

  test('unauthenticated user is redirected to login page', async ({ page }) => {
    // Guard should redirect to /login
    await expect(page.locator('.login-page')).toBeVisible()
    await expect(page.locator('.login-card h1')).toHaveText('Sign In')
  })

  test('login navigates to dashboard with correct layout hierarchy', async ({ page }) => {
    await expect(page.locator('.login-page')).toBeVisible()

    // Fill login form
    await page.locator('#login-name').fill('Test User')
    await page.locator('#login-email').fill('test@example.com')
    await page.locator('.btn-primary').click()

    // Should show AppShell layout with top bar
    await expect(page.locator('.app-shell')).toBeVisible()
    await expect(page.locator('.top-bar')).toBeVisible()
    await expect(page.locator('.user-name')).toHaveText('Test User')

    // Should show DashboardLayout with sidebar
    await expect(page.locator('.dashboard-layout')).toBeVisible()
    await expect(page.locator('.sidebar')).toBeVisible()

    // Should show Overview page
    await expect(page.locator('.overview h1')).toHaveText('Dashboard')
    await expect(page.locator('.stat-card')).toHaveCount(3)
  })

  test('navigating between dashboard views preserves AppShell layout', async ({ page }) => {
    // Login first
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Store reference to top-bar
    await page.locator('.top-bar').evaluate((el) => {
      ;(window as any).__topBarRef = el
    })

    // Navigate to Projects
    await page.locator('.sidebar-link', { hasText: 'Projects' }).click()
    await expect(page.locator('.projects h1')).toHaveText('Projects')
    await expect(page.locator('.project-card')).toHaveCount(3)

    // Top bar must be same DOM node (AppShell survived)
    const topBarSame = await page.locator('.top-bar').evaluate((el) => {
      return el === (window as any).__topBarRef
    })
    expect(topBarSame).toBe(true)
  })

  test('project detail shows correct params and navigating back preserves sidebar', async ({ page }) => {
    // Login
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Navigate to Projects
    await page.locator('.sidebar-link', { hasText: 'Projects' }).click()
    await expect(page.locator('.projects')).toBeVisible()

    // Store reference to sidebar
    await page.locator('.sidebar').evaluate((el) => {
      ;(window as any).__sidebarRef = el
    })

    // Click View on first project
    await page.locator('.btn-link', { hasText: 'View' }).first().click()
    await expect(page.locator('.project-detail')).toBeVisible()
    await expect(page.locator('.project-detail h1')).toHaveText('Website Redesign')

    // Sidebar must still be the same DOM node
    const sidebarSame = await page.locator('.sidebar').evaluate((el) => {
      return el === (window as any).__sidebarRef
    })
    expect(sidebarSame).toBe(true)

    // Navigate back to projects
    await page.locator('.btn-link', { hasText: 'Back to Projects' }).click()
    await expect(page.locator('.projects')).toBeVisible()
  })

  test('settings tabs switch content via query params without rebuilding layout', async ({ page }) => {
    // Login
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Navigate to Settings
    await page.locator('.top-bar-nav a', { hasText: 'Settings' }).click()
    await expect(page.locator('.settings-layout')).toBeVisible()
    await expect(page.locator('.settings-layout h1')).toHaveText('Settings')

    // Should show Profile tab by default
    await expect(page.locator('.settings-tab h2')).toHaveText('Profile')
    await expect(page.locator('.tab.active')).toHaveText('Profile')

    // Switch to Billing tab
    await page.locator('.tab', { hasText: 'Billing' }).click()
    await expect(page.locator('.settings-tab h2')).toHaveText('Billing')
    await expect(page.locator('.tab.active')).toHaveText('Billing')

    // Settings layout must still exist (not duplicated)
    await expect(page.locator('.settings-layout')).toHaveCount(1)

    // Switch back to Profile
    await page.locator('.tab', { hasText: 'Profile' }).click()
    await expect(page.locator('.settings-tab h2')).toHaveText('Profile')

    // AppShell must still be present
    await expect(page.locator('.app-shell')).toHaveCount(1)
  })

  test('redirect route navigates to correct target', async ({ page }) => {
    // Login first
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Navigate to /old-dashboard — should redirect to /dashboard
    await page.goto('/old-dashboard')
    await expect(page.locator('.overview h1')).toHaveText('Dashboard')
  })

  test('unknown route redirects unauthenticated user to login', async ({ page }) => {
    // With no auth, the guard redirects to /login even for unknown routes
    await page.goto('/this-route-does-not-exist')
    await expect(page.locator('.login-page')).toBeVisible()
  })

  test('logout clears auth and redirects to login', async ({ page }) => {
    // Login
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Logout
    await page.locator('.btn-logout').click()
    await expect(page.locator('.login-page')).toBeVisible()

    // Navigating to protected route should redirect back to login
    await page.goto('/dashboard')
    await expect(page.locator('.login-page')).toBeVisible()
  })

  test('Link components render as anchor tags with correct hrefs', async ({ page }) => {
    // Login to see the app with links
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Top nav links must be <a> tags
    const topLinks = page.locator('.top-bar-nav a')
    await expect(topLinks).toHaveCount(2)

    const dashboardHref = await topLinks.first().getAttribute('href')
    expect(dashboardHref).toBe('/dashboard')

    // Sidebar links must be <a> tags
    const sidebarLinks = page.locator('.sidebar-nav a')
    await expect(sidebarLinks).toHaveCount(2)

    // No raw <link> elements should exist in the app
    const rawLinks = await page.locator('.app-shell link').count()
    expect(rawLinks).toBe(0)
  })

  test('active link styling updates correctly on navigation', async ({ page }) => {
    // Login
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Dashboard top link should be active
    await expect(page.locator('.top-bar-nav a.active')).toHaveText('Dashboard')

    // Navigate to Settings
    await page.locator('.top-bar-nav a', { hasText: 'Settings' }).click()
    await expect(page.locator('.settings-layout')).toBeVisible()

    // Settings top link should now be active, Dashboard should not
    await expect(page.locator('.top-bar-nav a.active')).toHaveText('Settings')
  })

  test('direct URL navigation works with nested routes', async ({ page }) => {
    // Login first
    await page.locator('#login-name').fill('Test User')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // Navigate directly to projects page
    await page.goto('/dashboard/projects')
    await expect(page.locator('.projects')).toBeVisible()
    await expect(page.locator('.project-card')).toHaveCount(3)

    // Navigate directly to a project detail
    await page.goto('/dashboard/projects/1')
    await expect(page.locator('.project-detail')).toBeVisible()
    await expect(page.locator('.project-detail h1')).toHaveText('Website Redesign')

    // Layout hierarchy must still be intact
    await expect(page.locator('.app-shell')).toHaveCount(1)
    await expect(page.locator('.dashboard-layout')).toHaveCount(1)
  })

  test('navigating preserves auth state across page navigations', async ({ page }) => {
    // Login
    await page.locator('#login-name').fill('Test User')
    await page.locator('#login-email').fill('test@example.com')
    await page.locator('.btn-primary').click()
    await expect(page.locator('.overview')).toBeVisible()

    // User name should show in top bar
    await expect(page.locator('.user-name')).toHaveText('Test User')

    // Navigate to different views — user name should persist
    await page.locator('.sidebar-link', { hasText: 'Projects' }).click()
    await expect(page.locator('.user-name')).toHaveText('Test User')

    await page.locator('.top-bar-nav a', { hasText: 'Settings' }).click()
    await expect(page.locator('.user-name')).toHaveText('Test User')
  })

  test.describe('DOM Stability', () => {
    test('surgical DOM update: user name in top-bar survives within-view navigation', async ({ page }) => {
      // Login
      await page.locator('#login-name').fill('Test User')
      await page.locator('.btn-primary').click()
      await expect(page.locator('.overview')).toBeVisible()

      // Mark the user name element in the top-bar
      const userName = page.locator('.user-name')
      await expect(userName).toBeVisible()
      await userName.evaluate((el) => el.setAttribute('data-dom-stability-marker', 'original'))

      // Navigate to Projects (within same layout)
      await page.locator('.sidebar-link', { hasText: 'Projects' }).click()
      await expect(page.locator('.projects')).toBeVisible()

      // The user name in top-bar should be the same DOM node
      const markerSurvived = await page.locator('[data-dom-stability-marker="original"]').count()
      expect(markerSurvived).toBe(1)
    })

    test('no data-gea-compiled-child-root attributes in the DOM', async ({ page }) => {
      // Login to access the full app
      await page.locator('#login-name').fill('Test User')
      await page.locator('.btn-primary').click()
      await expect(page.locator('.overview')).toBeVisible()

      const compiledChildRootCount = await page.evaluate(() => {
        return document.querySelectorAll('[data-gea-compiled-child-root]').length
      })
      expect(compiledChildRootCount).toBe(0)
    })
  })
})
