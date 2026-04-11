export const ARTICLE_ALLOWED_FIELDS = [
  'slug', 'title', 'category', 'draft', 'published_at',
  'author', 'read_time', 'excerpt', 'content', 'cover_image',
] as const

export type ArticleField = typeof ARTICLE_ALLOWED_FIELDS[number]

export function pickArticleFields(body: Record<string, unknown>): Partial<Record<ArticleField, unknown>> {
  return Object.fromEntries(
    ARTICLE_ALLOWED_FIELDS.filter(k => k in body).map(k => [k, body[k]])
  ) as Partial<Record<ArticleField, unknown>>
}
