const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

function headers() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

export async function listRecords(
  table: string,
  params?: { filterByFormula?: string; fields?: string[] }
): Promise<AirtableRecord[]> {
  const url = new URL(`${AIRTABLE_API_URL}/${encodeURIComponent(table)}`);
  if (params?.filterByFormula) {
    url.searchParams.set("filterByFormula", params.filterByFormula);
  }
  if (params?.fields) {
    for (const field of params.fields) {
      url.searchParams.append("fields[]", field);
    }
  }

  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url.toString(), { headers: headers() });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Airtable listRecords error (${res.status}): ${body}`);
    }
    const data: AirtableListResponse = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

export async function createRecord(
  table: string,
  fields: Record<string, unknown>
): Promise<AirtableRecord> {
  const res = await fetch(
    `${AIRTABLE_API_URL}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ fields, typecast: true }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable createRecord error (${res.status}): ${body}`);
  }
  return res.json();
}

export async function updateRecord(
  table: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<AirtableRecord> {
  const res = await fetch(
    `${AIRTABLE_API_URL}/${encodeURIComponent(table)}/${recordId}`,
    {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ fields, typecast: true }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable updateRecord error (${res.status}): ${body}`);
  }
  return res.json();
}
