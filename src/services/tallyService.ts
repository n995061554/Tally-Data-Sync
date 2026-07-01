import { type TallyConfig, type Ledger, type Voucher } from '../../types';

/**
 * Tally XML Request for Ledgers (Report format)
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
 * Tally XML Request for Ledgers (Collection format - more robust)
 */
const LEDGER_COLLECTION_XML_REQUEST = `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        </STATICVARIABLES>
        <COLLECTIONNAME>Ledger</COLLECTIONNAME>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>
`;

/**
 * Tally XML Request for Vouchers (Report format)
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
 * Tally XML Request for Vouchers (Collection format - more robust)
 */
const VOUCHER_COLLECTION_XML_REQUEST = `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        </STATICVARIABLES>
        <COLLECTIONNAME>Voucher</COLLECTIONNAME>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>
`;

/**
 * Tally XML Request for List of Companies (Report format)
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

/**
 * Tally XML Request for List of Companies (Collection format - more robust)
 */
const COMPANY_COLLECTION_XML_REQUEST = `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        </STATICVARIABLES>
        <COLLECTIONNAME>Company</COLLECTIONNAME>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>
`;

export const fetchTallyCompanies = async (config: TallyConfig): Promise<string[]> => {
  const host = config.host || 'localhost';
  const url = `http://${host}:${config.port}`;

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

  const tryRequest = async (xmlPayload: string): Promise<string[]> => {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: xmlPayload,
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
  };

  try {
    // Attempt 1: Standard List of Companies Report XML
    const firstAttempt = await tryRequest(COMPANY_XML_REQUEST);
    if (firstAttempt.length > 0) {
      return firstAttempt;
    }
  } catch (error) {
    console.warn('First company fetch attempt failed, trying collection query...', error);
  }

  // Attempt 2: Collection-based Company XML
  try {
    const secondAttempt = await tryRequest(COMPANY_COLLECTION_XML_REQUEST);
    return secondAttempt;
  } catch (error) {
    console.error('All company fetch attempts failed:', error);
    throw error;
  }
};

export const fetchTallyData = async (config: TallyConfig, type: 'LEDGER' | 'VOUCHER'): Promise<any[]> => {
  const host = config.host || 'localhost';
  const url = `http://${host}:${config.port}`;

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

  const tryRequest = async (xmlPayload: string): Promise<any[]> => {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: xmlPayload,
    });

    if (!response.ok) {
      throw new Error(`Tally response error: ${response.statusText}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");

    // Helper to query elements with fallback tags (supports both uppercase and lowercase, and namespaced tags)
    const findNodeText = (parent: Element, selectors: string[]): string | null => {
      for (const selector of selectors) {
        try {
          const el = parent.querySelector(selector);
          if (el && el.textContent) {
            return el.textContent.trim();
          }
        } catch (e) {
          // ignore selector syntax failures
        }
      }
      
      // Fallback: manually scan child nodes to support custom or namespaced tags (e.g. UDF:NAME)
      const childNodes = parent.children;
      for (let i = 0; i < childNodes.length; i++) {
        const child = childNodes[i];
        const tagName = child.tagName || '';
        const cleanTagName = tagName.replace(/^.*:/, '').toUpperCase(); // strip namespace prefix
        
        for (const selector of selectors) {
          const cleanSelector = selector.replace(/^.*:/, '').toUpperCase();
          if (cleanTagName === cleanSelector && child.textContent) {
            return child.textContent.trim();
          }
        }
      }
      return null;
    };

    if (type === 'LEDGER') {
      const ledgers: Ledger[] = [];
      // Support finding <LEDGER> tags in namespaced or lowercase documents
      const ledgerNodes = Array.from(xmlDoc.querySelectorAll('LEDGER, ledger'))
        .concat(Array.from(xmlDoc.getElementsByTagNameNS('*', 'LEDGER')))
        .concat(Array.from(xmlDoc.getElementsByTagNameNS('*', 'ledger')));
        
      // Deduplicate nodes
      const uniqueLedgerNodes = Array.from(new Set(ledgerNodes));

      for (let i = 0; i < uniqueLedgerNodes.length; i++) {
        const node = uniqueLedgerNodes[i];
        const guid = node.getAttribute('REMOTEID') || node.getAttribute('remoteid') || `ledger-${i}`;
        
        const name = findNodeText(node, ['NAME', 'name', 'NAME.LIST > NAME']) || node.getAttribute('NAME') || node.getAttribute('name') || 'Unknown';
        const group = findNodeText(node, ['PARENT', 'parent', 'PARENTNAME', 'parentname', 'GROUP', 'group']) || 'Unknown';
        const rawBalance = findNodeText(node, ['OPENINGBALANCE', 'openingbalance', 'BALANCE', 'balance', 'AMOUNT', 'amount']) || '0';
        
        // Clean up Tally numbers which might look like "1,20,000.00 Dr" or "-120000.00"
        let balance = parseFloat(rawBalance.replace(/,/g, ''));
        if (isNaN(balance)) balance = 0;
        if (rawBalance.toUpperCase().includes('CR')) {
          balance = -Math.abs(balance);
        }

        ledgers.push({
          guid,
          name,
          group,
          balance,
          lastUpdated: new Date().toISOString(),
        });
      }
      return ledgers;
    } else {
      const vouchers: Voucher[] = [];
      const voucherNodes = Array.from(xmlDoc.querySelectorAll('VOUCHER, voucher'))
        .concat(Array.from(xmlDoc.getElementsByTagNameNS('*', 'VOUCHER')))
        .concat(Array.from(xmlDoc.getElementsByTagNameNS('*', 'voucher')));
        
      const uniqueVoucherNodes = Array.from(new Set(voucherNodes));

      for (let i = 0; i < uniqueVoucherNodes.length; i++) {
        const node = uniqueVoucherNodes[i];
        const guid = node.getAttribute('REMOTEID') || node.getAttribute('remoteid') || `voucher-${i}`;
        
        const rawType = findNodeText(node, ['VOUCHERTYPENAME', 'vouchertypename', 'VOUCHERTYPE', 'vouchertype']) || 'Sales';
        const date = findNodeText(node, ['DATE', 'date']) || 'Unknown';
        const party = findNodeText(node, ['PARTYLEDGERNAME', 'partyledgername', 'PARTYNAME', 'partyname', 'PARTY', 'party']) || 'Unknown';
        const rawAmount = findNodeText(node, ['AMOUNT', 'amount']) || '0';
        
        let amount = parseFloat(rawAmount.replace(/,/g, ''));
        if (isNaN(amount)) amount = 0;

        vouchers.push({
          guid,
          type: (rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase()) as Voucher['type'],
          date,
          party,
          amount,
          syncStatus: 'Pending',
        });
      }
      return vouchers;
    }
  };

  // Run the data fetching with fallbacks
  const primaryXml = type === 'LEDGER' ? LEDGER_XML_REQUEST : VOUCHER_XML_REQUEST;
  const secondaryXml = type === 'LEDGER' ? LEDGER_COLLECTION_XML_REQUEST : VOUCHER_COLLECTION_XML_REQUEST;

  try {
    // Attempt 1: Report XML
    const data = await tryRequest(primaryXml);
    if (data && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.warn(`Primary XML fetch failed for ${type}, trying secondary collection XML...`, error);
  }

  try {
    // Attempt 2: Collection XML (highly robust fallback)
    const data = await tryRequest(secondaryXml);
    return data;
  } catch (error) {
    console.error(`Both XML attempts failed for ${type}:`, error);
    throw error;
  }
};
