'use client';

import React, { useState, useMemo } from 'react';
import { Button, Input, EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Edit, Save, X, Plus, Trash2, Clock } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, TimePeriodEntry } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props { config: PricingConfig; }

const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
type PeriodRow = { id: string; start: string; end: string; days: number[]; };

function DaysEditor({ days, onChange }: { days: number[]; onChange: (d: number[]) => void }) {
  const toggle = (day: number) => {
    onChange(days.includes(day) ? days.filter(d => d !== day) : [...days, day].sort());
  };
  return (
    <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
      {DAY_LABELS.map((label, idx) => (
        <button key={idx} type="button" onClick={() => toggle(idx)} style={{
          padding:'2px 8px', fontSize:'11px', borderRadius:'4px',
          border:'1px solid #ccc', cursor:'pointer',
          background: days.includes(idx) ? '#3b82f6' : 'transparent',
          color: days.includes(idx) ? '#fff' : 'inherit',
        }}>{label}</button>
      ))}
    </div>
  );
}

export function TimePeriodConfigTab({ config }: Props) {
  const { updateTimePeriodConfig, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const defaults: Record<string, TimePeriodEntry> = {
    night: { start:'22:00', end:'06:00', days:[0,1,2,3,4,5,6] },
    weekend: { days:[0,6] },
    peak_morning: { start:'07:00', end:'09:00', days:[1,2,3,4,5] },
    peak_evening: { start:'17:00', end:'19:00', days:[1,2,3,4,5] },
  };
  const [edited, setEdited] = useState<Record<string, TimePeriodEntry>>(config.time_period_config || defaults);

  const handleUpdate = (key: string, field: string, value: any) => {
    const cur = edited[key]; if (!cur) return;
    setEdited({ ...edited, [key]: { ...cur, [field]: value } });
  };
  const handleDelete = (key: string) => {
    const next = { ...edited }; delete next[key]; setEdited(next);
  };
  const handleAdd = () => {
    const k = `period_${Date.now()}`;
    setEdited({ ...edited, [k]: { start:'', end:'', days:[] } });
  };
  const handleSave = async () => {
    try { await updateTimePeriodConfig?.(edited); setIsEditing(false); } catch {}
  };
  const handleCancel = () => {
    setEdited(config.time_period_config || defaults); setIsEditing(false);
  };

  const rows: PeriodRow[] = useMemo(() =>
    Object.entries(edited).map(([key, p]) => ({
      id: key, start: p.start || '', end: p.end || '', days: p.days || [],
    })), [edited]);

  const columns: Column<PeriodRow>[] = useMemo(() => [
    { id:'name', header:'Period', accessor:(r)=>r.id,
      cell:(r) => <div className={styles.flexRow}><Clock className="h-4 w-4" /><strong>{r.id.replace(/_/g,' ')}</strong></div> },
    { id:'start', header:'Start', accessor:(r)=>r.start,
      cell:(r) => isEditing
        ? <Input type="time" value={r.start} onChange={(e:any) => handleUpdate(r.id,'start',e.target.value)} />
        : (r.start || '—') },
    { id:'end', header:'End', accessor:(r)=>r.end,
      cell:(r) => isEditing
        ? <Input type="time" value={r.end} onChange={(e:any) => handleUpdate(r.id,'end',e.target.value)} />
        : (r.end || '—') },
    { id:'days', header:'Days', accessor:(r)=>r.days.join(','),
      cell:(r) => isEditing
        ? <DaysEditor days={r.days} onChange={(d) => handleUpdate(r.id,'days',d)} />
        : <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
            {DAY_LABELS.map((l,i) => <span key={i} className={`${styles.statusBadge} ${r.days.includes(i)?styles.statusActive:styles.statusInactive}`} style={{fontSize:'11px',padding:'2px 6px'}}>{l}</span>)}
          </div> },
    { id:'actions', header:'', accessor:()=>'',
      cell:(r) => isEditing ? <Button variant="secondary" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button> : null },
  ], [isEditing, edited]);

  return (
    <div className={styles.section}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'var(--spacing-4)' }}>
        <div>
          <h2 className={styles.sectionTitle}>Time Period Config</h2>
          <p className={styles.sectionDescription}>Define time periods used by the pricing engine (night, weekend, peak hours)</p>
        </div>
        <div className={styles.buttonGroup}>
          {isEditing ? (<>
            <Button variant="primary" onClick={handleAdd}><Plus className="h-4 w-4" /> Add Period</Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4" /> Save</Button>
            <Button variant="secondary" onClick={handleCancel}><X className="h-4 w-4" /> Cancel</Button>
          </>) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /> Edit</Button>
          )}
        </div>
      </div>
      <EnterpriseDataTable columns={columns} data={rows} stickyHeader />
    </div>
  );
}
