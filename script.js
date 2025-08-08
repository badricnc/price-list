// script.js — shared loader + helpers
const CSV_LINK = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4gOi3FoAsMGgM_3yQnfJwLAPVd0Uj-fo8qBXg9m2kWGp_AeKee_zmqb_XejPW4hs2OGAIPsccALkI/pub?output=csv';

// Simple CSV parser that handles commas inside quotes
function parseCSV(text){
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if(!lines.length) return [];
  const headers = lines[0].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(h=>h.replace(/^"|"$/g,'').trim());
  const rows = lines.slice(1).map(line => {
    const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c=>c.replace(/^"|"$/g,'').trim());
    const obj = {};
    headers.forEach((h,i)=> obj[h]= (cols[i]!==undefined)?cols[i]:'' );
    return obj;
  });
  return rows;
}

async function loadCSVData(){
  if(window._cachedData) return window._cachedData;
  const res = await fetch(CSV_LINK);
  if(!res.ok) throw new Error('Failed to load sheet: '+res.status);
  const txt = await res.text();
  const data = parseCSV(txt);
  // Ensure columns exist (Brand,Product,Size,Price)
  window._cachedData = data.map(r=>({
    Brand: (r.Brand||r.brand||'').trim(),
    Product: (r.Product||r.product||'').trim(),
    Size: (r.Size||r.size||'').trim(),
    Price: (r.Price||r.price||'').trim()
  }));
  return window._cachedData;
}

function formatPrice(raw){
  if(!raw) return '';
  const n = Number(String(raw).replace(/[^0-9.\-]/g,''));
  if(!isNaN(n)) return '\u20B9 ' + n.toLocaleString('en-IN');
  return raw;
}

// expose helpers to pages
window.loadCSVData = loadCSVData;
window.formatPrice = formatPrice;
