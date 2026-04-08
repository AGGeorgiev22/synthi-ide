"use client";
import React, { useState, useMemo } from "react";
import { COLLECTIBLE_ITEMS, RARITY } from "@/hooks/usePlaygroundCollection";

const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary', 'mythic', 'transcendent', 'secret'];
const TABS = [{ key: 'all', label: 'All' }, ...RARITY_ORDER.map(r => ({ key: r, label: RARITY[r].label }))];

export default function PlaygroundJournal({ snapshot, canSeeRareHints, canSeeEpicHints, canSeeLegendaryHints, prestigeLevel = 0, onReset, onClose }) {
  const [tab, setTab] = useState('all');

  const items = useMemo(() => {
    const list = tab === 'all' ? COLLECTIBLE_ITEMS : COLLECTIBLE_ITEMS.filter(i => i.rarity === tab);
    return list.map(item => ({
      ...item,
      unlocked: !!snapshot.items[item.id],
      unlockedAt: snapshot.items[item.id]?.unlockedAt ?? null,
      rarityData: RARITY[item.rarity],
    }));
  }, [tab, snapshot]);

  const totalCollected = snapshot.totalCollected;
  const totalItems = COLLECTIBLE_ITEMS.length;
  const pct = Math.round((totalCollected / totalItems) * 100);

  // Determine hint visibility per rarity
  const shouldShowHint = (item) => {
    if (item.unlocked) return true; // always show unlocked
    if (item.rarity === 'common') return true;
    if (item.rarity === 'rare') return canSeeRareHints;
    if (item.rarity === 'epic') return canSeeEpicHints;
    if (item.rarity === 'legendary') return canSeeLegendaryHints;
    if (item.rarity === 'mythic') return canSeeLegendaryHints;
    if (item.rarity === 'transcendent') return canSeeLegendaryHints;
    if (item.rarity === 'secret') return true; // always show the mystery slot
    return false;
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[130] w-[380px] max-h-[85vh] rounded-2xl border border-white/10 bg-[#0d1114]/95 backdrop-blur-xl shadow-2xl flex flex-col"
      data-playground-control
      style={{ animation: 'journalSlideIn 0.35s ease-out both' }}
    >
      {/* Header */}
      <div className="p-4 pb-2 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span className="font-mono text-[11px] tracking-[0.24em] text-slate-300 font-bold">COLLECTION</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-slate-400">{totalCollected}/{totalItems}</span>
          {prestigeLevel > 0 && <span className="ml-1 text-[10px] text-amber-300">{'⭐'.repeat(Math.min(prestigeLevel, 5))} P{prestigeLevel}</span>}
        </div>
        <button
          onClick={onClose}
          className="px-2 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          data-playground-control
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FBBF24, #F472B6)'
                : 'linear-gradient(90deg, #58A4B0, #327464)',
              backgroundSize: pct === 100 ? '300% 100%' : '100% 100%',
              animation: pct === 100 ? 'journalRainbow 3s linear infinite' : 'none',
            }}
          />
        </div>
        <div className="text-right text-[10px] font-mono text-slate-600 mt-1">{pct}% complete</div>
      </div>

      {/* Rarity tabs */}
      <div className="px-4 pb-2 flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors ${
              tab === t.key
                ? 'border-[#58A4B0]/40 bg-[#58A4B0]/10 text-[#58A4B0]'
                : 'border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15'
            }`}
            data-playground-control
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-3">
        <div className="grid grid-cols-6 gap-2">
          {items.map(item => {
            const visible = shouldShowHint(item);
            return (
              <div
                key={item.id}
                className="group relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-200"
                style={{
                  borderColor: item.unlocked ? item.rarityData.border : 'rgba(255,255,255,0.06)',
                  background: item.unlocked
                    ? `radial-gradient(circle at center, ${item.rarityData.glow}, transparent 70%)`
                    : 'rgba(255,255,255,0.02)',
                  boxShadow: item.unlocked ? `0 0 12px ${item.rarityData.glow}` : 'none',
                }}
                title={item.unlocked ? `${item.name} — ${RARITY[item.rarity].label}` : (visible ? item.hint : '???')}
              >
                <span className={`text-base leading-none ${item.unlocked ? '' : 'opacity-20 grayscale blur-[2px]'}`}>
                  {item.unlocked ? item.icon : '?'}
                </span>
                {item.unlocked && (
                  <span className="text-[7px] font-mono text-center leading-tight px-0.5 truncate w-full" style={{ color: item.rarityData.color }}>
                    {item.name.length > 10 ? item.name.slice(0, 9) + '…' : item.name}
                  </span>
                )}

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl bg-[#0d1114]/95 border border-white/10 backdrop-blur-xl shadow-xl
                  opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10 w-[180px]"
                >
                  {item.unlocked ? (
                    <>
                      <div className="text-[10px] font-mono font-bold" style={{ color: item.rarityData.color }}>{item.name}</div>
                      <div className="text-[9px] font-mono mt-0.5" style={{ color: item.rarityData.color }}>{RARITY[item.rarity].label}</div>
                      <div className="text-[9px] text-slate-400 mt-1">{new Date(item.unlockedAt).toLocaleDateString()}</div>
                    </>
                  ) : visible ? (
                    <>
                      <div className="text-[10px] font-mono text-slate-400">Unknown {RARITY[item.rarity].label}</div>
                      <div className="text-[9px] text-slate-500 mt-1 italic">{item.hint}</div>
                    </>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-600">Locked — collect more to reveal hints</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
        <div className="text-[9px] font-mono text-slate-600">
          {totalCollected === 0 ? 'Start collecting!' :
           totalCollected < 8 ? 'Keep exploring the playground...' :
           totalCollected < 14 ? 'Try interacting with other sections...' :
           totalCollected < 24 ? 'Follow the clues...' :
           totalCollected < 35 ? 'The deep end beckons...' :
           totalCollected < totalItems ? 'Secrets remain hidden...' :
           'You are complete.'}
        </div>
        <button
          onClick={onReset}
          className="px-2 py-1 rounded-lg border border-red-500/20 text-[9px] font-mono text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-colors"
          data-playground-control
        >
          Reset
        </button>
      </div>
    </div>
  );
}
