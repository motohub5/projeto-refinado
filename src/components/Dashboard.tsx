import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from 'recharts'

// ─── Types ───────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'relatorios' | 'historico' | 'configurar' | 'exportar'

// ─── Mock Data ───────────────────────────────────────────────────────────────

const dailyData = [
  { dia: '01/08', ganho: 320, combustivel: 48, manutencao: 12, km: 198, lucro: 260, turnos: 2 },
  { dia: '02/08', ganho: 280, combustivel: 42, manutencao: 0, km: 171, lucro: 238, turnos: 2 },
  { dia: '03/08', ganho: 0, combustivel: 0, manutencao: 0, km: 0, lucro: 0, turnos: 0 },
  { dia: '04/08', ganho: 410, combustivel: 61, manutencao: 0, km: 254, lucro: 349, turnos: 3 },
  { dia: '05/08', ganho: 365, combustivel: 55, manutencao: 25, km: 221, lucro: 285, turnos: 2 },
  { dia: '06/08', ganho: 490, combustivel: 73, manutencao: 0, km: 303, lucro: 417, turnos: 3 },
  { dia: '07/08', ganho: 520, combustivel: 78, manutencao: 0, km: 322, lucro: 442, turnos: 3 },
  { dia: '08/08', ganho: 310, combustivel: 46, manutencao: 80, km: 189, lucro: 184, turnos: 2 },
  { dia: '09/08', ganho: 295, combustivel: 44, manutencao: 0, km: 179, lucro: 251, turnos: 2 },
  { dia: '10/08', ganho: 0, combustivel: 0, manutencao: 0, km: 0, lucro: 0, turnos: 0 },
  { dia: '11/08', ganho: 440, combustivel: 66, manutencao: 0, km: 272, lucro: 374, turnos: 3 },
  { dia: '12/08', ganho: 380, combustivel: 57, manutencao: 15, km: 234, lucro: 308, turnos: 2 },
  { dia: '13/08', ganho: 470, combustivel: 70, manutencao: 0, km: 291, lucro: 400, turnos: 3 },
]

const monthlyData = [
  { mes: 'Mar', lucro: 3200, ganho: 5100, despesas: 1900 },
  { mes: 'Abr', lucro: 3680, ganho: 5600, despesas: 1920 },
  { mes: 'Mai', lucro: 3450, ganho: 5300, despesas: 1850 },
  { mes: 'Jun', lucro: 4100, ganho: 6000, despesas: 1900 },
  { mes: 'Jul', lucro: 3900, ganho: 5800, despesas: 1900 },
  { mes: 'Ago', lucro: 3268, ganho: 5080, despesas: 1812 },
]

const appData = [
  { name: 'iFood', value: 58, color: '#ef4444' },
  { name: 'Rappi', value: 24, color: '#f97316' },
  { name: 'Uber Eats', value: 18, color: '#16c784' },
]

const expenseData = [
  { name: 'Combustível', value: 68, color: '#16c784' },
  { name: 'Manutenção', value: 18, color: '#a78bfa' },
  { name: 'Seguro', value: 9, color: '#60a5fa' },
  { name: 'Outros', value: 5, color: '#f59e0b' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems: { id: View; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'relatorios', label: 'Relatórios Mensais', icon: '📊' },
  { id: 'historico', label: 'Histórico Detalhado', icon: '📋' },
  { id: 'configurar', label: 'Configurar Moto', icon: '⚙' },
  { id: 'exportar', label: 'Exportar Dados', icon: '↓' },
]

function Sidebar({ view, setView, onBack }: { view: View; setView: (v: View) => void; onBack: () => void }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Moto<span style={{ color: 'var(--green)' }}>Lucro</span>
          </span>
        </div>
        <button onClick={onBack} style={{
          width: '100%', background: 'transparent',
          border: '1px solid var(--border)', borderRadius: 8,
          padding: '6px 10px', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'color 0.15s, border-color 0.15s',
        }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.color = 'var(--text)'; el.style.borderColor = 'var(--border-strong)' }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.color = 'var(--text-muted)'; el.style.borderColor = 'var(--border)' }}
        >
          ← Voltar ao site
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const active = view === item.id
          return (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              width: '100%', background: active ? 'var(--green-dim)' : 'transparent',
              border: active ? '1px solid rgba(22,199,132,0.2)' : '1px solid transparent',
              borderRadius: 9, padding: '9px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--font-body)', fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--green)' : 'var(--text-muted)',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface-2)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' } }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bottom info */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🏍</div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>João Motoboy</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>Honda CG 160</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, color, trend }: { label: string; value: string; sub?: string; color?: string; trend?: 'up' | 'down' | 'neutral' }) {
  const trendColor = trend === 'up' ? '#16c784' : trend === 'down' ? '#ef4444' : 'var(--text-muted)'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 20px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'clamp(18px, 2.5vw, 26px)',
        fontWeight: 600, color: color || 'var(--green)',
        letterSpacing: '-0.02em', lineHeight: 1,
      }}>{value}</div>
      {sub && (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: trendColor, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{trendIcon}</span>
          <span>{sub}</span>
        </div>
      )}
    </div>
  )
}

