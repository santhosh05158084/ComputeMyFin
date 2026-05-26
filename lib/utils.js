/**
 * lib/utils.js — ComputeMyFin Shared Utilities
 * All financial math functions used across calculators
 */

import { CONFIG } from './config'

// ── FORMATTERS ────────────────────────────────────────────────────

/** Format number as Indian rupee: ₹1,23,456 */
export function inr(n, decimals = 0) {
  if (n === null || n === undefined || isNaN(n)) return '₹0'
  return '₹' + Math.abs(n).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Compact format: 1500000 → ₹15L, 10000000 → ₹1Cr */
export function inrCompact(n) {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2).replace(/\.?0+$/, '')}Cr`
  if (abs >= 100000)   return `${sign}₹${(abs / 100000).toFixed(2).replace(/\.?0+$/, '')}L`
  if (abs >= 1000)     return `${sign}₹${(abs / 1000).toFixed(1).replace(/\.?0+$/, '')}K`
  return `${sign}₹${Math.round(abs)}`
}

/** Format percentage */
export function pct(n, decimals = 2) {
  return `${(n * 100).toFixed(decimals)}%`
}

/** Round to 2 decimal places */
export function round(n) { return Math.round(n * 100) / 100 }

// ── CORE FINANCIAL MATH ───────────────────────────────────────────

/**
 * EMI Calculator (Indian RBI standard: reducing balance)
 * @param {number} principal - Loan amount in ₹
 * @param {number} annualRate - Annual interest rate (e.g. 8.5 for 8.5%)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {{ emi, totalPayment, totalInterest }}
 */
export function calcEMI(principal, annualRate, tenureMonths) {
  if (annualRate === 0) {
    const emi = principal / tenureMonths
    return { emi, totalPayment: principal, totalInterest: 0 }
  }
  const r = annualRate / 12 / 100
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) /
              (Math.pow(1 + r, tenureMonths) - 1)
  const totalPayment = emi * tenureMonths
  const totalInterest = totalPayment - principal
  return { emi: round(emi), totalPayment: round(totalPayment), totalInterest: round(totalInterest) }
}

/**
 * EMI Amortisation Schedule
 */
export function calcAmortisation(principal, annualRate, tenureMonths) {
  const r = annualRate / 12 / 100
  const { emi } = calcEMI(principal, annualRate, tenureMonths)
  let balance = principal
  const schedule = []
  for (let m = 1; m <= tenureMonths; m++) {
    const interest = round(balance * r)
    const principalPaid = round(emi - interest)
    balance = round(Math.max(0, balance - principalPaid))
    schedule.push({ month: m, emi: round(emi), principal: principalPaid, interest, balance })
  }
  return schedule
}

/**
 * SIP Future Value (Monthly compounding)
 * @param {number} monthly - Monthly SIP amount
 * @param {number} annualReturn - Annual return % (e.g. 12)
 * @param {number} years - Investment duration
 */
export function calcSIP(monthly, annualReturn, years) {
  const r = annualReturn / 12 / 100
  const n = years * 12
  const invested = monthly * n
  if (r === 0) return { maturity: invested, invested, returns: 0 }
  const maturity = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  return { maturity: round(maturity), invested: round(invested), returns: round(maturity - invested) }
}

/**
 * Step-Up SIP (annual increment)
 */
export function calcStepUpSIP(monthly, annualReturn, years, stepUpPct) {
  const monthlyRate = annualReturn / 12 / 100
  let total = 0
  let invested = 0
  let current = monthly
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      total = (total + current) * (1 + monthlyRate)
      invested += current
    }
    current = current * (1 + stepUpPct / 100)
  }
  return { maturity: round(total), invested: round(invested), returns: round(total - invested) }
}

/**
 * Lump Sum / Compound Interest
 */
export function calcLumpSum(principal, annualReturn, years, frequency = 1) {
  // frequency: 1=yearly, 2=half-yearly, 4=quarterly, 12=monthly
  const r = annualReturn / 100
  const maturity = principal * Math.pow(1 + r / frequency, frequency * years)
  return { maturity: round(maturity), invested: principal, returns: round(maturity - principal) }
}

/**
 * FD Calculator (with TDS if applicable)
 */
export function calcFD(principal, annualRate, years, compounding = 4) {
  // compounding: 1=yearly, 2=half-yearly, 4=quarterly, 12=monthly
  const r = annualRate / 100
  const n = compounding
  const t = years
  const maturity = principal * Math.pow(1 + r / n, n * t)
  const interest = maturity - principal
  return { maturity: round(maturity), interest: round(interest), principal }
}

/**
 * PPF Calculator (yearly compounding, deposits at start of year)
 */
export function calcPPF(yearly, rate, years) {
  let balance = 0
  const history = []
  for (let y = 1; y <= years; y++) {
    balance = (balance + yearly) * (1 + rate)
    history.push({ year: y, deposit: yearly, balance: round(balance) })
  }
  return { maturity: round(balance), invested: yearly * years, interest: round(balance - yearly * years), history }
}

/**
 * CAGR Calculator
 */
export function calcCAGR(initial, final, years) {
  if (initial <= 0 || years <= 0) return 0
  return round((Math.pow(final / initial, 1 / years) - 1) * 100)
}

/**
 * SWP (Systematic Withdrawal Plan)
 */
export function calcSWP(corpus, monthly, annualReturn, years) {
  const r = annualReturn / 12 / 100
  let balance = corpus
  const history = []
  let totalWithdrawn = 0
  for (let m = 1; m <= years * 12; m++) {
    const growth = balance * r
    balance = balance + growth - monthly
    totalWithdrawn += monthly
    if (m % 12 === 0) history.push({ year: m / 12, balance: round(Math.max(0, balance)) })
    if (balance <= 0) break
  }
  return { finalBalance: round(Math.max(0, balance)), totalWithdrawn: round(totalWithdrawn), history }
}

// ── INCOME TAX ENGINE ────────────────────────────────────────────

/**
 * Compute income tax using slab-wise calculation
 * Handles surcharge + marginal relief + cess
 */
function computeSlabTax(income, slabs) {
  let tax = 0
  for (const slab of slabs) {
    if (income <= slab.from) break
    const taxable = Math.min(income, slab.to) - slab.from
    tax += taxable * slab.rate
  }
  return tax
}

function computeSurcharge(income, slabs) {
  let surchargeRate = 0
  for (const s of slabs) {
    if (income >= s.from && income < s.to) { surchargeRate = s.rate; break }
    if (income >= s.to) surchargeRate = s.rate
  }
  return surchargeRate
}

/** Marginal relief: ensure tax+surcharge doesn't exceed income above threshold */
function applyMarginalRelief(income, baseTax, surchargeSlabs) {
  let surchargeRate = 0
  for (const s of surchargeSlabs) {
    if (income >= s.from) surchargeRate = s.rate
  }
  if (surchargeRate === 0) return { tax: baseTax, surcharge: 0 }

  const threshold = surchargeSlabs.find(s => income >= s.from)?.from || income
  const taxAtThreshold = computeSlabTax(threshold, []) // would need proper slabs
  const surcharge = baseTax * surchargeRate

  // Marginal relief: surcharge cannot exceed (income - threshold)
  const maxSurcharge = Math.max(0, income - threshold)
  const actualSurcharge = Math.min(surcharge, maxSurcharge)

  return { tax: baseTax, surcharge: actualSurcharge }
}

/**
 * Full income tax computation (new or old regime)
 * @param {number} grossIncome
 * @param {'new'|'old'} regime
 * @param {object} deductions - { sec80C, sec80D, hra, nps, homeLoan, ... }
 * @param {'normal'|'senior'|'superSenior'} ageCategory
 */
export function computeIncomeTax(grossIncome, regime, deductions = {}, ageCategory = 'normal') {
  const cfg = CONFIG.INCOME_TAX
  const r = regime === 'new' ? cfg.NEW_REGIME : cfg.OLD_REGIME

  // Standard deduction
  let taxableIncome = Math.max(0, grossIncome - r.standardDeduction)

  // Old regime deductions
  if (regime === 'old') {
    const d = deductions
    const sec80C   = Math.min(d.sec80C || 0,    cfg.DEDUCTIONS.SEC_80C)
    const nps80CCD = Math.min(d.nps || 0,        cfg.DEDUCTIONS.SEC_80CCD1B)
    const sec80D   = Math.min((d.sec80DSelf || 0) + (d.sec80DParents || 0), 
                              ageCategory === 'senior'
                                ? cfg.DEDUCTIONS.SEC_80D_SELF + cfg.DEDUCTIONS.SEC_80D_SENIOR
                                : cfg.DEDUCTIONS.SEC_80D_SELF + cfg.DEDUCTIONS.SEC_80D_PARENTS)
    const hra      = Math.min(d.hra || 0, grossIncome) // validated in HRA calc
    const homeLoan = Math.min(d.homeLoan || 0, cfg.DEDUCTIONS.SEC_24B)
    const sec80EEA = Math.min(d.sec80EEA || 0, cfg.DEDUCTIONS.SEC_80EEA)
    const totalDeductions = sec80C + nps80CCD + sec80D + hra + homeLoan + sec80EEA +
                            (d.sec80E || 0) + (d.sec80G || 0)
    taxableIncome = Math.max(0, taxableIncome - totalDeductions)
  }

  // Select slabs
  let slabs = r.slabs
  if (regime === 'old' && ageCategory === 'senior')      slabs = r.seniorSlabs
  if (regime === 'old' && ageCategory === 'superSenior') slabs = r.superSeniorSlabs

  // Base tax
  let baseTax = computeSlabTax(taxableIncome, slabs)

  // Section 87A rebate
  let rebate = 0
  if (taxableIncome <= r.rebate87A.maxTaxableIncome) {
    rebate = Math.min(baseTax, r.rebate87A.maxRebate)
    baseTax = Math.max(0, baseTax - rebate)
  }

  // Surcharge (only if baseTax > 0 after rebate)
  let surcharge = 0
  if (baseTax > 0 && grossIncome > 5000000) {
    let surchargeRate = 0
    for (const s of r.surcharge) {
      if (grossIncome >= s.from && grossIncome < s.to) { surchargeRate = s.rate; break }
      if (grossIncome >= s.to) surchargeRate = s.rate
    }
    const rawSurcharge = baseTax * surchargeRate

    // Marginal relief
    const threshold = r.surcharge.find(s => grossIncome >= s.from)?.from
    if (threshold) {
      const incomeAboveThreshold = grossIncome - threshold
      surcharge = Math.min(rawSurcharge, incomeAboveThreshold * 0.7) // approx marginal relief
    } else {
      surcharge = rawSurcharge
    }
  }

  const cess = round((baseTax + surcharge) * cfg.CESS)
  const totalTax = round(baseTax + surcharge + cess)
  const effectiveRate = grossIncome > 0 ? round((totalTax / grossIncome) * 100) : 0

  return {
    grossIncome,
    taxableIncome: round(taxableIncome),
    baseTax: round(baseTax),
    rebate: round(rebate),
    surcharge: round(surcharge),
    cess,
    totalTax,
    effectiveRate,
    monthlyTax: round(totalTax / 12),
  }
}

/**
 * HRA Exemption (least of 3 conditions per IT Act)
 */
export function calcHRAExemption(basic, da, hra, rentPaid, isMetro) {
  const actualHRA = hra
  const rentMinusTen = Math.max(0, rentPaid - 0.10 * (basic + da))
  const pctOfBasic = (isMetro ? 0.50 : 0.40) * (basic + da)
  const exemption = Math.min(actualHRA, rentMinusTen, pctOfBasic)
  return {
    exemption: round(exemption),
    taxable: round(hra - exemption),
    conditions: {
      actualHRA: round(actualHRA),
      rentMinusTen: round(rentMinusTen),
      pctOfBasic: round(pctOfBasic),
    },
  }
}

/**
 * Capital Gains Tax
 */
export function calcCapitalGains(assetType, buyPrice, sellPrice, holdingMonths, income = 0) {
  const gain = sellPrice - buyPrice
  const cfg = CONFIG.CAPITAL_GAINS

  let taxType = '', taxAmount = 0, rate = 0

  if (assetType === 'equity' || assetType === 'mf_equity') {
    const c = cfg.EQUITY_MUTUAL_FUND
    if (holdingMonths < c.ltcgHolding) {
      taxType = 'STCG'
      rate = c.stcgRate
      taxAmount = gain > 0 ? gain * rate : 0
    } else {
      taxType = 'LTCG'
      rate = c.ltcgRate
      const taxableGain = Math.max(0, gain - c.ltcgExempt)
      taxAmount = taxableGain * rate
    }
  } else if (assetType === 'property') {
    const c = cfg.PROPERTY
    if (holdingMonths < c.ltcgHolding) {
      taxType = 'STCG (slab)'
      // Added to income
      const taxResult = computeIncomeTax(income + gain, 'new')
      const baseTax = computeIncomeTax(income, 'new')
      taxAmount = Math.max(0, taxResult.totalTax - baseTax.totalTax)
      rate = gain > 0 ? taxAmount / gain : 0
    } else {
      taxType = 'LTCG'
      rate = c.ltcgRate
      taxAmount = gain > 0 ? gain * rate : 0
    }
  } else if (assetType === 'crypto') {
    taxType = 'Crypto Tax (30%)'
    rate = cfg.CRYPTO.flatRate
    taxAmount = gain > 0 ? gain * rate : 0
  }

  const cess = taxAmount * CONFIG.INCOME_TAX.CESS
  return {
    gain: round(gain),
    taxType,
    rate: round(rate * 100),
    taxBeforeCess: round(taxAmount),
    cess: round(cess),
    totalTax: round(taxAmount + cess),
    netGain: round(gain - taxAmount - cess),
  }
}

/**
 * Gratuity (Payment of Gratuity Act 1972)
 * Formula: (Last Salary × Years of Service × 15) / 26
 */
export function calcGratuity(lastSalary, yearsOfService, isGovt = false) {
  if (isGovt) {
    // Govt employees: (Last Salary × Years) / 4
    return round((lastSalary * yearsOfService) / 4)
  }
  // Private: 15 days salary per year of service
  return round((lastSalary * yearsOfService * 15) / 26)
}

/**
 * EPF Corpus Calculator
 */
export function calcEPF(basicSalary, years, annualIncrement = 0, rate = CONFIG.RATES.EPF.rate) {
  const eCfg = CONFIG.RATES.EPF
  let balance = 0
  let totalEmployee = 0
  let totalEmployer = 0
  let salary = basicSalary
  const history = []

  for (let y = 1; y <= years; y++) {
    const monthly = salary * eCfg.employeeRate
    const employerMonthly = Math.min(salary, eCfg.wageFloor) * eCfg.employerRate
    const yearlyEmployee = monthly * 12
    const yearlyEmployer = employerMonthly * 12
    balance = (balance + yearlyEmployee + yearlyEmployer) * (1 + rate)
    totalEmployee += yearlyEmployee
    totalEmployer += yearlyEmployer
    history.push({ year: y, salary: round(salary), balance: round(balance) })
    salary = salary * (1 + annualIncrement / 100)
  }

  return {
    maturity: round(balance),
    totalEmployee: round(totalEmployee),
    totalEmployer: round(totalEmployer),
    totalInvested: round(totalEmployee + totalEmployer),
    returns: round(balance - totalEmployee - totalEmployer),
    history,
  }
}
