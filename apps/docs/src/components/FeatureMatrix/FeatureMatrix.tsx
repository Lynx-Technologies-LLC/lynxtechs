import React, {useState} from 'react';
import styles from './FeatureMatrix.module.css';
import {
  CATEGORIES,
  FEATURE_PACKS,
  STATUS_LABEL,
  type Status,
  type Category,
} from './features.data';

const ALL_STATUSES: Status[] = ['available', 'in-development', 'planned', 'not-planned'];

function StatusBadge({status}: {status: Status}) {
  return (
    <span className={`${styles.badge} ${styles[`badge--${status}`]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function StatCard({count, label, status}: {count: number; label: string; status: Status}) {
  return (
    <div className={`${styles.statCard} ${styles[`statCard--${status}`]}`}>
      <span className={styles.statCount}>{count}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.pill} ${active ? styles['pill--active'] : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function CategoryTable({
  cat,
  filter,
}: {
  cat: Category;
  filter: Status | 'all';
}) {
  const rows = cat.features.filter((f) => filter === 'all' || f.status === filter);
  if (rows.length === 0) return null;
  return (
    <div className={styles.categoryBlock}>
      <h3 className={styles.categoryTitle}>{cat.title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colFeature}>Feature</th>
            <th className={styles.colStatus}>Status</th>
            <th className={styles.colNote}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.name} className={styles[`row--${f.status}`]}>
              <td className={styles.cellFeature}>{f.name}</td>
              <td className={styles.cellStatus}>
                <StatusBadge status={f.status} />
              </td>
              <td className={styles.cellNote}>{f.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FeatureMatrix() {
  const [filter, setFilter] = useState<Status | 'all'>('all');

  const allFeatures = CATEGORIES.flatMap((c) => c.features);
  const counts: Record<Status, number> = {
    'available': allFeatures.filter((f) => f.status === 'available').length,
    'in-development': allFeatures.filter((f) => f.status === 'in-development').length,
    'planned': allFeatures.filter((f) => f.status === 'planned').length,
    'not-planned': allFeatures.filter((f) => f.status === 'not-planned').length,
  };

  const totalVisible =
    filter === 'all'
      ? allFeatures.length
      : allFeatures.filter((f) => f.status === filter).length;

  return (
    <div className={styles.root}>
      {/* Summary stat cards */}
      <div className={styles.statsRow}>
        <StatCard count={counts['available']} label="Available" status="available" />
        <StatCard count={counts['in-development']} label="In development" status="in-development" />
        <StatCard count={counts['planned']} label="Planned" status="planned" />
        <StatCard count={counts['not-planned']} label="Not planned" status="not-planned" />
      </div>

      {/* Filter pills */}
      <div className={styles.filterRow}>
        <FilterPill
          label={`All (${allFeatures.length})`}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {ALL_STATUSES.map((s) => (
          <FilterPill
            key={s}
            label={`${STATUS_LABEL[s]} (${counts[s]})`}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {totalVisible === 0 && (
        <p className={styles.emptyMsg}>No features match the selected filter.</p>
      )}

      {/* Per-category tables */}
      {CATEGORIES.map((cat) => (
        <CategoryTable key={cat.title} cat={cat} filter={filter} />
      ))}

      {/* Feature Packs */}
      {(() => {
        const packs = FEATURE_PACKS.filter((f) => filter === 'all' || f.status === filter);
        if (packs.length === 0) return null;
        return (
          <div className={styles.categoryBlock}>
            <h3 className={styles.categoryTitle}>Device profiles and feature packs</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.colFeature}>Feature pack</th>
                  <th className={styles.colStatus}>Status</th>
                  <th className={styles.colNote}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {packs.map((f) => (
                  <tr key={f.name} className={styles[`row--${f.status}`]}>
                    <td className={styles.cellFeature}>{f.name}</td>
                    <td className={styles.cellStatus}>
                      <StatusBadge status={f.status} />
                    </td>
                    <td className={styles.cellNote}>{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}
    </div>
  );
}
