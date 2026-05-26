/**
 * lib/config.js — ComputeMyFin Master Config
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️  THIS IS THE ONLY FILE YOU EDIT AFTER BUDGET / RATE CHANGES
 *
 * UPDATE SCHEDULE:
 *  • 1 Feb every year   → Union Budget  (tax slabs, 80C limits, surcharge)
 *  • 1 Apr every year   → New FY label
 *  • Mar/Jun/Sep/Dec    → RBI repo rate (affects FD default rates)
 *  • Mar/Jun/Sep/Dec    → Govt small savings rates (PPF, SCSS, NSC, SSY…)
 *  • Mar every year     → EPFO EPF interest rate
 *
 * Last updated: FY 2025-26 (Budget 2025, 1 Feb 2025)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export const CONFIG = {
  FY: '2026-27',
  AY: '2027-28',
  BUDGET_YEAR: 2025, // which budget these rates are from

  // ── INCOME TAX ──────────────────────────────────────────────────
  INCOME_TAX: {
    CESS: 0.04, // 4% health & education cess on (tax + surcharge)

    NEW_REGIME: {
      standardDeduction: 75000,
      rebate87A: {
        maxTaxableIncome: 1200000, // ₹12L taxable → zero tax
        maxRebate: 60000,
      },
      slabs: [
        { from: 0,       to: 400000,   rate: 0    },
        { from: 400000,  to: 800000,   rate: 0.05 },
        { from: 800000,  to: 1200000,  rate: 0.10 },
        { from: 1200000, to: 1600000,  rate: 0.15 },
        { from: 1600000, to: 2000000,  rate: 0.20 },
        { from: 2000000, to: 2400000,  rate: 0.25 },
        { from: 2400000, to: Infinity, rate: 0.30 },
      ],
      surcharge: [
        { from: 5000000,  to: 10000000, rate: 0.10 },
        { from: 10000000, to: 20000000, rate: 0.15 },
        { from: 20000000, to: Infinity, rate: 0.25 }, // capped at 25% in new regime
      ],
    },

    OLD_REGIME: {
      standardDeduction: 50000,
      rebate87A: {
        maxTaxableIncome: 500000, // ₹5L taxable → zero tax
        maxRebate: 12500,
      },
      slabs: [
        { from: 0,       to: 250000,   rate: 0    },
        { from: 250000,  to: 500000,   rate: 0.05 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      // Senior citizen (60–79): 0 slab starts at ₹3L
      seniorSlabs: [
        { from: 0,       to: 300000,   rate: 0    },
        { from: 300000,  to: 500000,   rate: 0.05 },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      // Super senior (80+): 0 slab up to ₹5L
      superSeniorSlabs: [
        { from: 0,       to: 500000,   rate: 0    },
        { from: 500000,  to: 1000000,  rate: 0.20 },
        { from: 1000000, to: Infinity, rate: 0.30 },
      ],
      surcharge: [
        { from: 5000000,  to: 10000000, rate: 0.10 },
        { from: 10000000, to: 20000000, rate: 0.15 },
        { from: 20000000, to: 50000000, rate: 0.25 },
        { from: 50000000, to: Infinity, rate: 0.37 },
      ],
    },

    // Deduction limits (Old Regime only)
    DEDUCTIONS: {
      SEC_80C:        150000,  // PF, ELSS, LIC, NSC, tuition fees
      SEC_80CCD1B:    50000,   // NPS extra
      SEC_80D_SELF:   25000,   // health insurance self
      SEC_80D_PARENTS:25000,   // health insurance parents
      SEC_80D_SENIOR: 50000,   // senior citizen parents
      SEC_24B:        200000,  // home loan interest (self-occupied)
      SEC_80E:        null,    // education loan interest – no limit
      SEC_80EEA:      150000,  // first home buyer
      SEC_80G_50:     null,    // 50% of donation (no limit)
      SEC_80GG:       60000,   // rent paid if no HRA (5K/month max)
      SEC_80TTA:      10000,   // savings interest (non-senior)
      SEC_80TTB:      50000,   // savings interest (senior citizen)
      HRA_METRO:      0.50,    // 50% of basic for metro cities
      HRA_NON_METRO:  0.40,    // 40% for non-metro
    },
  },

  // ── CAPITAL GAINS (post Budget 2024, Jul 23 2024) ────────────────
  CAPITAL_GAINS: {
    EQUITY_MUTUAL_FUND: {
      stcgRate: 0.20,    // < 12 months (was 15%, Budget 2024 changed to 20%)
      ltcgRate: 0.125,   // ≥ 12 months (was 10%, Budget 2024 changed to 12.5%)
      ltcgExempt: 125000,// ₹1.25L/yr exempt (was ₹1L)
      ltcgHolding: 12,   // months
    },
    LISTED_STOCKS: {
      stcgRate: 0.20,
      ltcgRate: 0.125,
      ltcgExempt: 125000,
      ltcgHolding: 12,
    },
    PROPERTY: {
      stcgRate: null,    // added to income → slab rate
      ltcgRate: 0.125,   // ≥ 24 months, WITHOUT indexation (Budget 2024)
      ltcgWithIndexRate: 0.20, // WITH indexation (only pre-Jul 23 2024 property)
      ltcgHolding: 24,
    },
    GOLD_PHYSICAL: {
      stcgRate: null,    // slab rate
      ltcgRate: 0.125,   // ≥ 24 months (Budget 2024, no indexation)
      ltcgHolding: 24,
    },
    DEBT_MUTUAL_FUND: {
      // Post Apr 1 2023: always slab rate regardless of holding
      alwaysSlabRate: true,
    },
    CRYPTO: {
      flatRate: 0.30,    // 30% flat (no deduction allowed except cost)
      tds: 0.01,         // 1% TDS u/s 194S
    },
  },

  // ── TDS RATES ────────────────────────────────────────────────────
  TDS: {
    '192':  { name: 'Salary',                    rate: null,   threshold: 0,       note: 'Slab rate applies' },
    '194A': { name: 'Bank Interest',             rate: 0.10,   threshold: 40000,   seniorThreshold: 50000 },
    '194B': { name: 'Lottery / Game Winnings',   rate: 0.30,   threshold: 10000 },
    '194C': { name: 'Contractor (Individual)',    rate: 0.01,   companyRate: 0.02,  threshold: 30000, annualThreshold: 100000 },
    '194D': { name: 'Insurance Commission',       rate: 0.05,   threshold: 15000 },
    '194H': { name: 'Commission / Brokerage',    rate: 0.05,   threshold: 15000 },
    '194I': { name: 'Rent (Land & Building)',    rate: 0.10,   threshold: 240000 },
    '194IA':{ name: 'Immovable Property Sale',   rate: 0.01,   threshold: 5000000 },
    '194J': { name: 'Professional / Technical',  rate: 0.10,   threshold: 30000 },
    '194K': { name: 'MF Dividend',               rate: 0.10,   threshold: 5000 },
    '194M': { name: 'Payment to Contractor >50L',rate: 0.05,   threshold: 5000000 },
    '194N': { name: 'Cash Withdrawal',           rate: 0.02,   threshold: 2000000 },
    '194Q': { name: 'Goods Purchase',            rate: 0.001,  threshold: 5000000 },
    '194S': { name: 'Crypto Transfer',           rate: 0.01,   threshold: 50000 },
  },

  // ── ADVANCE TAX ───────────────────────────────────────────────────
  ADVANCE_TAX: {
    threshold: 10000, // pay advance tax only if liability > ₹10K
    installments: [
      { label: '1st Instalment', dueDate: '15 Jun', cumPct: 0.15 },
      { label: '2nd Instalment', dueDate: '15 Sep', cumPct: 0.45 },
      { label: '3rd Instalment', dueDate: '15 Dec', cumPct: 0.75 },
      { label: '4th Instalment', dueDate: '15 Mar', cumPct: 1.00 },
    ],
    interest234B: 0.01, // 1% per month on shortfall
    interest234C: 0.01,
  },

  // ── PROFESSIONAL TAX (state-wise monthly) ─────────────────────────
  PROFESSIONAL_TAX: {
    'Andhra Pradesh': [{ to: 15000, tax: 0 }, { to: Infinity, tax: 200 }],
    'Gujarat':        [{ to: 5999,  tax: 0 }, { to: 8999, tax: 80 }, { to: 11999, tax: 150 }, { to: Infinity, tax: 200 }],
    'Karnataka':      [{ to: 15000, tax: 0 }, { to: Infinity, tax: 200 }],
    'Kerala':         [{ to: 11999, tax: 0 }, { to: 17999, tax: 120 }, { to: 29999, tax: 180 }, { to: Infinity, tax: 208 }],
    'Maharashtra':    [{ to: 7500,  tax: 0 }, { to: 10000, tax: 175 }, { to: Infinity, tax: 200 }],
    'Tamil Nadu':     [{ to: 21000, tax: 0 }, { to: Infinity, tax: 208 }],
    'Telangana':      [{ to: 15000, tax: 0 }, { to: Infinity, tax: 200 }],
    'West Bengal':    [{ to: 10000, tax: 0 }, { to: 15000, tax: 110 }, { to: 25000, tax: 130 }, { to: 40000, tax: 150 }, { to: Infinity, tax: 200 }],
    'Others':         [{ to: 15000, tax: 0 }, { to: Infinity, tax: 200 }],
  },

  // ── SMALL SAVINGS & INVESTMENT RATES ─────────────────────────────
  // ⚠️ Review every quarter (Apr, Jul, Oct, Jan)
  RATES: {
    PPF:          { rate: 0.071,  compounding: 'yearly',    minDeposit: 500,  maxDeposit: 150000, tenure: 15 },
    SSY:          { rate: 0.082,  compounding: 'yearly',    minDeposit: 250,  maxDeposit: 150000, tenure: 21 },
    SCSS:         { rate: 0.082,  compounding: 'quarterly', minDeposit: 1000, maxDeposit: 3000000,tenure: 5  },
    NSC:          { rate: 0.077,  compounding: 'yearly',    tenure: 5 },
    POST_MIS:     { rate: 0.074,  compounding: 'monthly',   minDeposit: 1000, maxDeposit: 900000, tenure: 5  },
    POST_RD:      { rate: 0.066,  compounding: 'quarterly', tenure: 5 },
    KVP:          { rate: 0.072,  compounding: 'yearly' },
    EPF:          { rate: 0.0815, wageFloor: 15000, employeeRate: 0.12, employerRate: 0.0833 /* 8.33% to EPS */ },
    NPS_EQUITY:   { expectedReturn: 0.12 },
    NPS_DEBT:     { expectedReturn: 0.08 },
  },

  // ── GST ──────────────────────────────────────────────────────────
  GST: {
    rates: [0, 0.05, 0.12, 0.18, 0.28],
    cess: {
      'Tobacco': 0.28,
      'Luxury Cars': 0.15,
      'Aerated Drinks': 0.12,
    },
  },

  // ── HRA (metro cities per IT Act) ────────────────────────────────
  METRO_CITIES: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],

  // ── STAMP DUTY (state-wise %, approximate) ───────────────────────
  STAMP_DUTY: {
    'Andhra Pradesh': { male: 0.05, female: 0.05, registration: 0.01 },
    'Delhi':          { male: 0.06, female: 0.04, registration: 0.01 },
    'Gujarat':        { male: 0.045,female: 0.045,registration: 0.01 },
    'Karnataka':      { male: 0.056,female: 0.056,registration: 0.01 },
    'Kerala':         { male: 0.08, female: 0.08, registration: 0.02 },
    'Maharashtra':    { male: 0.06, female: 0.05, registration: 0.01 },
    'Rajasthan':      { male: 0.06, female: 0.05, registration: 0.01 },
    'Tamil Nadu':     { male: 0.07, female: 0.07, registration: 0.01 },
    'Telangana':      { male: 0.05, female: 0.05, registration: 0.005},
    'Uttar Pradesh':  { male: 0.07, female: 0.06, registration: 0.01 },
    'West Bengal':    { male: 0.06, female: 0.06, registration: 0.01 },
    'Others':         { male: 0.06, female: 0.05, registration: 0.01 },
  },
}
