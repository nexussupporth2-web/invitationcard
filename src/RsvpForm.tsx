// @ts-nocheck
// R.S.V.P. card (traditional invitation style). Plain JSX (no type annotations)
// because the same source is embedded into downloaded HTML cards.
import React from 'react';

export const RSVP_DEFAULT = {
  regards: 'With warm regards & best compliments:',
  elders: ["[Grandparents' Names / Family Elders]"],
  parents: ["[Parents' Names]"],
  allLine: '& All Relatives and Friends',
  awaitLabel: 'Awaiting your presence:',
  contacts: [
    { id: 'c1', name: '[Name 1]', phone: '+91 98765 XXXXX' },
    { id: 'c2', name: '[Name 2]', phone: '+91 98765 XXXXX' },
  ],
  note: 'Kindly convey your travel plans and arrival details by [Date] so we may ensure a comfortable stay.',
};

function RsvpCard({ data, accent }) {
  const d = Object.assign({}, RSVP_DEFAULT, data || {});
  const acc = accent || '#d4a373';
  const elders = (d.elders || []).filter((x) => String(x).trim());
  const parents = (d.parents || []).filter((x) => String(x).trim());
  const contacts = (d.contacts || []).filter((c) => String(c.name || '').trim() || String(c.phone || '').trim());

  const digits = (p) => String(p || '').replace(/\D/g, '');
  const telHref = (p) => 'tel:' + (String(p).trim().startsWith('+') ? '+' : '') + digits(p);

  const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };
  const italic = { fontStyle: 'italic', color: '#6b5d52', fontSize: 13.5, lineHeight: 1.5, margin: 0 };
  const bold = { fontWeight: 700, color: acc, fontSize: 17, lineHeight: 1.45, margin: '2px 0' };

  return (
    <div style={{ ...serif, maxWidth: 440, margin: '0 auto', textAlign: 'center', background: 'rgba(255,255,255,.92)', border: '1px solid #ebdcd0', borderRadius: 20, padding: '24px 18px', boxShadow: '0 6px 18px rgba(0,0,0,.08)', color: '#4a3426' }}>
      {d.regards ? <p style={italic}>{d.regards}</p> : null}

      <div style={{ margin: '10px 0' }}>
        {elders.map((x, i) => <p key={'e' + i} style={bold}>{x}</p>)}
        {parents.map((x, i) => <p key={'p' + i} style={bold}>{x}</p>)}
      </div>

      {d.allLine ? <p style={{ ...italic, fontSize: 14.5 }}>{d.allLine}</p> : null}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
        <span style={{ flex: 1, height: 1, background: '#ebdcd0' }} />
        <span style={{ color: acc, fontSize: 16 }}>❦</span>
        <span style={{ flex: 1, height: 1, background: '#ebdcd0' }} />
      </div>

      {d.awaitLabel ? <p style={{ ...italic, marginBottom: 8 }}>{d.awaitLabel}</p> : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {contacts.map((c, i) => {
          const ok = digits(c.phone).length >= 8 && !/x/i.test(String(c.phone));
          return (
            <div key={c.id || i} style={{ fontSize: 15, lineHeight: 1.5 }}>
              <b>{c.name}{c.name && c.phone ? ':' : ''}</b>{' '}
              {ok ? (
                <>
                  <a href={telHref(c.phone)} style={{ color: acc, fontWeight: 700, textDecoration: 'none' }}>{c.phone}</a>{' '}
                  <a href={'https://wa.me/' + digits(c.phone)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} title="WhatsApp">💬</a>
                </>
              ) : (
                <span>{c.phone}</span>
              )}
            </div>
          );
        })}
      </div>

      {d.note ? (
        <p style={{ ...italic, marginTop: 18, padding: '12px 14px', background: '#fcf8f5', border: '1px dashed #d4a373', borderRadius: 12 }}>{d.note}</p>
      ) : null}
    </div>
  );
}

export default RsvpCard;