// ─── View: Dashboard ─────────────────────────────────────────────────────────

function ViewDashboard() {
  const activeDays = dailyData.filter(d => d.lucro > 0)
  const totalGanho = activeDays.reduce((s, d) => s + d.ganho, 0)
  const totalLucro = activeDays.reduce((s, d) => s + d.lucro, 0)
  const totalKm = activeDays.reduce((s, d) => s + d.km, 0)
  const totalFuel = activeDays.reduce((s, d) => s + d.combustivel, 0)
  const totalManut = activeDays.reduce((s, d) => s + d.manutencao, 0)
  const lucroKm = totalKm > 0 ? totalLucro / totalKm : 0

  const chartData = dailyData.filter(d => d.lucro > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.1em', marginBottom: 4 }}>VISÃO GERAL</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Agosto 2026
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>Turno ativo agora</span>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <KPICard label="Lucro Líquido" value={fmt(totalLucro)} sub="+8,3% vs mês anterior" trend="up" />
        <KPICard label="Receita Bruta" value={fmt(totalGanho)} sub="+5,1% vs mês anterior" trend="up" />
        <KPICard label="Total Despesas" value={fmt(totalFuel + totalManut)} sub="Combustível + manutenção" trend="neutral" color="var(--text)" />
        <KPICard label="Lucro por KM" value={`R$ ${lucroKm.toFixed(2)}`} sub="+R$0,09 vs mês anterior" trend="up" />
        <KPICard label="KM Rodados" value={`${totalKm.toLocaleString('pt-BR')} km`} sub={`${activeDays.length} dias ativos`} trend="neutral" color="var(--text)" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(240px, 320px)', gap: 16, alignItems: 'start' }}>
        {/* Line chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Evolução do Lucro Diário</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Agosto — dias trabalhados</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="dia" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#4a5568' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#4a5568' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="lucro" stroke="#16c784" strokeWidth={2} dot={{ fill: '#16c784', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#16c784' }} name="Lucro" />
              <Line type="monotone" dataKey="ganho" stroke="rgba(22,199,132,0.25)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Ganho bruto" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Despesas por categoria</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Distribuição %</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {expenseData.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {expenseData.map(e => (
              <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>{e.name}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apps distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Ganhos por plataforma</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>% do faturamento total</div>
          {appData.map(app => (
            <div key={app.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)' }}>{app.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: app.color }}>{app.value}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${app.value}%`, background: app.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent shifts */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Últimos turnos</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Resultado por dia</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {dailyData.filter(d => d.lucro > 0).slice(-5).reverse().map((d, i) => (
              <div key={d.dia} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{d.dia}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-dim)' }}>{d.km} km · {d.turnos} turno{d.turnos > 1 ? 's' : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>{fmt(d.lucro)}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)' }}>R$ {(d.lucro / d.km).toFixed(2)}/km</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── View: Relatórios ─────────────────────────────────────────────────────────

function ViewRelatorios() {
  const [selectedMonth, setSelectedMonth] = useState(5)
  const months = ['Mar 26', 'Abr 26', 'Mai 26', 'Jun 26', 'Jul 26', 'Ago 26']

  const current = monthlyData[selectedMonth] ?? monthlyData[monthlyData.length - 1]!
  const prev = monthlyData[selectedMonth - 1]
  const diff = prev ? ((current.lucro - prev.lucro) / prev.lucro * 100).toFixed(1) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.1em', marginBottom: 4 }}>ANÁLISE MENSAL</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Relatórios Mensais</h1>
      </div>

      {/* Month selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {months.map((m, i) => (
          <button key={m} onClick={() => setSelectedMonth(i)} style={{
            padding: '7px 16px', borderRadius: 99,
            border: selectedMonth === i ? '1px solid var(--green)' : '1px solid var(--border)',
            background: selectedMonth === i ? 'var(--green-dim)' : 'transparent',
            color: selectedMonth === i ? 'var(--green)' : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer',
            transition: 'all 0.15s',
          }}>{m}</button>
        ))}
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
        <KPICard label="Lucro Líquido" value={fmt(current.lucro)} {...(diff ? { sub: `${diff}% vs mês anterior` } : {})} trend={diff && parseFloat(diff) >= 0 ? 'up' : 'down'} />
        <KPICard label="Receita Bruta" value={fmt(current.ganho)} color="var(--text)" />
        <KPICard label="Total Despesas" value={fmt(current.despesas)} color="#ef4444" />
      </div>

      {/* Bar chart comparison */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Comparativo — últimos 6 meses</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Lucro líquido por mês</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="mes" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#4a5568' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: '#4a5568' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${v}`} width={55} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="lucro" radius={[6, 6, 0, 0]} name="Lucro">
              {monthlyData.map((_, i) => (
                <Cell key={i} fill={i === selectedMonth ? '#16c784' : 'rgba(22,199,132,0.25)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly breakdown table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>Detalhamento — {months[selectedMonth]}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['Categoria', 'Valor', '% do Bruto'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', fontWeight: 500, textAlign: 'left', letterSpacing: '0.05em' }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Receita Bruta', value: current.ganho, pct: 100, color: 'var(--text)' },
                { label: 'Combustível', value: Math.round(current.despesas * 0.68), pct: Math.round(current.despesas * 0.68 / current.ganho * 100), color: '#f59e0b' },
                { label: 'Manutenção', value: Math.round(current.despesas * 0.18), pct: Math.round(current.despesas * 0.18 / current.ganho * 100), color: '#a78bfa' },
                { label: 'Seguro', value: Math.round(current.despesas * 0.09), pct: Math.round(current.despesas * 0.09 / current.ganho * 100), color: '#60a5fa' },
                { label: 'Outros', value: Math.round(current.despesas * 0.05), pct: Math.round(current.despesas * 0.05 / current.ganho * 100), color: 'var(--text-muted)' },
                { label: 'Lucro Líquido', value: current.lucro, pct: Math.round(current.lucro / current.ganho * 100), color: '#16c784' },
              ].map((row, i, arr) => (
                <tr key={row.label} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', background: i === arr.length - 1 ? 'var(--green-dim)' : 'transparent' }}>
                  <td style={{ padding: '12px 20px', fontFamily: 'var(--font-body)', fontSize: 13, color: row.color, fontWeight: i === arr.length - 1 ? 600 : 400 }}>{row.label}</td>
                  <td style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: 13, color: row.color, fontWeight: i === arr.length - 1 ? 600 : 400 }}>{fmt(row.value)}</td>
                  <td style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{row.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── View: Histórico ──────────────────────────────────────────────────────────

function ViewHistorico() {
  const [filter, setFilter] = useState<'todos' | 'bom' | 'fraco'>('todos')
  const [sort, setSort] = useState<'data' | 'lucro' | 'km'>('data')

  const filtered = useMemo(() => {
    return dailyData
      .filter(d => d.lucro > 0)
      .filter(d => {
        if (filter === 'bom') return d.lucro / d.km >= 1.6
        if (filter === 'fraco') return d.lucro / d.km < 1.6
        return true
      })
      .sort((a, b) => {
        if (sort === 'lucro') return b.lucro - a.lucro
        if (sort === 'km') return b.km - a.km
        return 0
      })
  }, [filter, sort])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.1em', marginBottom: 4 }}>REGISTROS</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Histórico Detalhado</h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'todos', label: 'Todos os dias' },
            { id: 'bom', label: 'Dias bons (≥ R$1,60/km)' },
            { id: 'fraco', label: 'Dias fracos' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id as any)} style={{
              padding: '6px 14px', borderRadius: 99,
              border: filter === f.id ? '1px solid var(--green)' : '1px solid var(--border)',
              background: filter === f.id ? 'var(--green-dim)' : 'transparent',
              color: filter === f.id ? 'var(--green)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontSize: 12, cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)' }}>Ordenar por</span>
          <select value={sort} onChange={e => setSort(e.target.value as any)} style={{
            background: 'var(--surface)', border: '1px solid var(--border-strong)',
            borderRadius: 8, padding: '6px 10px', color: 'var(--text)',
            fontFamily: 'var(--font-body)', fontSize: 12, cursor: 'pointer',
          }}>
            <option value="data">Data</option>
            <option value="lucro">Lucro</option>
            <option value="km">KM rodado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                {['Data', 'KM Rodados', 'Ganho Bruto', 'Combustível', 'Manutenção', 'Lucro Líquido', 'R$/km', 'Turnos'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', fontWeight: 500, textAlign: 'left', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const rKm = d.lucro / d.km
                const isGood = rKm >= 1.6
                return (
                  <tr key={d.dia} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap' }}>{d.dia}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{d.km} km</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{fmt(d.ganho)}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#f59e0b' }}>{fmt(d.combustivel)}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a78bfa' }}>{d.manutencao > 0 ? fmt(d.manutencao) : '—'}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>{fmt(d.lucro)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                        color: isGood ? 'var(--green)' : '#ef4444',
                        background: isGood ? 'var(--green-dim)' : 'rgba(239,68,68,0.1)',
                        padding: '2px 8px', borderRadius: 99,
                      }}>R$ {rKm.toFixed(2)}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>{d.turnos}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)' }}>{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            Total: <strong style={{ color: 'var(--green)' }}>{fmt(filtered.reduce((s, d) => s + d.lucro, 0))}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── View: Configurar Moto ────────────────────────────────────────────────────

function ViewConfigurar() {
  const [moto, setMoto] = useState({
    modelo: 'Honda CG 160',
    ano: '2022',
    placa: 'ABC-1D34',
    consumo: '35',
    preco_combustivel: '6.49',
    seguro_mensal: '89',
    financiamento_mensal: '420',
    ipva_anual: '380',
    manutencao_km: '3000',
    custo_manutencao: '150',
  })

  const field = (label: string, key: keyof typeof moto, prefix?: string, suffix?: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, overflow: 'hidden' }}>
        {prefix && <span style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', background: 'var(--surface-2)', borderRight: '1px solid var(--border)' }}>{prefix}</span>}
        <input
          value={moto[key]}
          onChange={e => setMoto(prev => ({ ...prev, [key]: e.target.value }))}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)',
          }}
        />
        {suffix && <span style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>{suffix}</span>}
      </div>
    </div>
  )

  const seguroMensal = parseFloat(moto.seguro_mensal) || 0
  const financMensal = parseFloat(moto.financiamento_mensal) || 0
  const ipvaMensal = (parseFloat(moto.ipva_anual) || 0) / 12
  const manutMensal = (parseFloat(moto.custo_manutencao) || 0) / (parseFloat(moto.manutencao_km) || 1) * 1500
  const custoFixoMensal = seguroMensal + financMensal + ipvaMensal + manutMensal

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.1em', marginBottom: 4 }}>CONFIGURAÇÕES</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Configurar Moto</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {/* Dados da moto */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>Dados da moto</div>
          {field('Modelo', 'modelo')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('Ano', 'ano')}
            {field('Placa', 'placa')}
          </div>
          {field('Consumo médio', 'consumo', undefined, 'km/L')}
          {field('Preço do combustível', 'preco_combustivel', 'R$', '/L')}
        </div>

        {/* Custos fixos */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>Custos fixos mensais</div>
          {field('Seguro mensal', 'seguro_mensal', 'R$')}
          {field('Financiamento mensal', 'financiamento_mensal', 'R$')}
          {field('IPVA anual (rateado automaticamente)', 'ipva_anual', 'R$', '/ano')}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--text-muted)' }}>Manutenção preventiva</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {field('A cada quantos km', 'manutencao_km', undefined, 'km')}
              {field('Custo estimado', 'custo_manutencao', 'R$')}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo do custo */}
      <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(22,199,132,0.25)', borderRadius: 14, padding: '20px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--green)', marginBottom: 16 }}>Resumo do custo fixo mensal estimado</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {[
            { label: 'Seguro', value: seguroMensal },
            { label: 'Financiamento', value: financMensal },
            { label: 'IPVA rateado', value: ipvaMensal },
            { label: 'Manutenção estimada', value: manutMensal },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{fmt(item.value)}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(22,199,132,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--text)' }}>Total mensal</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{fmt(custoFixoMensal)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
          background: 'var(--green)', color: '#080b0f',
          border: 'none', borderRadius: 12, padding: '12px 28px', cursor: 'pointer',
          boxShadow: '0 0 24px var(--green-glow)',
        }}>
          Salvar configurações
        </button>
      </div>
    </div>
  )
}

