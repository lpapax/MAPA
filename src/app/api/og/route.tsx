import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Nakupujte přímo od farmářů'
  const subtitle = searchParams.get('subtitle') ?? '3 960+ farem · 14 krajů · Bez poplatků'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0d1e09 0%, #1a4214 50%, #2d6b23 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '500px', height: '500px',
          borderRadius: '50%', background: 'rgba(74,140,63,0.15)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '350px', height: '350px',
          borderRadius: '50%', background: 'rgba(74,140,63,0.10)',
          display: 'flex',
        }} />

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 100px',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Logo / badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '36px',
          }}>
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>
              🌾
            </div>
            <span style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              MapaFarem.cz
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '900px',
          }}>
            {title}
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.65)',
            marginBottom: '48px',
          }}>
            {subtitle}
          </div>

          {/* Trust pills */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Přímý kontakt s farmářem', 'Česká republika', 'Zdarma'].map((pill) => (
              <div
                key={pill}
                style={{
                  padding: '8px 20px',
                  borderRadius: '99px',
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  color: 'rgba(255,255,255,0.80)',
                  fontSize: '18px',
                  display: 'flex',
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
