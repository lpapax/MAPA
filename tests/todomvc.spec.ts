import { test, expect, Page } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const URL = 'https://demo.playwright.dev/todomvc/'
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')

// Ensure screenshots dir exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

async function screenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name}.png`),
    fullPage: true,
  })
}

async function addTodo(page: Page, text: string) {
  await page.locator('.new-todo').fill(text)
  await page.locator('.new-todo').press('Enter')
}

// ── Test suite ─────────────────────────────────────────────────

test.describe('TodoMVC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  // ── 1. Add todo ──────────────────────────────────────────────

  test('01 — add a single todo', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    const items = page.locator('.todo-list li')
    await expect(items).toHaveCount(1)
    await expect(items.first()).toContainText('Buy milk')
    await screenshot(page, '01-add-single-todo')
  })

  test('02 — add multiple todos', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await addTodo(page, 'Read a book')
    await expect(page.locator('.todo-list li')).toHaveCount(3)
    await screenshot(page, '02-add-multiple-todos')
  })

  test('03 — empty input does not add todo', async ({ page }) => {
    await page.locator('.new-todo').press('Enter')
    await expect(page.locator('.todo-list li')).toHaveCount(0)
    await screenshot(page, '03-empty-input-no-add')
  })

  // ── 2. Complete todo ─────────────────────────────────────────

  test('04 — complete a todo', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await page.locator('.todo-list li .toggle').first().click()
    await expect(page.locator('.todo-list li').first()).toHaveClass(/completed/)
    await screenshot(page, '04-complete-todo')
  })

  test('05 — uncheck a completed todo', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await page.locator('.todo-list li .toggle').first().click()
    await page.locator('.todo-list li .toggle').first().click()
    await expect(page.locator('.todo-list li').first()).not.toHaveClass(/completed/)
    await screenshot(page, '05-uncheck-todo')
  })

  // ── 3. Delete todo ───────────────────────────────────────────

  test('06 — delete a todo via destroy button', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await page.locator('.todo-list li').first().hover()
    await page.locator('.todo-list li .destroy').first().click()
    await expect(page.locator('.todo-list li')).toHaveCount(0)
    await screenshot(page, '06-delete-todo')
  })

  // ── 4. Edit todo ─────────────────────────────────────────────

  test('07 — edit a todo by double-clicking', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await page.locator('.todo-list li label').first().dblclick()
    const editInput = page.locator('.todo-list li .edit')
    await editInput.fill('Buy oat milk')
    await editInput.press('Enter')
    await expect(page.locator('.todo-list li').first()).toContainText('Buy oat milk')
    await screenshot(page, '07-edit-todo')
  })

  test('08 — cancel edit with Escape restores original text', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await page.locator('.todo-list li label').first().dblclick()
    const editInput = page.locator('.todo-list li .edit')
    await editInput.fill('Something else')
    await editInput.press('Escape')
    await expect(page.locator('.todo-list li').first()).toContainText('Buy milk')
    await screenshot(page, '08-cancel-edit')
  })

  test('09 — editing to empty string deletes the todo', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await page.locator('.todo-list li label').first().dblclick()
    const editInput = page.locator('.todo-list li .edit')
    await editInput.fill('')
    await editInput.press('Enter')
    await expect(page.locator('.todo-list li')).toHaveCount(0)
    await screenshot(page, '09-edit-empty-deletes')
  })

  // ── 5. Filters ───────────────────────────────────────────────

  test('10 — filter: Active shows only incomplete todos', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await page.locator('.todo-list li .toggle').first().click() // complete first
    await page.locator('a', { hasText: 'Active' }).click()
    await expect(page.locator('.todo-list li')).toHaveCount(1)
    await expect(page.locator('.todo-list li').first()).toContainText('Walk the dog')
    await screenshot(page, '10-filter-active')
  })

  test('11 — filter: Completed shows only done todos', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await page.locator('.todo-list li .toggle').first().click() // complete first
    await page.locator('a', { hasText: 'Completed' }).click()
    await expect(page.locator('.todo-list li')).toHaveCount(1)
    await expect(page.locator('.todo-list li').first()).toContainText('Buy milk')
    await screenshot(page, '11-filter-completed')
  })

  test('12 — filter: All shows all todos', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await page.locator('.todo-list li .toggle').first().click()
    await page.locator('a', { hasText: 'Completed' }).click()
    await page.locator('a', { hasText: 'All' }).click()
    await expect(page.locator('.todo-list li')).toHaveCount(2)
    await screenshot(page, '12-filter-all')
  })

  // ── 6. Clear completed ───────────────────────────────────────

  test('13 — clear completed removes only done todos', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await page.locator('.todo-list li .toggle').first().click()
    await page.locator('.clear-completed').click()
    await expect(page.locator('.todo-list li')).toHaveCount(1)
    await expect(page.locator('.todo-list li').first()).toContainText('Walk the dog')
    await screenshot(page, '13-clear-completed')
  })

  test('14 — clear completed button hidden when no completed todos', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await expect(page.locator('.clear-completed')).not.toBeVisible()
    await screenshot(page, '14-no-clear-completed-button')
  })

  // ── 7. Bulk toggle ───────────────────────────────────────────

  test('15 — toggle-all marks all todos complete', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await addTodo(page, 'Read a book')
    await page.locator('.toggle-all').click()
    const items = page.locator('.todo-list li')
    for (let i = 0; i < 3; i++) {
      await expect(items.nth(i)).toHaveClass(/completed/)
    }
    await screenshot(page, '15-toggle-all-complete')
  })

  test('16 — toggle-all unchecks all when all are complete', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await page.locator('.toggle-all').click() // all complete
    await page.locator('.toggle-all').click() // all incomplete
    const items = page.locator('.todo-list li')
    for (let i = 0; i < 2; i++) {
      await expect(items.nth(i)).not.toHaveClass(/completed/)
    }
    await screenshot(page, '16-toggle-all-incomplete')
  })

  // ── 8. Counter ───────────────────────────────────────────────

  test('17 — item counter shows correct remaining count', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    await addTodo(page, 'Read a book')
    await page.locator('.todo-list li .toggle').first().click()
    await expect(page.locator('.todo-count')).toContainText('2')
    await screenshot(page, '17-item-counter')
  })

  // ── 9. Persistence ──────────────────────────────────────────

  test('18 — todos persist after page reload', async ({ page }) => {
    await addTodo(page, 'Survive reload')
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.todo-list li')).toHaveCount(1)
    await expect(page.locator('.todo-list li').first()).toContainText('Survive reload')
    await screenshot(page, '18-persistence-after-reload')
  })

  // ── 10. Intentionally failing test ──────────────────────────

  test('19 — FAILING: todo count shows wrong number (intentional)', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    // Intentionally wrong assertion — expects 99 items when there are 2
    await expect(page.locator('.todo-list li')).toHaveCount(99)
    await screenshot(page, '19-failing-wrong-count')
  })

  test('20 — FAILING: completed filter shows active items (intentional)', async ({ page }) => {
    await addTodo(page, 'Buy milk')
    await addTodo(page, 'Walk the dog')
    // No item is completed, yet we assert the completed filter shows 2 items
    await page.locator('a', { hasText: 'Completed' }).click()
    await expect(page.locator('.todo-list li')).toHaveCount(2)
    await screenshot(page, '20-failing-completed-filter')
  })
})
