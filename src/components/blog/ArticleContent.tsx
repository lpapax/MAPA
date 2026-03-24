'use client'

interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-heading text-xl font-bold text-forest mt-8 mb-3">
              {line.slice(3)}
            </h2>
          )
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={idx} className="font-semibold text-forest text-sm mt-4 mb-1">
              {line.slice(2, -2)}
            </p>
          )
        }
        if (line.startsWith('- ')) {
          return (
            <li key={idx} className="text-gray-600 text-sm leading-relaxed ml-4 list-disc">
              {line.slice(2)}
            </li>
          )
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-2" />
        }
        // Inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <p key={idx} className="text-gray-600 text-sm leading-relaxed">
            {parts.map((part, i) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={i} className="font-semibold text-forest">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              ),
            )}
          </p>
        )
      })}
    </div>
  )
}
