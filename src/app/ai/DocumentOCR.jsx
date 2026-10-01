import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { Page, Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { ConfidenceMeter, SourceCite, HumanReviewNotice } from './aiParts.jsx'
import { confidenceColour } from './aiConfidence.js'
import { ocrJobs, ocrExtraction } from '../sampleAI.js'

const STATUS_TONE = { 'Awaiting review': 'warning', Confirmed: 'success', Discarded: 'neutral' }

export default function DocumentOCR({ leaf, moduleLabel, parentLabel,onNavigate }) {
  const [values, setValues] = useState(
    Object.fromEntries(ocrExtraction.fields.map((f) => [f.label, f.value ?? '']))
  )

  const uncertain = ocrExtraction.fields.filter((f) => f.confidence > 0 && f.confidence < 80)
  const missing = ocrExtraction.fields.filter((f) => f.confidence === 0)
  const confident = ocrExtraction.fields.filter((f) => f.confidence >= 80)
  const stillBlank = ocrExtraction.fields.filter((f) => !values[f.label])

  const jobColumns = [
    { key: 'ref', label: 'Job', width: 130, mono: true },
    { key: 'uploaded', label: 'Uploaded', width: 190 },
    { key: 'file', label: 'Document', width: 300, mono: true },
    { key: 'docType', label: 'Type', width: 170 },
    { key: 'pages', label: 'Pages', width: 100, align: 'right', mono: true },
    { key: 'by', label: 'Uploaded by', width: 160 },
    {
      key: 'status', label: 'Status', width: 175,
      render: (j) => <Badge tone={STATUS_TONE[j.status] || 'neutral'}>{j.status}</Badge>,
    },
  ]

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Document OCR Capture'}
        icon={leaf?.icon}
        description="Reads a photographed or scanned delivery note or supplier invoice and pre-fills the matching Material/Recipe Receive or expense entry fields, so they can be checked rather than typed."
        actions={
          <>
            <Button variant="secondary" iconLeft="camera" onClick={()=>{
              onNavigate({ id: 'ai.eri', view: 'ai.eri', label: 'ERI' })
            }}>Photograph document</Button>
            <Button iconLeft="upload">Upload document</Button>
          </>
        }
      />

      <HumanReviewNotice action="confirm the extracted values">
        Nothing extracted here is saved on its own. Every field is presented for review and correction, and the
        record is only created when an authorised user confirms it — under the same permissions that govern
        creating a Material Receive or invoice entry by hand.
      </HumanReviewNotice>

      <div style={{ display: 'grid', gridTemplateColumns: '340px minmax(0, 1fr)', gap: 20, alignItems: 'start' }} className="zq-formlayout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Source document" description="Retained and linked to the resulting record for audit.">
            <div style={{
              display: 'grid', placeItems: 'center', gap: 10, padding: '36px 16px',
              background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            }}>
              <Icon name="file-image" size={34} color="var(--text-subtle)" />
              <div style={{ font: 'var(--fw-medium) var(--text-xs)/1.4 var(--font-mono)', color: 'var(--text-muted)', textAlign: 'center', wordBreak: 'break-all' }}>
                {ocrExtraction.file}
              </div>
              <Button size="sm" variant="secondary" iconLeft="eye">View full size</Button>
            </div>
            <div style={{ marginTop: 14 }}>
              <MetaRow label="Job" value={ocrExtraction.ref} mono />
              <MetaRow label="Document type" value={ocrExtraction.docType} />
              <MetaRow label="Fields read" value={`${confident.length} of ${ocrExtraction.fields.length}`} mono />
              <MetaRow label="Retained" value="Linked to record" />
            </div>
          </Panel>

          <Panel title="Extraction quality">
            <MetaRow label="High confidence" value={confident.length} mono tone="positive" />
            <MetaRow label="Needs checking" value={uncertain.length} mono tone={uncertain.length ? 'negative' : undefined} />
            <MetaRow label="Could not read" value={missing.length} mono tone={missing.length ? 'negative' : undefined} />
            <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Fields the model could not read confidently are flagged for manual entry rather than guessed at
              or silently left blank.
            </div>
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <Panel
            title="Extracted fields"
            description="Check each value against the document. Amend anything the model read incorrectly before confirming."
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ocrExtraction.fields.map((f) => {
                const unread = f.confidence === 0
                const shaky = f.confidence > 0 && f.confidence < 80
                return (
                  <div key={f.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 190px', gap: 14, alignItems: 'end' }}>
                    <Input
                      label={f.label}
                      value={values[f.label]}
                      onChange={(e) => setValues((s) => ({ ...s, [f.label]: e.target.value }))}
                      placeholder={unread ? 'Could not read — enter manually' : ''}
                      error={unread && !values[f.label] ? 'Not found on the document' : undefined}
                      hint={!unread ? `Fills “${f.target}”` : undefined}
                    />
                    <div style={{ paddingBottom: 6 }}>
                      {unread ? (
                        <Badge tone="danger">Not read</Badge>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                          <ConfidenceMeter value={f.confidence} compact />
                          {shaky && <Icon name="triangle-alert" size={13} color={confidenceColour(f.confidence)} />}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          {(uncertain.length > 0 || missing.length > 0) && (
            <Callout tone="warning" icon="triangle-alert" title={`${uncertain.length + missing.length} fields need your attention`}>
              {missing.length > 0 && <>{missing.map((f) => f.label).join(' and ')} could not be read from the document at all. </>}
              {uncertain.length > 0 && <>{uncertain.map((f) => f.label).join(' and ')} were read with lower confidence — check them against the original before confirming.</>}
            </Callout>
          )}

          <Panel title="Confirm">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Button iconLeft="check" disabled={stillBlank.length > 0}>Create Material Receive record</Button>
              <Button variant="secondary">Save as draft</Button>
              <Button variant="ghost">Discard extraction</Button>
            </div>
            {stillBlank.length > 0 && (
              <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                {stillBlank.length} field{stillBlank.length === 1 ? '' : 's'} still empty — fill them in before the
                record can be created.
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <SourceCite sources={['Material/Recipe Receive Report', 'Electronic Invoicing']} />
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Recent extractions" description="Uploaded documents and what became of them." padding={0}>
        <ReportTable
          columns={jobColumns}
          rows={ocrJobs}
          rowKey={(j) => j.ref}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </Page>
  )
}
