"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSessionStorageState } from '@/app/lib/custom-hook';
import { transactionService } from '@/app/lib/api-services';
import { TransactionItems, Transaction } from '@/app/lib/models';
import { formatCurrency } from '@/app/lib/utils';
import { RootState } from '@/app/lib/redux/store';
import { useTranslation } from '@/app/lib/i18n/client';

export function SearchPage({ lng } : { lng: string }){
    const { t } = useTranslation(lng, 'main');
    const { defaultAccountBook } = useSelector((s: RootState) => s.accountBook);
    const { selectedDateStr } = useSelector((state:any) => state.calendar);
    const [ userInfo, _ ] = useSessionStorageState('userInfo', '');

    // Filters
    const [ type, setType ] = useState<'all'|'expense'|'income'|'investment'>('all');
    // month selectors: use YYYY-MM format for inputs
    const today = useMemo(() => new Date(), []);
    const currentMonth = useMemo(() => `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`, [today]);
    const prevMonth = useMemo(() => {
        const d = new Date(today.getFullYear(), today.getMonth()-1, 1);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    }, [today]);
    const [ customStart, setCustomStart ] = useState<string>(currentMonth);
    const [ customEnd, setCustomEnd ] = useState<string>(currentMonth);
    const [ query, setQuery ] = useState<string>('');

    const [ isLoading, setIsLoading ] = useState(false);
    const [ results, setResults ] = useState<TransactionItems[]>([]);
    const [ hasSearched, setHasSearched ] = useState(false);

    // helper: produce months between start and end (inclusive)
    function monthsBetween(startDateObj:Date, endDateObj:Date){
        const months: {year:string, month:string}[] = [];
        const cur = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1);
        const end = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1);
        while(cur <= end){
            months.push({ year: String(cur.getFullYear()), month: String(cur.getMonth()+1).padStart(2,'0') });
            cur.setMonth(cur.getMonth()+1);
        }
        return months;
    }

    // parse an ISO-like date string into a local Date at midnight.
    // Handles 'YYYY-MM-DD' and 'YYYY-MM' cleanly to avoid UTC parsing differences.
    const parseToLocalDate = (s: string) => {
        if(!s) return new Date(NaN);
        const full = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(s);
        if(full){
            const y = Number(full[1]);
            const m = Number(full[2]);
            const d = Number(full[3]);
            return new Date(y, m-1, d);
        }
        const ym = /^([0-9]{4})-([0-9]{2})$/.exec(s);
        if(ym){
            const y = Number(ym[1]);
            const m = Number(ym[2]);
            return new Date(y, m-1, 1);
        }
        // fallback to usual Date parsing
        return new Date(s);
    }

    const fetchForMonth = useCallback(async (y:string,m:string, fetchType: 'expense'|'income'|'investment'|'all') => {
        if(userInfo === "") throw new Error('No user');
        if(!defaultAccountBook) throw new Error('No account book');
        const accountBookId = defaultAccountBook.accountBookId._id;
        try{
            if(fetchType === 'expense') return await transactionService.getExpenseByUserId(userInfo._id, accountBookId, y, m, undefined);
            if(fetchType === 'income') return await transactionService.getIncomeByUserId(userInfo._id, accountBookId, y, m, undefined);
            if(fetchType === 'investment') return await transactionService.getInvestmentsByUserId(userInfo._id, accountBookId, y, m, undefined);
            // all -> fetch expense, income, investment and combine
            const [e, i, inv] = await Promise.all([
                transactionService.getExpenseByUserId(userInfo._id, accountBookId, y, m, undefined).catch(() => []),
                transactionService.getIncomeByUserId(userInfo._id, accountBookId, y, m, undefined).catch(() => []),
                transactionService.getInvestmentsByUserId(userInfo._id, accountBookId, y, m, undefined).catch(() => [])
            ]);
            // normalize and combine
            const all: TransactionItems[] = [];
            const norm = (res:any) => {
                if(!res) return;
                if(Array.isArray(res) && res.length > 0 && res[0].transactions){
                    (res as Transaction[]).forEach(r => { if(r.transactions) all.push(...r.transactions) })
                } else if(Array.isArray(res)){
                    all.push(...(res as TransactionItems[]));
                }
            }
            norm(e); norm(i); norm(inv);
            return all;
        }catch(err){
            console.error('fetch month failed', y, m, err);
            return [];
        }
    }, [userInfo, defaultAccountBook]);


    const fetchAndFilterForRange = useCallback(async (sDate:string, eDate:string, currentType: typeof type, currentQuery: string) => {
        // ensure start <= end
        let start = parseToLocalDate(sDate);
        let end = parseToLocalDate(eDate);
        if(start > end){ const tmp = start; start = end; end = tmp; }
        setIsLoading(true);
        try{
            if(userInfo === '' || !defaultAccountBook) { setResults([]); setIsLoading(false); return; }
            const months = monthsBetween(start, end);
            const allItems: TransactionItems[] = [];
            for(const m of months){
                const res = await fetchForMonth(m.year, m.month, currentType === 'all' ? 'all' : currentType);
                if(res && Array.isArray(res)){
                    if((res as any).length > 0 && (res as any)[0].transactions){
                        (res as Transaction[]).forEach(r => { if(r.transactions) allItems.push(...r.transactions) })
                    } else {
                        allItems.push(...(res as TransactionItems[]));
                    }
                }
            }
            // apply keyword filter across fields
            let filtered = allItems;
            if(currentQuery && currentQuery.trim().length > 0){
                const q = currentQuery.toLowerCase();
                filtered = filtered.filter(i => (
                    (i.note && i.note.toLowerCase().includes(q)) ||
                    (i.category && i.category.toLowerCase().includes(q)) ||
                    (i.subcategory && i.subcategory.toLowerCase().includes(q)) ||
                    (i.paymentMethod && i.paymentMethod.toLowerCase().includes(q))
                ));
            }
            // sort by date desc
            filtered.sort((a,b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
            setResults(filtered);
        }catch(err){
            console.error('search failed', err);
            setResults([]);
        }finally{
            setIsLoading(false);
        }
    }, [userInfo, defaultAccountBook, fetchForMonth]);

    // convert YYYY-MM (month input) to start-of-month ISO
    const monthToStartISO = (ym:string) => {
        const [y,m] = ym.split('-');
        const d = new Date(Number(y), Number(m)-1, 1);
        return d.toISOString().slice(0,10);
    }
    // convert YYYY-MM to end-of-month ISO
    const monthToEndISO = (ym:string) => {
        const [y,m] = ym.split('-');
        const d = new Date(Number(y), Number(m), 0);
        return d.toISOString().slice(0,10);
    }

    // sync month selectors when selectedDateStr changes (use it as pivot)
    useEffect(() => {
        if(!selectedDateStr || !defaultAccountBook) return;
        const [year, month] = selectedDateStr.split('-');
        const ym = `${year}-${String(Number(month)).padStart(2,'0')}`;
        setCustomEnd(ym);
        const d = new Date(Number(year), Number(month)-2, 1);
        const prevYm = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        setCustomStart(prevYm);
    }, [selectedDateStr, defaultAccountBook]);

    // Note: do not auto-run searches; user must explicitly trigger Search or Apply

    const doSearch = async () => {
        // convert month inputs (YYYY-MM) to start/end ISO dates to avoid timezone parsing issues
        const sISO = monthToStartISO(customStart);
        const eISO = monthToEndISO(customEnd);
        await fetchAndFilterForRange(sISO, eISO, type, query);
    }

    return (
        <div className="p-4">
            <div className="search-form p-1 rounded mb-4">
                <div className="mb-3">
                    <div>
                        <label className="flex items-center gap-2">
                            <span className="mr-2">{t('general.type')}</span>
                            <select value={type} onChange={e => setType(e.target.value as any)} className="border rounded px-2 py-1">
                                <option value="all">{t('general.all')}</option>
                                <option value="expense">{t('general.expense')}</option>
                                <option value="income">{t('general.income')}</option>
                                <option value="investment">{t('general.investment')}</option>
                            </select>
                        </label>
                    </div>
                    <div className="flex flex-col gap-3 my-3">
                        {/* custom month-range selector only */}
                        <div className="custom-range flex items-center gap-2">
                            <input type="month" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border rounded px-2 py-1" />
                            <span>—</span>
                            <input type="month" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border rounded px-2 py-1" />
                        </div>
                    </div>
                        <div className="ml-auto flex items-center gap-2">
                        <input placeholder={t('general.search-keyword')} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { void doSearch(); setHasSearched(true); } }} className="border rounded px-2 py-1" />
                        <button className="px-3 py-1 border rounded bg-slate-100" onClick={async () => { await doSearch(); setHasSearched(true); }} disabled={isLoading}>{isLoading ? t('general.searching') : t('general.search')}</button>
                        <button className="px-3 py-1 border rounded" onClick={() => {
                            setType('all');
                            // reset month selectors to previous month -> current month
                            setCustomStart(currentMonth);
                            setCustomEnd(currentMonth);
                            setQuery('');
                            setResults([]);
                            setHasSearched(false);
                        }}>{t('general.reset')}</button>
                    </div>
                </div>
            </div>

            <div className="results">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    !hasSearched ? (
                        <div className="text-slate-600">{t('search.init')}</div>
                    ) : (
                        results.length === 0 ? (
                            <div>{t('search.no-data')}</div>
                        ) : (
                            <div className="space-y-2">
                                {results.map(r => (
                                    <div key={r._id} className="border p-2 rounded flex justify-between items-start">
                                        <div>
                                            <div>
                                                <span className="font-semibold">
                                                    {r.category}
                                                </span>
                                                <span>
                                                    {r.subcategory != null ? ` / ${r.subcategory}` : ''}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-600">{r.note}</div>
                                            <div className="text-xs text-slate-500">{r.date.split('T')[0]}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">${formatCurrency(r.amount)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    )
}
