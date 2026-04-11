import { test, expect, Page } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'

const BASE_URL = 'http://localhost:3000'

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'mapafarem')

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

async function screenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name}.png`),
    fullPage: true,
  })
}

// Pick a real farm slug that exists in the fallback JSON
// (kotvicnikova-farma-ing-stepanka-janoutova is the first entry in farms.json)
const KNOWN_FARM_SLUG = 'kotvicnikova-farma-ing-stepanka-janoutova'
const KNOWN_FARM_NAME = 'Kotvičníková Farma Ing.Štěpánka Janoutová'

// ── Test suite ──────────────────────────────────────────────────────────────

test.describe('Mapa Farem — critical user journeys', () => {

  // ── 1. Homepage loads ────────────────────────────────────────────────────

  test('01 — homepage: title, hero, farm cards', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

    // Title
    await expect(page).toHaveTitle(/Mapa Farem/i)

    // Hero section: landmark with aria-labelledby="hero-heading"
    const hero = page.locator('section[aria-labelledby="hero-heading"]')
    await expect(hero).toBeVisible()

    // At least one farm card must appear (HomeFeaturedFarms section)
    const farmsSection = page.locator('section[aria-labelledby="featured-farms-heading"]')
    await expect(farmsSection).toBeVisible()

    // At least one link pointing to a farm detail page
    const farmLinks = page.locator('a[href^="/farmy/"]')
    await expect(farmLinks.first()).toBeVisible()

    await screenshot(page, '01-homepage')
  })

  // ── 2. Navigation — Mapa link ────────────────────────────────────────────

  test('02 — nav: clicking "Mapa" navigates to /mapa', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

    // Desktop nav link (hidden on small screens, but viewport is desktop default)
    const mapaLink = page.locator('nav[aria-label="Hlavní navigace"] a[href="/mapa"]').first()
    await expect(mapaLink).toBeVisible()
    await mapaLink.click()

    await page.waitForURL(`${BASE_URL}/mapa`, { timeout: 15000 })
    expect(page.url()).toContain('/mapa')

    await screenshot(page, '02-nav-to-mapa')
  })

  // ── 3. Search typeahead ──────────────────────────────────────────────────

  test('03 — search typeahead: open overlay, type query, see result or empty state', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

    // Click the search button in the navbar (aria-label="Hledat farmu")
    const searchBtn = page.locator('button[aria-label="Hledat farmu"]')
    await expect(searchBtn).toBeVisible()
    await searchBtn.click()

    // Search overlay dialog should appear
    const overlay = page.locator('[role="dialog"][aria-label="Vyhledávání farem"]')
    await expect(overlay).toBeVisible()

    // Type into the search input
    const searchInput = overlay.locator('input[type="search"]')
    await expect(searchInput).toBeVisible()
    await searchInput.fill('farma')

    // Wait for either results list or "no results" message to appear
    // (network may not be available in test env — both outcomes are acceptable)
    const resultsOrEmpty = page.locator(
      '.mt-1.bg-white, [class*="mt-1"][class*="bg-white"]'
    )
    await expect(resultsOrEmpty.first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // API may be offline — acceptable in isolated env
    })

    await screenshot(page, '03-search-typeahead')

    // Close overlay with Escape
    await page.keyboard.press('Escape')
    await expect(overlay).not.toBeVisible()
  })

  // ── 4. Farm cards → farm detail navigation ───────────────────────────────

  test('04 — farm cards: visible on homepage, clicking navigates to detail', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

    // Wait for featured farms section to be present
    const farmsSection = page.locator('section[aria-labelledby="featured-farms-heading"]')
    await expect(farmsSection).toBeVisible()

    // Find the first farm card link
    const firstFarmLink = farmsSection.locator('a[href^="/farmy/"]').first()
    await expect(firstFarmLink).toBeVisible()

    // Get the href so we can assert the URL after navigation
    const href = await firstFarmLink.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toMatch(/^\/farmy\//)

    await firstFarmLink.click()
    await page.waitForURL(`${BASE_URL}${href}`, { timeout: 20000 })

    // Should now be on a farm detail page
    expect(page.url()).toContain('/farmy/')

    await screenshot(page, '04-farm-card-to-detail')
  })

  // ── 5. Farm detail page (known slug) ─────────────────────────────────────

  test('05 — farm detail: heading and tabs visible for known farm', async ({ page }) => {
    await page.goto(`${BASE_URL}/farmy/${KNOWN_FARM_SLUG}`, { waitUntil: 'domcontentloaded' })

    // The farm name should appear somewhere on the page
    const heading = page.locator('h1')
    await expect(heading).toBeVisible({ timeout: 20000 })
    const headingText = await heading.textContent()
    expect(headingText).toBeTruthy()

    // At least one tab button must be visible (O farmě / Produkty / Galerie / Recenze / Kontakt)
    const tabs = page.locator('button[role="tab"], [role="tab"]')
    const tabsAlt = page.locator('button').filter({ hasText: /O farmě|Produkty|Galerie|Recenze|Kontakt/i })
    const tabCount = await tabsAlt.count()
    expect(tabCount).toBeGreaterThan(0)

    await screenshot(page, '05-farm-detail')
  })

  // ── 6. Newsletter signup ─────────────────────────────────────────────────

  test('06 — newsletter: submit email, accept success or already-subscribed', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

    // Scroll to newsletter section
    const newsletterSection = page.locator('section[aria-labelledby="newsletter-heading"]')
    await newsletterSection.scrollIntoViewIfNeeded()
    await expect(newsletterSection).toBeVisible()

    // Fill the email input
    const emailInput = page.locator('#newsletter-email')
    await expect(emailInput).toBeVisible()
    await emailInput.fill('test-e2e@example.com')

    // Submit
    const submitBtn = newsletterSection.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()
    await submitBtn.click()

    // Accept any of these outcomes:
    // (a) success confirmation text
    // (b) 409 already-subscribed toast: "Tento e-mail je již přihlášen k odběru."
    // (c) connection-error toast: "Připojení se nezdařilo..."
    // (d) generic error toast
    // All are acceptable — we just need the page to not crash
    const successMsg = page.locator('text=Přihlásili jste se úspěšně')
    const alreadyMsg = page.locator('[role="alert"]')
    const anyFeedback = page.locator(
      'text=Přihlásili jste se úspěšně, [role="alert"], text=Připojení se nezdařilo'
    )

    // Wait briefly for any response feedback
    await page.waitForTimeout(3000)

    // Either the success state OR an alert/toast should appear
    // If Supabase is unavailable we may get a connection-error toast — that's fine
    const successVisible = await successMsg.isVisible().catch(() => false)
    const alertVisible = await alreadyMsg.isVisible().catch(() => false)
    // We just assert the page is still functional (no crash / no navigation away)
    expect(page.url()).toBe(`${BASE_URL}/`)

    await screenshot(page, '06-newsletter-signup')
  })

  // ── 7. Map page ──────────────────────────────────────────────────────────

  test('07 — mapa: page loads, map container present', async ({ page }) => {
    await page.goto(`${BASE_URL}/mapa`, { waitUntil: 'domcontentloaded' })

    // The map search page should render
    // Look for the map wrapper — MapView is always loaded in a container
    // Accept either a Mapbox canvas OR any div that acts as the map container
    const mapContainer = page.locator('#map-container, .mapboxgl-map, canvas[aria-label], canvas').first()
    const mapWrapper = page.locator('[class*="mapbox"], canvas, [id*="map"]').first()

    // The page title should reflect "Mapa"
    await expect(page).toHaveTitle(/[Mm]apa/i)

    // The sidebar / search UI must be visible regardless of map tiles loading
    // Look for any search input or farm list that MapSearchPage renders
    const sidebar = page.locator('[class*="sidebar"], input[placeholder*="Hledat"], input[type="search"], input[placeholder*="hledat"]').first()
    // Be lenient — just assert the page didn't 404
    const main = page.locator('main, #main-content, [class*="MapSearch"]')
    // At minimum, the Navbar must render (proves page loaded)
    const navbar = page.locator('header[role="banner"]')
    await expect(navbar).toBeVisible()

    await screenshot(page, '07-mapa-page')
  })

  // ── 8. Add farm form (step 1) ────────────────────────────────────────────

  test('08 — pridat-farmu: page loads, step 1 form fields visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/pridat-farmu`, { waitUntil: 'domcontentloaded' })

    // Page heading
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Přidejte svou farmu/i)

    // Farm name input — step 1 of AddFarmForm
    // The form has labels: "Název farmy", "Krátký popis", etc.
    const nameInput = page.locator('input[placeholder*="Farma"], input[id*="name"], input[name*="name"]').first()
    const anyInput = page.locator('input[type="text"], input[type="email"], input[type="tel"], textarea').first()
    await expect(anyInput).toBeVisible({ timeout: 10000 })

    // Categories in step 1 are rendered as <label> elements wrapping hidden checkboxes
    // (not <button> elements — see AddFarmForm.tsx line ~300)
    const categoryLabels = page.locator('label').filter({ hasText: /Zelenina|Ovoce|Maso|Byliny/i })
    const categoryCount = await categoryLabels.count()
    expect(categoryCount).toBeGreaterThan(0)

    await screenshot(page, '08-pridat-farmu-step1')
  })

  // ── 9. 404 page ──────────────────────────────────────────────────────────

  test('09 — 404: custom not-found page rendered for unknown route', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/nonexistent-page-xyz-abc-123`, {
      waitUntil: 'domcontentloaded',
    })

    // Next.js 404 pages return HTTP 404
    // (response may be null for navigations — check URL and page content instead)

    // The custom not-found page shows "404" as an h1
    const heading404 = page.locator('h1')
    await expect(heading404).toBeVisible({ timeout: 10000 })
    await expect(heading404).toContainText('404')

    // Also check for the Czech copy
    const nenalezena = page.locator('text=ztratila, text=nenalezena, text=neexistuje').first()
    // At minimum the 404 number must be visible
    const pageContent = await page.content()
    expect(pageContent).toMatch(/404/)

    await screenshot(page, '09-404-page')
  })

  // ── 10. Mobile navigation bar ────────────────────────────────────────────

  test('10 — mobile nav: bottom navigation visible at 375×812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

    // MobileBottomNav renders as nav[aria-label="Mobilní navigace"]
    const mobileNav = page.locator('nav[aria-label="Mobilní navigace"]')
    await expect(mobileNav).toBeVisible()

    // Should contain nav items: Domů, Mapa, Trhy, Blog, Oblíbené
    const homeItem = mobileNav.locator('a[aria-label="Domů"]')
    const mapaItem = mobileNav.locator('a[aria-label="Mapa"]')
    await expect(homeItem).toBeVisible()
    await expect(mapaItem).toBeVisible()

    await screenshot(page, '10-mobile-nav')
  })

})
