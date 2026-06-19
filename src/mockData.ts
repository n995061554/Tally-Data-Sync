import { type Ledger, type Voucher, type StockItem, type OutstandingBill, type CollectionRecord } from '../types';

export interface CompanyData {
  companyName: string;
  financialYear: string;
  ledgers: Ledger[];
  vouchers: Voucher[];
  stockItems: StockItem[];
  outstandings: OutstandingBill[];
}

export const COMPANY_DATABASES: Record<string, CompanyData> = {
  'Patel Export Services': {
    companyName: 'Patel Export Services',
    financialYear: '1-Apr-2026 to 31-Mar-2027',
    ledgers: [
      {
        guid: 'l-patel-001',
        name: 'Alpha Distributors Ahmedabad',
        group: 'Sundry Debtors',
        balance: 450000,
        lastUpdated: '2026-06-18T10:00:00Z',
        mobile: '+91 98765 43210',
        email: 'contact@alphadist.in',
        address: '102, GIDC Estate, Naroda',
        city: 'Ahmedabad',
        state: 'Gujarat',
        gstin: '24AAAAC1234A1Z5',
        pan: 'AAAAC1234A',
        creditLimit: 750000,
        creditDays: 30,
        openingBalance: 200000,
        contactPerson: 'Karan Patel',
        parentGroup: 'Sundry Debtors (Domestic)'
      },
      {
        guid: 'l-patel-002',
        name: 'Apex Pharma & Surgical',
        group: 'Sundry Debtors',
        balance: 180000,
        lastUpdated: '2026-06-18T10:05:00Z',
        mobile: '+91 91234 56789',
        email: 'procurement@apexpharma.com',
        address: 'Plot 45, Sector 4, Gandhinagar',
        city: 'Gandhinagar',
        state: 'Gujarat',
        gstin: '24AAAPA5678K2Y4',
        pan: 'AAPA5678K',
        creditLimit: 300000,
        creditDays: 45,
        openingBalance: 50000,
        contactPerson: 'Dr. Ramesh Shah',
        parentGroup: 'Sundry Debtors (Local)'
      },
      {
        guid: 'l-patel-003',
        name: 'Matrix Trade Corp Mumbai',
        group: 'Sundry Debtors',
        balance: 950000,
        lastUpdated: '2026-06-18T11:15:00Z',
        mobile: '+91 90000 11111',
        email: 'finance@matrixcorp.com',
        address: '88, Nariman Point, Marine Drive',
        city: 'Mumbai',
        state: 'Maharashtra',
        gstin: '27AAAMM9911D1ZX',
        pan: 'AAMM9911D',
        creditLimit: 1200000,
        creditDays: 60,
        openingBalance: 400000,
        contactPerson: 'Sanjay Deshmukh',
        parentGroup: 'Sundry Debtors (Outstate)'
      },
      {
        guid: 'l-patel-004',
        name: 'Rathi Enterprise Solutions',
        group: 'Sundry Debtors',
        balance: -20000, // Advance credit
        lastUpdated: '2026-06-18T11:20:00Z',
        mobile: '+91 99911 22233',
        email: 'rathi@rathienterprises.co.in',
        address: 'UG-4, Shreemad Towers, Ashram Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        gstin: '24AAARR4411Q1ZC',
        pan: 'AAARR4411Q',
        creditLimit: 500000,
        creditDays: 30,
        openingBalance: -50000,
        contactPerson: 'Anil Rathi',
        parentGroup: 'Sundry Debtors (Domestic)'
      },
      {
        guid: 'l-patel-005',
        name: 'State Bank of India - OD A/c',
        group: 'Bank Accounts',
        balance: -2450000,
        lastUpdated: '2026-06-18T11:30:00Z',
        contactPerson: 'SBI Lead Branch Mgr'
      },
      {
        guid: 'l-patel-006',
        name: 'Main Cash Ledger',
        group: 'Cash-in-Hand',
        balance: 145000,
        lastUpdated: '2026-06-18T11:35:00Z'
      }
    ],
    vouchers: [
      {
        guid: 'v-patel-101',
        type: 'Sales',
        date: '2026-06-10',
        party: 'Alpha Distributors Ahmedabad',
        amount: 250000,
        syncStatus: 'Synced',
        narrations: 'Being goods dispatched invoiced under challan PV-9011',
        instrumentMode: 'Credit Terms'
      },
      {
        guid: 'v-patel-102',
        type: 'Sales',
        date: '2026-06-12',
        party: 'Apex Pharma & Surgical',
        amount: 120000,
        syncStatus: 'Synced',
        narrations: 'Dispatched surgical equipment batch SY-88',
        instrumentMode: 'Credit Terms'
      },
      {
        guid: 'v-patel-103',
        type: 'Receipt',
        date: '2026-06-14',
        party: 'Alpha Distributors Ahmedabad',
        amount: 150000,
        syncStatus: 'Synced',
        narrations: 'RTGS received against voucher inv Ref PAT-101',
        instrumentMode: 'Bank Transfer'
      },
      {
        guid: 'v-patel-104',
        type: 'Sales',
        date: '2026-06-15',
        party: 'Matrix Trade Corp Mumbai',
        amount: 450000,
        syncStatus: 'Synced',
        narrations: 'Sales of organic cotton bulk grade A',
        instrumentMode: 'Credit Terms'
      },
      {
        guid: 'v-patel-105',
        type: 'Receipt',
        date: '2026-06-17',
        party: 'Matrix Trade Corp Mumbai',
        amount: 200000,
        syncStatus: 'Pending',
        narrations: 'Cheque received from Matrix on HDFC bank A/c',
        instrumentMode: 'Cheque'
      },
      {
        guid: 'v-patel-106',
        type: 'Payment',
        date: '2026-06-16',
        party: 'Tally Solutions Pvt Ltd',
        amount: 18000,
        syncStatus: 'Synced',
        narrations: 'TallyPrime active silver renewal subscription fee',
        instrumentMode: 'UPI'
      }
    ],
    stockItems: [
      {
        guid: 's-patel-01',
        name: 'Cotton Yarn Grade A 20s',
        code: 'YRN-A20',
        sku: 'SKU-YRN-A20',
        category: 'Yarns',
        brand: 'Patel Prime',
        unit: 'Kgs',
        gstRate: 5,
        hsnCode: '5205',
        openingStock: 12000,
        closingStock: 9450,
        godown: 'Godown Naroda',
        rate: 260
      },
      {
        guid: 's-patel-02',
        name: 'Cotton Yarn Grade B 40s',
        code: 'YRN-B40',
        sku: 'SKU-YRN-B40',
        category: 'Yarns',
        brand: 'Patel Prime',
        unit: 'Kgs',
        gstRate: 5,
        hsnCode: '5205',
        openingStock: 8000,
        closingStock: 6200,
        godown: 'Godown Kalupur',
        rate: 285
      },
      {
        guid: 's-patel-03',
        name: 'Polyester Microfiber Heavy',
        code: 'POLY-MF-H',
        sku: 'SKU-POLY-MF-H',
        category: 'Synthetics',
        brand: 'Poli-Flex',
        unit: 'Meters',
        gstRate: 12,
        hsnCode: '5407',
        openingStock: 5000,
        closingStock: 4850,
        godown: 'Godown Naroda',
        rate: 110
      },
      {
        guid: 's-patel-04',
        name: 'Viscose Rayon Spun Blend',
        code: 'VIS-RAY-SB',
        sku: 'SKU-VIS-RAY-SB',
        category: 'Rayons',
        brand: 'SoftWeave',
        unit: 'Meters',
        gstRate: 12,
        hsnCode: '5510',
        openingStock: 2500,
        closingStock: 1200,
        godown: 'Godown Kalupur',
        rate: 145
      }
    ],
    outstandings: [
      {
        guid: 'o-patel-001',
        customerGuid: 'l-patel-001',
        customerName: 'Alpha Distributors Ahmedabad',
        invoiceNo: 'PAT-INV-0221',
        invoiceDate: '2026-05-10',
        dueDate: '2026-06-09',
        billAmount: 300000,
        receivedAmount: 150000,
        balanceAmount: 150000,
        overdueDays: 9 // (June 18 local date - June 9 due)
      },
      {
        guid: 'o-patel-002',
        customerGuid: 'l-patel-001',
        customerName: 'Alpha Distributors Ahmedabad',
        invoiceNo: 'PAT-INV-0265',
        invoiceDate: '2026-06-10',
        dueDate: '2026-07-10',
        billAmount: 250000,
        receivedAmount: 0,
        balanceAmount: 250000,
        overdueDays: 0 // Not due yet
      },
      {
        guid: 'o-patel-003',
        customerGuid: 'l-patel-002',
        customerName: 'Apex Pharma & Surgical',
        invoiceNo: 'PAT-INV-0182',
        invoiceDate: '2026-03-01',
        dueDate: '2026-04-15',
        billAmount: 180000,
        receivedAmount: 0,
        balanceAmount: 180000,
        overdueDays: 64 // 60+ overdue
      },
      {
        guid: 'o-patel-004',
        customerGuid: 'l-patel-003',
        customerName: 'Matrix Trade Corp Mumbai',
        invoiceNo: 'PAT-INV-0105',
        invoiceDate: '2025-12-15',
        dueDate: '2026-02-15',
        billAmount: 700000,
        receivedAmount: 0,
        balanceAmount: 700000,
        overdueDays: 123 // 90+ overdue
      },
      {
        guid: 'o-patel-005',
        customerGuid: 'l-patel-003',
        customerName: 'Matrix Trade Corp Mumbai',
        invoiceNo: 'PAT-INV-0271',
        invoiceDate: '2026-06-15',
        dueDate: '2026-08-15',
        billAmount: 450000,
        receivedAmount: 200000,
        balanceAmount: 250000,
        overdueDays: 0
      }
    ]
  },
  'A2Z Diagnostics Corp': {
    companyName: 'A2Z Diagnostics Corp',
    financialYear: '1-Apr-2026 to 31-Mar-2027',
    ledgers: [
      {
        guid: 'l-diag-001',
        name: 'Metro Diagnostics & Lab Hub',
        group: 'Sundry Debtors',
        balance: 220000,
        lastUpdated: '2026-06-18T10:10:00Z',
        mobile: '+91 88888 77777',
        email: 'info@metrolabs.in',
        address: 'B-6, Navrang Arcade, Navrangpura',
        city: 'Ahmedabad',
        state: 'Gujarat',
        gstin: '24AAAMN6543C1Z0',
        pan: 'AAAMN6543C',
        creditLimit: 500000,
        creditDays: 30,
        openingBalance: 120000,
        contactPerson: 'Suresh Bhatia',
        parentGroup: 'Sundry Debtors (Clinical)'
      },
      {
        guid: 'l-diag-002',
        name: 'Shree Krishna Imaging Centre',
        group: 'Sundry Debtors',
        balance: 650000,
        lastUpdated: '2026-06-18T10:15:00Z',
        mobile: '+91 76767 89898',
        email: 'admin@krishna-imaging.org',
        address: 'Krishna Heritage, Drive In Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        gstin: '24AAASK9812L1ZL',
        pan: 'AAASK9812L',
        creditLimit: 1000000,
        creditDays: 45,
        openingBalance: 300000,
        contactPerson: 'Dr. Nirav Patel',
        parentGroup: 'Sundry Debtors (Hospital)'
      },
      {
        guid: 'l-diag-003',
        name: 'Unity Healthcare Pune',
        group: 'Sundry Debtors',
        balance: 35000,
        lastUpdated: '2026-06-18T10:20:00Z',
        mobile: '+91 95555 44444',
        email: 'unitypune@gmail.com',
        address: 'Sec-12, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        gstin: '27AAAUU1090A1ZY',
        pan: 'AAAUU1090A',
        creditLimit: 200000,
        creditDays: 15,
        openingBalance: 0,
        contactPerson: 'Mrs. Neha Kulkarni',
        parentGroup: 'Sundry Debtors (Outstate)'
      }
    ],
    vouchers: [
      {
        guid: 'v-diag-101',
        type: 'Sales',
        date: '2026-06-05',
        party: 'Metro Diagnostics & Lab Hub',
        amount: 150000,
        syncStatus: 'Synced',
        narrations: 'Diagnostic kits and reagent dispatch batch RG-501',
        instrumentMode: 'Credit'
      },
      {
        guid: 'v-diag-102',
        type: 'Sales',
        date: '2026-06-08',
        party: 'Shree Krishna Imaging Centre',
        amount: 450000,
        syncStatus: 'Synced',
        narrations: 'Contrast agent supply bulk contract 2026-Q2',
        instrumentMode: 'Credit'
      },
      {
        guid: 'v-diag-103',
        type: 'Receipt',
        date: '2026-06-10',
        party: 'Metro Diagnostics & Lab Hub',
        amount: 80000,
        syncStatus: 'Synced',
        narrations: 'UPI recovery on diagnostics kit sales',
        instrumentMode: 'UPI'
      },
      {
        guid: 'v-diag-104',
        type: 'Sales',
        date: '2026-06-12',
        party: 'Unity Healthcare Pune',
        amount: 35000,
        syncStatus: 'Synced',
        narrations: 'Disposable pathology pipettes and sterile wares',
        instrumentMode: 'Credit'
      }
    ],
    stockItems: [
      {
        guid: 's-diag-01',
        name: 'Reagent Kit - Covid 19 RT-PCR',
        code: 'KIT-COV',
        sku: 'SKU-KIT-COV',
        category: 'Reagents',
        brand: 'Patho-Detect',
        unit: 'Kits',
        gstRate: 12,
        hsnCode: '3822',
        openingStock: 2000,
        closingStock: 1650,
        godown: 'Godown coldroom 1',
        rate: 850
      },
      {
        guid: 's-diag-02',
        name: 'Disposable Micro Pipettes Pro',
        code: 'PIP-DISP',
        sku: 'SKU-PIP-DISP',
        category: 'Lab Glassware',
        brand: 'PolyPlast',
        unit: 'Boxes',
        gstRate: 18,
        hsnCode: '9026',
        openingStock: 500,
        closingStock: 410,
        godown: 'Main Store Annex',
        rate: 620
      },
      {
        guid: 's-diag-03',
        name: 'MRI Contrast Media Gadolinium',
        code: 'CON-MRI',
        sku: 'SKU-CON-MRI',
        category: 'Radiology Media',
        brand: 'Bayer Sg',
        unit: 'Vials',
        gstRate: 12,
        hsnCode: '3006',
        openingStock: 400,
        closingStock: 120,
        godown: 'Godown coldroom 2',
        rate: 2450
      }
    ],
    outstandings: [
      {
        guid: 'o-diag-001',
        customerGuid: 'l-diag-001',
        customerName: 'Metro Diagnostics & Lab Hub',
        invoiceNo: 'AZ-INV-873',
        invoiceDate: '2026-05-05',
        dueDate: '2026-06-04',
        billAmount: 150000,
        receivedAmount: 50000,
        balanceAmount: 100000,
        overdueDays: 14
      },
      {
        guid: 'o-diag-002',
        customerGuid: 'l-diag-002',
        customerName: 'Shree Krishna Imaging Centre',
        invoiceNo: 'AZ-INV-911',
        invoiceDate: '2026-06-08',
        dueDate: '2026-07-23',
        billAmount: 450000,
        receivedAmount: 100000,
        balanceAmount: 350000,
        overdueDays: 0
      },
      {
        guid: 'o-diag-003',
        customerGuid: 'l-diag-002',
        customerName: 'Shree Krishna Imaging Centre',
        invoiceNo: 'AZ-INV-1090',
        invoiceDate: '2026-03-10',
        dueDate: '2026-04-24',
        billAmount: 300000,
        receivedAmount: 0,
        balanceAmount: 300000,
        overdueDays: 55
      }
    ]
  },
  'Universal Steel Traders': {
    companyName: 'Universal Steel Traders',
    financialYear: '1-Apr-2026 to 31-Mar-2027',
    ledgers: [
      {
        guid: 'l-steel-001',
        name: 'Gujcon Builders & Infra',
        group: 'Sundry Debtors',
        balance: 1450000,
        lastUpdated: '2026-06-18T10:30:00Z',
        mobile: '+91 94444 33322',
        email: 'finance@gujconbuilders.com',
        address: 'Gujcon House, S.G. Highway',
        city: 'Ahmedabad',
        state: 'Gujarat',
        gstin: '24AAAGG1423H1ZK',
        pan: 'AAAGG1423H',
        creditLimit: 2500000,
        creditDays: 45,
        openingBalance: 800000,
        contactPerson: 'Mr. Jayesh Shah',
        parentGroup: 'Sundry Debtors (Infra)'
      },
      {
        guid: 'l-steel-002',
        name: 'Techno Weld Engineering',
        group: 'Sundry Debtors',
        balance: 550000,
        lastUpdated: '2026-06-18T10:35:00Z',
        mobile: '+91 93333 11100',
        email: 'purchase@technoweld.co.in',
        address: 'B-10, Vatva GIDC Phase II',
        city: 'Ahmedabad',
        state: 'Gujarat',
        gstin: '24AAATW9094M1ZO',
        pan: 'AAATW9094M',
        creditLimit: 1000000,
        creditDays: 30,
        openingBalance: 150000,
        contactPerson: 'Hasmukh Bhai',
        parentGroup: 'Sundry Debtors (Industrial)'
      }
    ],
    vouchers: [
      {
        guid: 'v-steel-101',
        type: 'Sales',
        date: '2026-06-01',
        party: 'Gujcon Builders & Infra',
        amount: 950000,
        syncStatus: 'Synced',
        narrations: 'TMT Reinforcement Bars delivery against project SITE-B',
        instrumentMode: 'Credit'
      },
      {
        guid: 'v-steel-102',
        type: 'Sales',
        date: '2026-06-05',
        party: 'Techno Weld Engineering',
        amount: 400000,
        syncStatus: 'Synced',
        narrations: 'Mild Steel Plates consignment ID WT-42',
        instrumentMode: 'Credit'
      },
      {
        guid: 'v-steel-103',
        type: 'Receipt',
        date: '2026-06-15',
        party: 'Gujcon Builders & Infra',
        amount: 500000,
        syncStatus: 'Synced',
        narrations: 'NEFT RTGS on State Bank ledger from Gujcon Corp',
        instrumentMode: 'Bank Transfer'
      }
    ],
    stockItems: [
      {
        guid: 's-steel-01',
        name: 'TMT Steel Bar 10mm FE-500',
        code: 'TMT-10-500',
        sku: 'SKU-TMT-10',
        category: 'Structural Steel',
        brand: 'Tata Tiscon',
        unit: 'M Tons',
        gstRate: 18,
        hsnCode: '7214',
        openingStock: 100,
        closingStock: 64,
        godown: 'Godown Vatva Yard',
        rate: 54000
      },
      {
        guid: 's-steel-02',
        name: 'TMT Steel Bar 12mm FE-500',
        code: 'TMT-12-500',
        sku: 'SKU-TMT-12',
        category: 'Structural Steel',
        brand: 'Tata Tiscon',
        unit: 'M Tons',
        gstRate: 18,
        hsnCode: '7214',
        openingStock: 120,
        closingStock: 82,
        godown: 'Godown Vatva Yard',
        rate: 54200
      },
      {
        guid: 's-steel-03',
        name: 'Mild Steel Plate 12mm Grade A',
        code: 'MS-PLT-12',
        sku: 'SKU-MS-PLT-12',
        category: 'Steel Plates',
        brand: 'SAIL',
        unit: 'M Tons',
        gstRate: 18,
        hsnCode: '7208',
        openingStock: 40,
        closingStock: 31,
        godown: 'Godown Asarva Yard',
        rate: 58500
      }
    ],
    outstandings: [
      {
        guid: 'o-steel-001',
        customerGuid: 'l-steel-001',
        customerName: 'Gujcon Builders & Infra',
        invoiceNo: 'ST-INV-2201',
        invoiceDate: '2026-05-01',
        dueDate: '2026-06-15',
        billAmount: 950000,
        receivedAmount: 300000,
        balanceAmount: 650000,
        overdueDays: 3
      },
      {
        guid: 'o-steel-002',
        customerGuid: 'l-steel-001',
        customerName: 'Gujcon Builders & Infra',
        invoiceNo: 'ST-INV-1045',
        invoiceDate: '2026-02-15',
        dueDate: '2026-04-01',
        billAmount: 800000,
        receivedAmount: 0,
        balanceAmount: 800000,
        overdueDays: 78
      },
      {
        guid: 'o-steel-003',
        customerGuid: 'l-steel-002',
        customerName: 'Techno Weld Engineering',
        invoiceNo: 'ST-INV-2501',
        invoiceDate: '2026-06-05',
        dueDate: '2026-07-05',
        billAmount: 400000,
        receivedAmount: 0,
        balanceAmount: 400000,
        overdueDays: 0
      },
      {
        guid: 'o-steel-002-2',
        customerGuid: 'l-steel-002',
        customerName: 'Techno Weld Engineering',
        invoiceNo: 'ST-INV-1823',
        invoiceDate: '2026-03-01',
        dueDate: '2026-03-31',
        billAmount: 150000,
        receivedAmount: 0,
        balanceAmount: 150000,
        overdueDays: 79
      }
    ]
  }
};
