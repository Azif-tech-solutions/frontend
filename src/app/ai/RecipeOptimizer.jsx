import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Page, Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ConfidenceMeter, ForecastBadge, SourceCite, HumanReviewNotice } from './aiParts.jsx'
import { recipeOptimisations } from '../sampleAI.js'
import { money, moneyShort } from '../utils.js'

const SPEC_TONE = { 'Within spec': 'success', 'Near tolerance limit': 'warning', 'Outside spec': 'danger' }

export default function RecipeOptimizer({ leaf, moduleLabel, parentLabel }) {
  const [selected, setSelected] = useState(recipeOptimisations[0].recipe)
  const opt = recipeOptimisations.find((o) => o.recipe === selected) || recipeOptimisations[0]

  const saving = opt.currentCost - opt.proposedCost
  const savingPct = (saving / opt.currentCost) * 100
  const totalSaving = recipeOptimisations.reduce((n, o) => n + (o.currentCost - o.proposedCost), 0)

  const changeColumns = [
    { key: 'material', label: 'Material', width: 250 },
    { key: 'from', label: 'Current', width: 150, align: 'right', mono: true },
    {
      key: 'arrow', label: '', width: 60, sortable: false,
      render: () => <Icon name="arrow-right" size={13} color="var(--text-subtle)" />,
    },
    { key: 'to', label: 'Proposed', width: 150, align: 'right', mono: true },
    {
      key: 'delta', label: 'Cost effect', width: 170, align: 'right', mono: true,
      render: (c) => (
        <span style={{ color: c.delta < 0 ? 'var(--success)' : 'var(--danger)' }}>
          {c.delta < 0 ? '−' : '+'}{money(Math.abs(c.delta))}
        </span>
      ),
    },
    { key: 'note', label: 'Constraint check', width: 320 },
  ]

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Recipe Cost Optimizer'}
        icon={leaf?.icon}
        description="Analyses past production runs and current material costs to propose lower-cost mixes that stay inside each recipe's registered quality tolerances, showing the cost effect before a run is finalised."
        meta={<ForecastBadge>AI suggestion</ForecastBadge>}
        actions={
          <>
            <Button variant="secondary" iconLeft="calculator">Open Production Cost Calculator</Button>
            <Button variant="secondary" iconLeft="refresh-cw">Recompute</Button>
          </>
        }
      />

      <HumanReviewNotice action="approve a substitution">
        No recipe is changed by this screen. Every proposed substitution is routed to Management and
        Administration for approval before it can be applied to a live production run, consistent with the
        landing-cost visibility rules that already govern costing.
      </HumanReviewNotice>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 20, alignItems: 'start' }} className="zq-formlayout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <Panel title="Recipes with a proposed optimisation" description="Select one to see the substitution and its cost effect.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {recipeOptimisations.map((o) => {
                const on = o.recipe === selected
                const s = o.currentCost - o.proposedCost
                return (
                  <div
                    key={o.recipe}
                    onClick={() => setSelected(o.recipe)}
                    style={{
                      padding: '13px 15px', cursor: 'pointer',
                      background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                      border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                      borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      <span style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{o.recipe.split(' · ')[1]}</span>
                      <Badge tone={SPEC_TONE[o.spec] || 'neutral'}>{o.spec}</Badge>
                    </div>
                    <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-md)/1 var(--font-mono)', color: 'var(--success)' }}>
                      −{money(s)} <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>per {o.batch}</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <ConfidenceMeter value={o.confidence} compact />
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title={`Proposed substitution — ${opt.recipe}`} description={`Batch size ${opt.batch}. Every change is checked against the recipe's registered tolerances.`} padding={0}>
            <ReportTable
              columns={changeColumns}
              rows={opt.changes}
              rowKey={(c) => c.material}
              stickyHeader={false}
              style={{ border: 'none', borderRadius: 0 }}
            />
          </Panel>

          {opt.spec !== 'Within spec' && (
            <Callout tone="warning" icon="triangle-alert" title="Near the tolerance limit">
              This substitution stays inside the registered specification but sits close to its upper bound.
              Quality Control should sign off before it reaches a production run.
            </Callout>
          )}

          <div style={{ padding: '0 2px' }}>
            <SourceCite sources={['Production Cost Calculator', 'In-House Recipes — Register', 'Comprehensive Stock Report']} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Cost comparison">
            <MetaRow label="Current landing cost" value={money(opt.currentCost)} mono />
            <MetaRow label="Proposed landing cost" value={money(opt.proposedCost)} mono tone="positive" />
            <MetaRow label="Saving per batch" value={money(saving)} mono tone="positive" />
            <MetaRow label="Saving %" value={`${savingPct.toFixed(1)}%`} mono tone="positive" />
            <MetaRow label="Specification" value={opt.spec} />
            <div style={{ marginTop: 14 }}>
              <ConfidenceMeter value={opt.confidence} />
            </div>
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--accent-green-fg)' }}>Projected saving</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--accent-green-fg)' }}>
                {money(saving)}
              </div>
              <div style={{ marginTop: 6, font: 'var(--type-caption)', color: 'var(--accent-green-fg)' }}>per {opt.batch} batch</div>
            </div>
          </Panel>

          <Panel title="Approval">
            <MetaRow label="Status" value={opt.status} />
            <MetaRow label="Routes to" value="Management / Administration" />
            <MetaRow label="Applies to" value="Future runs only" />
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button fullWidth iconLeft="check">Approve substitution</Button>
              <Button fullWidth variant="secondary">Request QC review</Button>
              <Button fullWidth variant="ghost">Dismiss suggestion</Button>
            </div>
          </Panel>

          <Panel title="Across all recipes">
            <MetaRow label="Optimisations proposed" value={recipeOptimisations.length} mono />
            <MetaRow label="Combined saving per batch" value={moneyShort(totalSaving)} mono tone="positive" />
            <MetaRow label="Awaiting approval" value={recipeOptimisations.filter((o) => o.status.includes('Awaiting')).length} mono />
          </Panel>
        </div>
      </div>
    </Page>
  )
}
