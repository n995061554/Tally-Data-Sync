
import { type TallyConfig, type Ledger, type Voucher } from '../../types';

/**
 * Tally XML Request for Ledgers
 */
const LEDGER_XML_REQUEST = `
<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Export Data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <EXPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>List of Ledgers</REPORTNAME>
                <STATICVARIABLES>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
            </REQUESTDESC>
        </EXPORTDATA>
    </BODY>
</ENVELOPE>
`;

/**
 * Tally XML Request for Vouchers
 */
const VOUCHER_XML_REQUEST = `
<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Export Data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <EXPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>Voucher Register</REPORTNAME>
                <STATICVARIABLES>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
            </REQUESTDESC>
        </EXPORTDATA>
    </BODY>
</ENVELOPE>
`;

/**
 * Tally XML Request for List of Companies
 */
const COMPANY_XML_REQUEST = `
<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Export Data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <EXPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>List of Companies</REPORTNAME>
                <STATICVARIABLES>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
            </REQUESTDESC>
        </EXPORTDATA>
    </BODY>
</ENVELOPE>
`;

export const fetchTallyCompanies = async (config: TallyConfig): Promise<string[]> => {
  const host = config.host || 'localhost';
  const url = `http://${host}:${config.port}`;
  const xml = COMPANY_XML_REQUEST;

  const headers: Record<string, string> = {
    'Content-Type': 'text/xml',
  };

  if (config.username || config.password) {
    try {
      const credentials = btoa(`${config.username || ''}:${config.password || ''}`);
      headers['Authorization'] = `Basic ${credentials}`;
    } catch (e) {
      console.warn('Failed to encode Tally credentials', e);
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: xml,
    });

    if (!response.ok) {
      throw new Error(`Tally response error: ${response.statusText}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");

    const companies: string[] = [];
    
    // Attempt 1: Parse standard <COMPANY> elements
    const companyNodes = xmlDoc.getElementsByTagName('COMPANY');
    if (companyNodes.length > 0) {
      for (let i = 0; i < companyNodes.length; i++) {
        const node = companyNodes[i];
        const nameNode = node.getElementsByTagName('NAME')[0] || node;
        const name = nameNode.textContent?.trim();
        if (name && !companies.includes(name)) {
          companies.push(name);
        }
      }
    }

    // Attempt 2: If no <COMPANY> tag, check any <NAME> tags
    if (companies.length === 0) {
      const nameNodes = xmlDoc.getElementsByTagName('NAME');
      for (let i = 0; i < nameNodes.length; i++) {
        const name = nameNodes[i].textContent?.trim();
        if (name && !companies.includes(name)) {
          companies.push(name);
        }
      }
    }

    // Attempt 3: If still empty, check for <COMPANYNAME> tags
    if (companies.length === 0) {
      const coNameNodes = xmlDoc.getElementsByTagName('COMPANYNAME');
      for (let i = 0; i < coNameNodes.length; i++) {
        const name = coNameNodes[i].textContent?.trim();
        if (name && !companies.includes(name)) {
          companies.push(name);
        }
      }
    }

    return companies;
  } catch (error) {
    console.error('Error fetching companies from Tally:', error);
    throw error;
  }
};

export const fetchTallyData = async (config: TallyConfig, type: 'LEDGER' | 'VOUCHER'): Promise<any[]> => {
  const host = config.host || 'localhost';
  const url = `http://${host}:${config.port}`;
  const xml = type === 'LEDGER' ? LEDGER_XML_REQUEST : VOUCHER_XML_REQUEST;

  const headers: Record<string, string> = {
    'Content-Type': 'text/xml',
  };

  if (config.username || config.password) {
    try {
      const credentials = btoa(`${config.username || ''}:${config.password || ''}`);
      headers['Authorization'] = `Basic ${credentials}`;
    } catch (e) {
      console.warn('Failed to encode Tally credentials', e);
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: xml,
    });

    if (!response.ok) {
      throw new Error(`Tally response error: ${response.statusText}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");

    // Basic parsing logic (this would need to be more robust for real Tally XML)
    if (type === 'LEDGER') {
      const ledgers: Ledger[] = [];
      const ledgerNodes = xmlDoc.getElementsByTagName('LEDGER');
      for (let i = 0; i < ledgerNodes.length; i++) {
        const node = ledgerNodes[i];
        ledgers.push({
          guid: node.getAttribute('REMOTEID') || `ledger-${i}`,
          name: node.getElementsByTagName('NAME')[0]?.textContent || 'Unknown',
          group: node.getElementsByTagName('PARENT')[0]?.textContent || 'Unknown',
          balance: parseFloat(node.getElementsByTagName('OPENINGBALANCE')[0]?.textContent || '0'),
          lastUpdated: new Date().toISOString(),
        });
      }
      return ledgers;
    } else {
      const vouchers: Voucher[] = [];
      const voucherNodes = xmlDoc.getElementsByTagName('VOUCHER');
      for (let i = 0; i < voucherNodes.length; i++) {
        const node = voucherNodes[i];
        vouchers.push({
          guid: node.getAttribute('REMOTEID') || `voucher-${i}`,
          type: (node.getElementsByTagName('VOUCHERTYPENAME')[0]?.textContent || 'Sales') as Voucher['type'],
          date: node.getElementsByTagName('DATE')[0]?.textContent || 'Unknown',
          party: node.getElementsByTagName('PARTYLEDGERNAME')[0]?.textContent || 'Unknown',
          amount: parseFloat(node.getElementsByTagName('AMOUNT')[0]?.textContent || '0'),
          syncStatus: 'Pending',
        });
      }
      return vouchers;
    }
  } catch (error) {
    console.error(`Error fetching ${type} from Tally:`, error);
    throw error;
  }
};
