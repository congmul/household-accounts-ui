"use client"

import { useTranslation } from '@/app/lib/i18n/client';
import React, { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSessionStorageState } from '@/app/lib/custom-hook';
import { transactionService } from '@/app/lib/api-services';
import { AccountBookWithMember, Transaction, TransactionItems } from '@/app/lib/models';
import { formatCurrency } from '@/app/lib/utils';
import { RootState } from '@/app/lib/redux/store';

export function AnalysisPage({ lng } : { lng: string }) {
    const { t } = useTranslation(lng, 'main');
    const { selectedDateStr } = useSelector((state:any) => state.calendar);
    const { defaultAccountBook } = useSelector((state:RootState) => state.accountBook);
    const [ isPending, startTransition] = useTransition();
    const [ userInfo, _ ] = useSessionStorageState("userInfo", "");

    // Filters / UI state
    const [menu, setMenu] = useState<'expense'|'income'|'investment'>('expense');
    const [pendingOnly, setPendingOnly] = useState<boolean>(false); // preserved across menu switches, only effective when menu === 'expense'
    const [dateRangePreset, setDateRangePreset] = useState<'this'|'last30'|'last90'|'last180'|'last365'|'custom'>('this');
    const today = new Date();
    const endOfTodayISO = useMemo(() => today.toISOString().slice(0,10), []);
    const defaultStart = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().slice(0,10);
    }, []);
    const [customStart, setCustomStart] = useState<string>(defaultStart);
    const [customEnd, setCustomEnd] = useState<string>(endOfTodayISO);
    const [useCustomApplied, setUseCustomApplied] = useState(false);

    const [searchText, setSearchText] = useState<string>('');

    const [ transactions, setTransactions ] = useState<TransactionItems[]>([]);

    useEffect(() => {
        if(!selectedDateStr || !defaultAccountBook) return;
        // Reset date-related UI when calendar selection changes: use it as a pivot for presets
        const [year, month] = selectedDateStr.split('-');
        // set default custom range to last 1 month
        const d = new Date(Number(year), Number(month)-1, 1);
        const end = new Date(d);
        end.setMonth(end.getMonth()+1);
        end.setDate(0);
        setCustomEnd(end.toISOString().slice(0,10));
        const start = new Date(d);
        start.setMonth(start.getMonth()-1);
        setCustomStart(start.toISOString().slice(0,10));
    // trigger load
    loadForPreset(dateRangePreset, selectedDateStr);
    }, [selectedDateStr, defaultAccountBook]);

    // reload when menu, pendingOnly (effective only for expense), preset changes, search or custom applied
    useEffect(() => {
    if(!selectedDateStr || !defaultAccountBook) return;
        if(dateRangePreset === 'custom' && !useCustomApplied) return; // wait until user applies custom
    loadForPreset(dateRangePreset, selectedDateStr);
    }, [menu, pendingOnly, dateRangePreset, useCustomApplied, searchText]);

    // helper: produce months between start and end (inclusive) as {year, month} strings
    function monthsBetween(startDate:Date, endDate:Date){
        const months: {year:string, month:string}[] = [];
        const cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        while(cur <= end){
            months.push({ year: String(cur.getFullYear()), month: String(cur.getMonth()+1).padStart(2,'0') });
            cur.setMonth(cur.getMonth()+1);
        }
        return months;
    }

    const fetchForMonth = useCallback(async (y:string,m:string) => {
        if(userInfo === "") throw new Error("Userinfo is not correct.");
        if(!defaultAccountBook) throw new Error("No default account book selected.");
        const accountBookId = defaultAccountBook.accountBookId._id;
        if(menu === 'expense'){
            const res = await transactionService.getExpenseByUserId(userInfo._id, accountBookId, y, m, undefined);
            return res;
        }
        if(menu === 'income'){
            const res = await transactionService.getIncomeByUserId(userInfo._id, accountBookId, y, m, undefined);
            return res;
        }
        const res = await transactionService.getInvestmentsByUserId(userInfo._id, accountBookId, y, m, undefined);
        return res;
    }, [menu, userInfo, defaultAccountBook]);

    async function loadForPreset(preset:'this'|'last30'|'last90'|'last180'|'last365'|'custom', selectedDateStr:string){
        if(userInfo === "") return;
        startTransition(async () => {
            // determine start/end based on preset
            let startDate = new Date();
            let endDate = new Date();
            if(preset === 'custom'){
                startDate = new Date(customStart);
                endDate = new Date(customEnd);
            }else if(preset === 'this'){
                // use selectedDateStr month as the 'this month' pivot
                if(selectedDateStr){
                    const [y, m] = selectedDateStr.split('-');
                    startDate = new Date(Number(y), Number(m)-1, 1);
                    endDate = new Date(Number(y), Number(m), 0);
                } else {
                    startDate = new Date();
                    startDate.setDate(1);
                    endDate = new Date();
                    endDate.setMonth(endDate.getMonth()+1);
                    endDate.setDate(0);
                }
            }else{
                // use relative days for presets: last30 = 30 days, last90 = 90 days, last180 = 180 days, last365 = 365 days
                const daysBack = preset === 'last30' ? 30 : preset === 'last90' ? 90 : preset === 'last180' ? 180 : 365;
                endDate = new Date(); // today
                startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - daysBack);
            }
            // ensure start <= end
            if(startDate > endDate){
                const tmp = startDate; startDate = endDate; endDate = tmp;
            }
            console.log({startDate, endDate})
            const months = monthsBetween(startDate, endDate);
            const allItems: TransactionItems[] = [];
            for(const m of months){
                try{
                    console.log(m)
                    const res = await fetchForMonth(m.year, m.month);
                    if(res && Array.isArray(res)){
                        // response could be Transaction[] or TransactionItems[] depending on API; normalize to TransactionItems[]
                        if(res.length > 0 && (res as any)[0].transactions){
                            // Transaction[]
                            (res as Transaction[]).forEach(r => {
                                if(r.transactions && r.transactions.length) allItems.push(...r.transactions);
                            })
                        }else{
                            // TransactionItems[]
                            allItems.push(...(res as TransactionItems[]));
                        }
                    }
                }catch(err){
                    // skip month on error
                    console.error('failed fetch month', m, err);
                }
            }
            // apply pending filter if expense
            let filtered = allItems;
            if(menu === 'expense' && pendingOnly){
                filtered = filtered.filter(i => i.pending === true);
            }
            // apply search
            if(searchText && searchText.trim().length > 0){
                const q = searchText.toLowerCase();
                filtered = filtered.filter(i => {
                    return (
                        (i.note && i.note.toLowerCase().includes(q)) ||
                        (i.category && i.category.toLowerCase().includes(q)) ||
                        (i.subcategory && i.subcategory.toLowerCase().includes(q)) ||
                        (i.paymentMethod && i.paymentMethod.toLowerCase().includes(q))
                    )
                })
            }

            setTransactions(filtered);
        })
    }

    function aggregateByCategory(items: TransactionItems[]){
        const map = {} as Record<string, { total:number, sub: Record<string, number> }>
        items.forEach(it => {
            const cat = it.category || 'N/A';
            const sub = it.subcategory || 'N/A';
            if(!map[cat]) map[cat] = { total:0, sub: {} };
            map[cat].total += it.amount;
            map[cat].sub[sub] = (map[cat].sub[sub] || 0) + it.amount;
        })
        return map;
    }

    const aggregated = useMemo(() => {
        const agg = aggregateByCategory(transactions);
        // convert to array and sort by total desc
        const list = Object.entries(agg).map(([category, val]) => ({ category, total: val.total, sub: val.sub }));
        list.sort((a,b) => b.total - a.total);
        return list;
    }, [transactions]);

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    function toggleExpanded(cat:string){
        setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
    }
    return (
        <div className="analysis-page-wrapper flex flex-col p-4">
            <div className="controls mb-4">
                <div className="flex mb-4 gap-3 items-center">
                    <div className="menu-selector">
                        <select value={menu} onChange={e => setMenu(e.target.value as any)} className="border rounded px-2 py-1">
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                            <option value="investment">Invest</option>
                        </select>
                    </div>
                    {menu === 'expense' && (
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={pendingOnly} onChange={e => setPendingOnly(e.target.checked)} />
                            <span>Pending only</span>
                        </label>
                    )}
                </div>

                <div className="presets flex gap-2 mb-4">
                    <button className={`px-2 py-1 border rounded ${dateRangePreset==='this'? 'bg-slate-200':''}`} onClick={() => { setDateRangePreset('this'); setUseCustomApplied(false); }}>{t('analysis.date-range.this')}</button>
                    {([
                        { key: 'last30', label: t('analysis.date-range.last-30d') },
                        { key: 'last90', label: t('analysis.date-range.last-90d') },
                        { key: 'last180', label: t('analysis.date-range.last-180d') },
                        { key: 'last365', label: t('analysis.date-range.last-365d') }
                    ] as const).map(p => (
                        <button key={p.key} className={`px-2 py-1 border rounded ${dateRangePreset===p.key? 'bg-slate-200':''}`} onClick={() => { setDateRangePreset(p.key as any); setUseCustomApplied(false); }}>
                            {p.label}
                        </button>
                    ))}
                    <button className={`px-2 py-1 border rounded ${dateRangePreset==='custom'? 'bg-slate-200':''}`} onClick={() => setDateRangePreset('custom')}>{t('analysis.date-range.custom')}</button>
                </div>

                {dateRangePreset === 'custom' && (
                    <div className="custom-range flex items-center gap-2 mb-4">
                        <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border rounded px-2 py-1" />
                        <span>—</span>
                        <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border rounded px-2 py-1" />
                        <button onClick={() => {
                            // validate
                            if(new Date(customStart) > new Date(customEnd)){
                                // swap
                                const s = customStart; setCustomStart(customEnd); setCustomEnd(s);
                            }
                            setUseCustomApplied(true);
                            loadForPreset('custom', selectedDateStr || '');
                        }} className="px-2 py-1 border rounded">Apply</button>
                    </div>
                )}

                <div className="ml-auto flex items-center gap-2 mb-4">
                    <input placeholder="Search" value={searchText} onChange={e => setSearchText(e.target.value)} className="border rounded px-2 py-1" />
                    <button onClick={() => { setSearchText(''); setUseCustomApplied(false); setDateRangePreset('this'); }}>Reset</button>
                </div>
            </div>
                <>{console.log(aggregated)}</>
            <div className="results">
                {isPending ? <div>Loading...</div> : (
                    aggregated.length > 0 ? (
                        <div className="categories space-y-3">
                            {aggregated.map(cat => (
                                <div key={cat.category} className="category border p-2 rounded">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => toggleExpanded(cat.category)} className="px-2">{expanded[cat.category] ? '-' : '+'}</button>
                                            <div className="font-semibold">{cat.category}</div>
                                        </div>
                                        <div className="font-medium">${formatCurrency(cat.total)}</div>
                                    </div>
                                    {expanded[cat.category] && (
                                        <div className="subcategories ms-6 mt-2">
                                            {Object.entries(cat.sub).map(([subName, amt]) => (
                                                <div key={subName} className="flex justify-between">
                                                    <div>{subName}</div>
                                                    <div>${formatCurrency(amt)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : <div>{t('analysis.no-data')}</div>
                )}
            </div>
        </div>
    )
}