// ─── View: Exportar ───────────────────────────────────────────────────────────

function ViewExportar() {
  const [period, setPeriod] = useState('agosto-2026')
  const [format, setFormat] = useState<'csv' | 'pdf'>('pdf')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', letterSpacing: '0.1em', marginBottom: 4 }}>EXPORTAÇÃO</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Exportar Dados</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Export options */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>Configurar exportação</div>

          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Período</div>
            <select value={period} onChange={e => setPeriod(e.target.value)} style={{
              width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border-strong)',
              borderRadius: 10, padding: '10px 12px', color: 'var(--text)',
              fontFamily: 'var(--font-mono)', fontSize: 13, cursor: 'pointer',
            }}>
              <option value="agosto-2026">Agosto 2026</option>
              <option value="julho-2026">Julho 2026</option>
              <option value="junho-2026">Junho 2026</option>
              <option value="q3-2026">3º Trimestre 2026</option>
              <option value="2026">Ano 2026 (completo)</option>
            </select>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Formato</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['pdf', 'csv'] as const).map(f => (
                <button key={f} onClick={() => setFormat(f)} style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  border: format === f ? '1px solid var(--green)' : '1px solid var(--border)',
                  background: format === f ? 'var(--green-dim)' : 'var(--surface-2)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 20 }}>{f === 'pdf' ? '📄' : '📊'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: format === f ? 'var(--green)' : 'var(--text-muted)' }}>{f.toUpperCase()}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>
                    {f === 'pdf' ? 'Relatório visual' : 'Planilha de dados'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Incluir no relatório</div>
            {[
              { label: 'Resumo financeiro', checked: true },
              { label: 'Histórico diário', checked: true },
              { label: 'Gráfico de evolução', checked: true },
              { label: 'Despesas por categoria', checked: true },
              { label: 'Dados por plataforma (iFood, Rappi...)', checked: false },
            ].map(opt => (
              <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={opt.checked} style={{ accentColor: 'var(--green)', width: 14, height: 14 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text)' }}>{opt.label}</span>
              </label>
            ))}
          </div>

          <button style={{
            width: '100%', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
            background: 'var(--green)', color: '#080b0f',
            border: 'none', borderRadius: 12, padding: '14px',
            cursor: 'pointer', boxShadow: '0 0 24px var(--green-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span>↓</span> Baixar {format.toUpperCase()}
          </button>
        </div>

        {/* Tips for MEI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
              🧾 Dicas para MEI
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Guarde os relatórios mensais exportados pelo MotoLucro para comprovar receita no PGDAS-D.',
                'O CSV é ideal para importar no Conta Azul ou em planilhas do contador.',
                'Declare como "Transporte de Passageiros e Cargas" (CNAE 4930-2/02) se for MEI.',
                'Receita bruta anual MEI: limite de R$ 81.000,00 (2026). Acompanhe pelo painel.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--green-dim)', border: '1px solid rgba(22,199,132,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)' }}>{i + 1}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress toward MEI limit */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Limite MEI 2026</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Receita bruta acumulada no ano</div>
            <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', width: '41%', background: 'var(--green)', borderRadius: 99, boxShadow: '0 0 8px var(--green-glow)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)' }}>R$ 33.320,00</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)' }}>de R$ 81.000,00</span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>41% do limite · 5 meses restantes</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard root ──────────────────────────────────────────────────────────

export default function Dashboard({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<View>('dashboard')

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <ViewDashboard />
      case 'relatorios': return <ViewRelatorios />
      case 'historico': return <ViewHistorico />
      case 'configurar': return <ViewConfigurar />
      case 'exportar': return <ViewExportar />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar view={view} setView={setView} onBack={onBack} />
      <main style={{ flex: 1, minWidth: 0, padding: '32px 28px', overflowY: 'auto', maxHeight: '100vh' }}>
        {renderView()}
      </main>
    </div>
  )
}
