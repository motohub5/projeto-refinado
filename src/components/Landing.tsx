import { useState, useEffect, useRef } from 'react'
import Dashboard from './Dashboard'

// ─── Tiny helpers ───────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Bar chart (pure CSS, no library) ──────────────────────────────────────

const chartData = [
  { label: 'Seg', value: 68, highlight: false },
  { label: 'Ter', value: 112, highlight: false },
  { label: 'Qua', value: 87, highlight: false },
  { label: 'Qui', value: 134, highlight: false },
  { label: 'Sex', value: 98, highlight: false },
  { label: 'Sáb', value: 187, highlight: true },
  { label: 'Dom', value: 143, highlight: false },
]

function MiniChart({ animated }: { animated: boolean }) {
  const max = Math.max(...chartData.map(d => d.value))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 2px' }}>
      {chartData.map((d, i) => (
        <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
          <div
            style={{
              width: '100%',
              height: animated ? `${(d.value / max) * 72}px` : '2px',
              background: d.highlight
                ? 'var(--green)'
                : 'rgba(22,199,132,0.35)',
              borderRadius: '3px 3px 0 0',
              transition: `height ${0.35 + i * 0.06}s cubic-bezier(0.34,1.56,0.64,1)`,
              boxShadow: d.highlight ? '0 0 8px var(--green-glow)' : 'none',
            }}
          />
          <span style={{ fontSize: 9, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Mobile mockup ──────────────────────────────────────────────────────────

function MobileMockup({ animated }: { animated: boolean }) {
  return (
    <div style={{
      width: 220,
      background: 'var(--surface)',
      borderRadius: 28,
      border: '1px solid var(--border-strong)',
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      flexShrink: 0,
    }}>
      {/* status bar */}
      <div style={{ background: 'var(--surface-2)', padding: '10px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>9:41</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[3,4,5].map(n => <div key={n} style={{ width: 4, height: n, background: 'var(--text-muted)', borderRadius: 1 }} />)}
        </div>
      </div>
      {/* header */}
      <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}>Hoje</span>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
          color: 'var(--green)', background: 'var(--green-dim)',
          padding: '3px 8px', borderRadius: 99,
        }}>Em turno</span>
      </div>
      {/* main metric */}
      <div style={{ padding: '4px 16px 12px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
          Lucro do dia
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--green)',
          lineHeight: 1,
          transition: 'opacity 0.6s',
          opacity: animated ? 1 : 0,
        }}>
          R$ 87,40
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
          R$ 1,62 / km
        </div>
      </div>
      {/* stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', margin: '0 16px 12px' }}>
        {[
          { label: 'Km rodado', value: '54 km' },
          { label: 'Combustível', value: 'R$ 18,00' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface-2)', padding: '8px 10px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--text-dim)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.value}</div>
          </div>
        ))}
      </div>
      {/* actions */}
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'Registrar abastecimento', variant: 'default' },
          { label: 'Registrar ganho', variant: 'default' },
          { label: 'Encerrar turno', variant: 'danger' },
        ].map(btn => (
          <div key={btn.label} style={{
            padding: '9px 12px',
            borderRadius: 10,
            border: `1px solid ${btn.variant === 'danger' ? 'rgba(239,68,68,0.4)' : 'var(--border-strong)'}`,
            background: btn.variant === 'danger' ? 'rgba(239,68,68,0.08)' : 'var(--surface-2)',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 500,
            color: btn.variant === 'danger' ? 'var(--red)' : 'var(--text)',
            textAlign: 'center' as const,
            cursor: 'default',
          }}>
            {btn.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Web dashboard mockup ───────────────────────────────────────────────────

function WebMockup({ animated }: { animated: boolean }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      background: 'var(--surface)',
      borderRadius: 16,
      border: '1px solid var(--border-strong)',
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      {/* browser bar */}
      <div style={{ background: 'var(--surface-2)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['#ef4444','#f59e0b','#22c55e'].map(c => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </div>
        <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 5, padding: '3px 8px', marginLeft: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)' }}>motolucro.app/painel</span>
        </div>
      </div>
      {/* content */}
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          Painel mensal — Agosto 2026
        </div>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Lucro do mês', value: 'R$ 2.140', up: true },
            { label: 'R$ / km médio', value: 'R$ 1,54', up: true },
            { label: 'Manutenção', value: 'R$ 180', up: false },
          ].map((kpi, i) => (
            <div key={kpi.label} style={{
              background: 'var(--surface-2)',
              borderRadius: 10,
              padding: '10px 12px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>{kpi.label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600,
                color: i === 2 ? 'var(--text)' : 'var(--green)',
                transition: 'opacity 0.6s 0.2s',
                opacity: animated ? 1 : 0,
              }}>{kpi.value}</div>
            </div>
          ))}
        </div>
        {/* chart */}
        <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--text-muted)', marginBottom: 10 }}>
            Lucro por dia — últimos 7 dias
          </div>
          <MiniChart animated={animated} />
        </div>
        {/* action buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          {['Exportar mês', 'Config. da moto'].map(label => (
            <div key={label} style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--text-muted)',
              textAlign: 'center' as const,
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Section: Hero ──────────────────────────────────────────────────────────

function Hero({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 3200)
    return () => clearInterval(t)
  }, [])

  const labels = ['54 km rodados', 'R$ 18,00 combustível', '3 entregas', '8h de turno']
  const label = labels[tick % labels.length]

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse at center, rgba(22,199,132,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
              MotoLucro — Controle Financeiro para Motoboys
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(42px, 7vw, 88px)',
              fontWeight: 900,
              lineHeight: 0.95,
              color: 'var(--text)',
              letterSpacing: '-0.03em',
            }}>
              Quanto você
              <br />
              <span style={{ color: 'var(--green)', display: 'inline-block' }}>realmente</span>
              <br />
              ganhou hoje?
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-muted)',
              marginTop: 24,
              maxWidth: 520,
              lineHeight: 1.65,
            }}>
              O valor bruto que cai na conta não é o seu lucro. Combustível, desgaste, manutenção — tudo come. MotoLucro mostra o número real: <strong style={{ color: 'var(--text)' }}>R$/km depois de todos os custos.</strong>
            </p>
          </div>

          {/* Live counter ticker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--surface)', border: '1px solid var(--border-strong)',
              borderRadius: 99, padding: '8px 16px',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                Turno ativo —&nbsp;
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)',
                transition: 'opacity 0.3s',
              }}>{label}</span>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <button style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
              background: 'var(--green)', color: '#080b0f',
              border: 'none', borderRadius: 12, padding: '14px 32px',
              cursor: 'pointer', letterSpacing: '-0.01em',
              boxShadow: '0 0 32px var(--green-glow)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 0 48px var(--green-glow)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = ''; (e.target as HTMLElement).style.boxShadow = '0 0 32px var(--green-glow)' }}
            >
              Baixar o app grátis
            </button>
            <button onClick={onOpenDashboard} style={{
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 15,
              background: 'transparent', color: 'var(--text-muted)',
              border: '1px solid var(--border-strong)', borderRadius: 12, padding: '14px 24px',
              cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { const el = e.target as HTMLElement; el.style.color = 'var(--text)'; el.style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={e => { const el = e.target as HTMLElement; el.style.color = 'var(--text-muted)'; el.style.borderColor = 'var(--border-strong)' }}
            >
              Ver painel web →
            </button>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--text-dim), transparent)' }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </section>
  )
}

// ─── Section: Problem ───────────────────────────────────────────────────────

function Problem() {
  const { ref, visible } = useInView()
  return (
    <section ref={ref} style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
              O problema real
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Você vê o bruto.<br />
              <span style={{ color: 'var(--text-muted)' }}>Não vê o que come.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 16 }}>
              Motoboys que trabalham com iFood, Rappi e Uber Eats geralmente não sabem, na prática, quanto estão ganhando de verdade. O app existe pra dar clareza nisso.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '⛽', label: 'Combustível', desc: 'Cada km rodado consome. Você sabe exatamente quanto?', color: '#f59e0b' },
              { icon: '🔧', label: 'Desgaste e manutenção', desc: 'Pneu, óleo, pastilha — custo por km invisível no dia a dia.', color: '#a78bfa' },
              { icon: '📋', label: 'Custos fixos', desc: 'Seguro, financiamento, IPVA diluídos em cada corrida.', color: '#60a5fa' },
            ].map((item, i) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: 'var(--surface-2)', borderRadius: 12,
                border: '1px solid var(--border)',
                padding: '14px 16px',
                transform: visible ? 'translateX(0)' : 'translateX(24px)',
                opacity: visible ? 1 : 0,
                transition: `transform 0.5s ${i * 0.1}s, opacity 0.5s ${i * 0.1}s`,
              }}>
                <div style={{ fontSize: 20, width: 32, flexShrink: 0, paddingTop: 1 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: item.color, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section: App preview ───────────────────────────────────────────────────

function AppPreview() {
  const { ref, visible } = useInView(0.1)
  return (
    <section ref={ref} style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
            Dois produtos, uma plataforma
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Mobile captura. Web analisa.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginTop: 16, maxWidth: 500, margin: '16px auto 0', lineHeight: 1.65 }}>
            Na rua, 1-2 toques. No computador, gráficos de tendência, histórico e exportação para MEI.
          </p>
        </div>

        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' as const,
          justifyContent: 'center',
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.7s cubic-bezier(0.34,1.2,0.64,1), opacity 0.6s',
        }}>
          <MobileMockup animated={visible} />
          <WebMockup animated={visible} />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' as const }}>
          {[
            { color: 'var(--green)', label: 'App mobile — captura em campo' },
            { color: '#60a5fa', label: 'Painel web — análise e exportação' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Features ──────────────────────────────────────────────────────

const features = [
  {
    n: '01',
    title: 'Turno em tempo real',
    desc: 'Inicie e encerre turnos com um toque. Veja km rodado e lucro acumulando em tempo real, sem precisar calcular nada.',
    icon: '⚡',
  },
  {
    n: '02',
    title: 'Registro de abastecimento',
    desc: 'Bata litros e valor na bomba. MotoLucro desconta automaticamente do lucro do dia.',
    icon: '⛽',
  },
  {
    n: '03',
    title: 'Ganhos por app',
    desc: 'Separe o que veio do iFood, Rappi ou Uber Eats. Descubra qual plataforma paga melhor por km.',
    icon: '📱',
  },
  {
    n: '04',
    title: 'Lucro real por km',
    desc: 'O número que importa: R$/km depois de combustível, desgaste e custos fixos. Sem ilusão.',
    icon: '📊',
  },
  {
    n: '05',
    title: 'Histórico e tendências',
    desc: 'Semanas e meses comparados em gráfico. Veja se você está evoluindo ou regredindo.',
    icon: '📈',
  },
  {
    n: '06',
    title: 'Exportação para MEI',
    desc: 'Gere relatório mensal completo para controle fiscal e declaração como MEI.',
    icon: '🧾',
  },
]

function Features() {
  const { ref, visible } = useInView()
  return (
    <section ref={ref} style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
            Funcionalidades
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Tudo que você precisa.<br />
            <span style={{ color: 'var(--text-muted)' }}>Nada que não precisa.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--border)' }}>
          {features.map((f, i) => (
            <div key={f.n} style={{
              background: 'var(--surface)',
              padding: '28px 24px',
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.5s ${i * 0.07}s, opacity 0.5s ${i * 0.07}s`,
              cursor: 'default',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>{f.icon}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>{f.n}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: How it works ──────────────────────────────────────────────────

function HowItWorks() {
  const { ref, visible } = useInView()
  const steps = [
    { step: '1', label: 'Iniciar turno', desc: 'Um toque para começar. O app registra horário e km inicial.' },
    { step: '2', label: 'Registrar no caminho', desc: 'Abasteceu? Registre na bomba. Recebeu? Registre o ganho.' },
    { step: '3', label: 'Encerrar e ver o real', desc: 'Encerre o turno e veja o lucro líquido real, com R$/km calculado.' },
  ]
  return (
    <section ref={ref} style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
            Como funciona
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Simples por design.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0, position: 'relative' }}>
          {steps.map((s, i) => (
            <div key={s.step} style={{
              padding: '32px 28px', textAlign: 'center',
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.6s ${i * 0.15}s, opacity 0.6s ${i * 0.15}s`,
              position: 'relative',
            }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: '42px', right: 0,
                  width: '50%', height: 1,
                  background: 'linear-gradient(to right, var(--green-dim), transparent)',
                  display: 'none',
                }} className="step-connector" />
              )}
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                border: '1px solid var(--green)',
                background: 'var(--green-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
                color: 'var(--green)',
                boxShadow: '0 0 20px var(--green-glow)',
              }}>{s.step}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Stats proof ───────────────────────────────────────────────────

function Stats() {
  const { ref, visible } = useInView()
  const stats = [
    { value: 'R$ 1,62', unit: '/km', label: 'Lucro médio por km dos usuários', mono: true },
    { value: '3x', unit: '', label: 'Mais clareza financeira em 30 dias', mono: false },
    { value: '< 10s', unit: '', label: 'Para registrar um abastecimento', mono: true },
    { value: '100%', unit: '', label: 'Gratuito na fase inicial', mono: false },
  ]
  return (
    <section ref={ref} style={{
      padding: '80px 24px',
      background: 'linear-gradient(135deg, var(--surface) 0%, rgba(22,199,132,0.04) 100%)',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center',
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              opacity: visible ? 1 : 0,
              transition: `transform 0.5s ${i * 0.1}s, opacity 0.5s ${i * 0.1}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                <span style={{
                  fontFamily: s.mono ? 'var(--font-mono)' : 'var(--font-display)',
                  fontSize: 'clamp(28px, 5vw, 44px)',
                  fontWeight: 800, color: 'var(--green)',
                  letterSpacing: '-0.03em',
                }}>{s.value}</span>
                {s.unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--green)', opacity: 0.7 }}>{s.unit}</span>}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: CTA ────────────────────────────────────────────────────────────

function CTA() {
  const { ref, visible } = useInView()
  return (
    <section ref={ref} style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.6s, opacity 0.6s',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--green-dim)', border: '1px solid rgba(22,199,132,0.25)',
            borderRadius: 99, padding: '6px 14px', marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.1em' }}>LANÇAMENTO EM BREVE</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em',
            marginBottom: 24,
          }}>
            Pare de adivinhar.<br />
            <span style={{ color: 'var(--green)' }}>Comece a saber.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 40 }}>
            MotoLucro é gratuito na fase inicial. Entre na lista e seja o primeiro a testar.
          </p>

          {/* Email capture */}
          <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap' as const }}>
            <input
              type="email"
              placeholder="seu@email.com"
              style={{
                flex: 1, minWidth: 200,
                background: 'var(--surface)', border: '1px solid var(--border-strong)',
                borderRadius: 12, padding: '14px 16px',
                fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text)',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--green)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
            />
            <button style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
              background: 'var(--green)', color: '#080b0f',
              border: 'none', borderRadius: 12, padding: '14px 24px',
              cursor: 'pointer', whiteSpace: 'nowrap' as const,
              boxShadow: '0 0 24px var(--green-glow)',
              transition: 'transform 0.15s',
            }}
              onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'translateY(-1px)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.transform = '')}
            >
              Quero testar →
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', marginTop: 14 }}>
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: scrolled ? 'rgba(8,11,15,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Moto<span style={{ color: 'var(--green)' }}>Lucro</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {['Funcionalidades', 'Como funciona'].map(label => (
            <span key={label} style={{
              fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-muted)',
              cursor: 'pointer', transition: 'color 0.15s',
              display: 'none',
            }}
              className="nav-link"
            >{label}</span>
          ))}
          <button onClick={onOpenDashboard} style={{
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
            background: 'transparent', color: 'var(--text-muted)',
            border: '1px solid var(--border-strong)', borderRadius: 8, padding: '7px 14px',
            cursor: 'pointer', transition: 'color 0.15s',
          }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = 'var(--text)')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
          >
            Painel web
          </button>
          <button style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
            background: 'var(--green)', color: '#080b0f',
            border: 'none', borderRadius: 8, padding: '8px 18px',
            cursor: 'pointer',
          }}>
            Baixar app
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ padding: '40px 24px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Moto<span style={{ color: 'var(--green)' }}>Lucro</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
          {['Privacidade', 'Termos', 'Contato'].map(label => (
            <span key={label} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', cursor: 'pointer' }}>{label}</span>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)' }}>
          © 2026 MotoLucro
        </span>
      </div>
    </footer>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Nav onOpenDashboard={() => setShowDashboard(true)} />
      <Hero onOpenDashboard={() => setShowDashboard(true)} />
      <Problem />
      <AppPreview />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </div>
  )
}
