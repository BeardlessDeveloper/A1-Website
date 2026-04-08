import { useState } from 'react';

const API_URL = import.meta.env.PUBLIC_API_URL ?? 'https://api.a1paralegal.com';

type IntakeType = '' | 'trust' | 'trust_amendment' | 'trust_restatement' | 'will';
type Status = 'idle' | 'submitting' | 'success' | 'error';

interface ClientInfo {
  name: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
}

interface Child {
  name: string;
  parent: string;
}

interface AmendmentArticle {
  article: string;
  details: string;
}

interface FinancialAccount {
  institution: string;
  type: string;
  number: string;
  notes: string;
}

interface Property {
  street: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  apn: string;
}

interface Vehicle {
  year: string;
  make: string;
  model: string;
  vin: string;
}

const emptyClient = (): ClientInfo => ({ name: '', gender: '', dob: '', phone: '', email: '' });
const emptyChild = (): Child => ({ name: '', parent: 'both' });
const emptyArticle = (): AmendmentArticle => ({ article: '', details: '' });
const emptyAccount = (): FinancialAccount => ({ institution: '', type: '', number: '', notes: '' });
const emptyProperty = (): Property => ({ street: '', city: '', state: '', zip: '', county: '', apn: '' });
const emptyVehicle = (): Vehicle => ({ year: '', make: '', model: '', vin: '' });

export default function IntakeForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [intakeType, setIntakeType] = useState<IntakeType>('');
  const [trustName, setTrustName] = useState('');
  const [trustDate, setTrustDate] = useState('');
  const [amendmentArticles, setAmendmentArticles] = useState<AmendmentArticle[]>([emptyArticle()]);
  const [client1, setClient1] = useState<ClientInfo>(emptyClient());
  const [client2, setClient2] = useState<ClientInfo>(emptyClient());
  const [children, setChildren] = useState<Child[]>([emptyChild()]);
  const [childrenNotes, setChildrenNotes] = useState('');
  const [distributionInstructions, setDistributionInstructions] = useState('');
  const [trustees, setTrustees] = useState(['', '', '', '']);
  const [personalReps, setPersonalReps] = useState(['', '', '', '']);
  const [poa, setPoa] = useState(['', '', '', '']);
  const [hpoa, setHpoa] = useState([
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
    { name: '', phone: '', email: '' },
  ]);
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccount[]>([emptyAccount()]);
  const [primaryProperty, setPrimaryProperty] = useState({
    street: '', city: '', state: '', zip: '', county: '', account: '', acres: '', map: '',
  });
  const [additionalProperties, setAdditionalProperties] = useState<Property[]>([emptyProperty()]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([emptyVehicle()]);
  const [generalNotes, setGeneralNotes] = useState('');

  const isWill = intakeType === 'will';
  const isAmendment = intakeType === 'trust_amendment';
  const showTrustDate = isAmendment || intakeType === 'trust_restatement';
  const showTrustSections = !isWill;

  // --- Helpers ---

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function isValidEmail(email: string): boolean {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function updateList<T>(list: T[], index: number, patch: Partial<T>): T[] {
    return list.map((item, i) => (i === index ? { ...item, ...patch } : item));
  }

  function addRow<T>(list: T[], factory: () => T, max = 20): T[] {
    return list.length < max ? [...list, factory()] : list;
  }

  function removeRow<T>(list: T[], index: number): T[] {
    return list.length > 1 ? list.filter((_, i) => i !== index) : list;
  }

  // --- Submit ---

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!intakeType) return;
    const allEmails = [client1.email, client2.email, ...hpoa.map(h => h.email)];
    if (allEmails.some(e => !isValidEmail(e))) return;
    setStatus('submitting');

    const payload = {
      intakeType,
      trustName: showTrustSections ? trustName : '',
      trustDate: showTrustDate ? trustDate : '',
      amendmentArticles: isAmendment ? amendmentArticles.filter(a => a.article || a.details) : [],
      client1,
      client2: client2.name ? client2 : null,
      children: children.filter(c => c.name),
      childrenNotes,
      distributionInstructions,
      trustees: showTrustSections ? trustees.filter(Boolean) : [],
      personalReps: personalReps.filter(Boolean),
      poa: poa.filter(Boolean),
      hpoa: hpoa.filter(h => h.name),
      financialAccounts: showTrustSections ? financialAccounts.filter(a => a.institution) : [],
      primaryProperty: showTrustSections ? primaryProperty : null,
      additionalProperties: showTrustSections ? additionalProperties.filter(p => p.street) : [],
      vehicles: showTrustSections ? vehicles.filter(v => v.make || v.year) : [],
      generalNotes,
    };

    try {
      const res = await fetch(`${API_URL}/submit-intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="alert alert--success intake-success" role="alert">
        <h3>Your intake has been submitted!</h3>
        <p>
          Thank you. We received your information and will be in touch shortly to confirm your
          appointment and discuss next steps. If you have questions in the meantime, call us at{' '}
          <a href="tel:+15414742260">541-474-2260</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="form intake-form" onSubmit={handleSubmit} noValidate>
      {status === 'error' && (
        <div className="alert alert--error" role="alert">
          Something went wrong. Please try again or call us at 541-474-2260.
        </div>
      )}

      {/* ── Intake Type ── */}
      <div className="intake-section">
        <h2 className="intake-section__heading">Document Type</h2>
        <div className="intake-grid-2">
          <label>
            Type*
            <select value={intakeType} onChange={e => setIntakeType(e.target.value as IntakeType)} required>
              <option value="">— Select —</option>
              <option value="trust">Trust</option>
              <option value="trust_amendment">Trust Amendment</option>
              <option value="trust_restatement">Trust Restatement</option>
              <option value="will">Will</option>
            </select>
          </label>
        </div>
      </div>

      {intakeType && (
        <>
          {/* ── Trust / Document Details ── */}
          {showTrustSections && (
            <div className="intake-section">
              <h2 className="intake-section__heading">Trust Details</h2>
              <div className="intake-grid-2">
                <label>
                  Trust Name*
                  <input
                    type="text"
                    value={trustName}
                    onChange={e => setTrustName(e.target.value.toUpperCase())}
                    required
                    placeholder="e.g. The Smith Family Trust"
                  />
                </label>
                {showTrustDate && (
                  <label>
                    Original Trust Date*
                    <input
                      type="date"
                      value={trustDate}
                      onChange={e => setTrustDate(e.target.value)}
                      required
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* ── Amendment Articles ── */}
          {isAmendment && (
            <div className="intake-section">
              <h2 className="intake-section__heading">Articles to Be Amended</h2>
              <p className="intake-note">List each article or section you want changed.</p>
              {amendmentArticles.map((row, i) => (
                <div key={i} className="intake-repeater-row">
                  <div className="intake-grid-2">
                    <label>
                      Article / Section
                      <input
                        type="text"
                        value={row.article}
                        onChange={e => setAmendmentArticles(updateList(amendmentArticles, i, { article: e.target.value }))}
                        placeholder="e.g. Article IV, Section 2"
                      />
                    </label>
                    <label>
                      Amendment Details
                      <textarea
                        rows={3}
                        value={row.details}
                        onChange={e => setAmendmentArticles(updateList(amendmentArticles, i, { details: e.target.value }))}
                        placeholder="Describe the change or new language."
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="intake-remove-btn"
                    onClick={() => setAmendmentArticles(removeRow(amendmentArticles, i))}
                    disabled={amendmentArticles.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="intake-add-btn" onClick={() => setAmendmentArticles(addRow(amendmentArticles, emptyArticle))}>
                + Add Article
              </button>
            </div>
          )}

          {/* ── Client 1 ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Client 1</h2>
            <div className="intake-grid-3">
              <label>
                Full Name*
                <input
                  type="text"
                  value={client1.name}
                  onChange={e => setClient1({ ...client1, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Gender
                <select value={client1.gender} onChange={e => setClient1({ ...client1, gender: e.target.value })}>
                  <option value="">— Select —</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label>
                Date of Birth
                <input type="date" value={client1.dob} onChange={e => setClient1({ ...client1, dob: e.target.value })} />
              </label>
              <label>
                Phone
                <input type="tel" value={client1.phone} onChange={e => setClient1({ ...client1, phone: formatPhone(e.target.value) })} placeholder="(555) 123-4567" />
              </label>
              <label>
                Email
                <input type="email" value={client1.email} onChange={e => setClient1({ ...client1, email: e.target.value })} />
                {!isValidEmail(client1.email) && <span className="field-error">Enter a valid email address.</span>}
              </label>
            </div>
          </div>

          {/* ── Client 2 ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Client 2 <span className="intake-optional">(if applicable)</span></h2>
            <div className="intake-grid-3">
              <label>
                Full Name
                <input type="text" value={client2.name} onChange={e => setClient2({ ...client2, name: e.target.value })} />
              </label>
              <label>
                Gender
                <select value={client2.gender} onChange={e => setClient2({ ...client2, gender: e.target.value })}>
                  <option value="">— Select —</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label>
                Date of Birth
                <input type="date" value={client2.dob} onChange={e => setClient2({ ...client2, dob: e.target.value })} />
              </label>
              <label>
                Phone
                <input type="tel" value={client2.phone} onChange={e => setClient2({ ...client2, phone: formatPhone(e.target.value) })} placeholder="(555) 123-4567" />
              </label>
              <label>
                Email
                <input type="email" value={client2.email} onChange={e => setClient2({ ...client2, email: e.target.value })} />
                {!isValidEmail(client2.email) && <span className="field-error">Enter a valid email address.</span>}
              </label>
            </div>
          </div>

          {/* ── Children ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Children <span className="intake-optional">(if applicable)</span></h2>
            {children.map((row, i) => (
              <div key={i} className="intake-repeater-row intake-repeater-row--inline">
                <label>
                  Child's Name
                  <input
                    type="text"
                    value={row.name}
                    onChange={e => setChildren(updateList(children, i, { name: e.target.value }))}
                  />
                </label>
                {client2.name && (
                  <label>
                    Whose Child
                    <select value={row.parent} onChange={e => setChildren(updateList(children, i, { parent: e.target.value }))}>
                      <option value="both">Both Clients</option>
                      <option value="client1">Client 1 Only</option>
                      <option value="client2">Client 2 Only</option>
                    </select>
                  </label>
                )}
                <button
                  type="button"
                  className="intake-remove-btn"
                  onClick={() => setChildren(removeRow(children, i))}
                  disabled={children.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="intake-add-btn" onClick={() => setChildren(addRow(children, emptyChild))}>
              + Add Child
            </button>
            <label className="intake-notes-label">
              Notes about children
              <textarea
                rows={3}
                value={childrenNotes}
                onChange={e => setChildrenNotes(e.target.value)}
                placeholder="Special circumstances, guardianship preferences, etc."
              />
            </label>
          </div>

          {/* ── Distribution Instructions ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Distribution Instructions</h2>
            <label>
              How should your assets be distributed?
              <textarea
                rows={5}
                value={distributionInstructions}
                onChange={e => setDistributionInstructions(e.target.value)}
                placeholder="Describe your wishes — percentages, specific gifts, conditions, timing, etc."
              />
            </label>
          </div>

          {/* ── Trustees (trust only) ── */}
          {showTrustSections && (
            <div className="intake-section">
              <h2 className="intake-section__heading">Trustees <span className="intake-optional">(up to 4, in order)</span></h2>
              <p className="intake-note">List your successor trustees in order of preference.</p>
              <div className="intake-grid-2">
                {trustees.map((val, i) => (
                  <label key={i}>
                    Trustee {i + 1}
                    <input
                      type="text"
                      value={val}
                      onChange={e => setTrustees(trustees.map((v, j) => j === i ? e.target.value : v))}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Personal Representatives ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Personal Representative / Executor <span className="intake-optional">(up to 4, in order)</span></h2>
            <p className="intake-note">The person who will carry out the instructions of your estate.</p>
            <div className="intake-grid-2">
              {personalReps.map((val, i) => (
                <label key={i}>
                  Personal Representative {i + 1}
                  <input
                    type="text"
                    value={val}
                    onChange={e => setPersonalReps(personalReps.map((v, j) => j === i ? e.target.value : v))}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* ── Financial Power of Attorney ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Financial Power of Attorney <span className="intake-optional">(up to 4, in order)</span></h2>
            <p className="intake-note">Who can manage your financial affairs if you are unable to.</p>
            <div className="intake-grid-2">
              {poa.map((val, i) => (
                <label key={i}>
                  Financial POA {i + 1}
                  <input
                    type="text"
                    value={val}
                    onChange={e => setPoa(poa.map((v, j) => j === i ? e.target.value : v))}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* ── Healthcare Power of Attorney ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Healthcare Power of Attorney <span className="intake-optional">(up to 4, in order)</span></h2>
            <p className="intake-note">Who can make medical decisions on your behalf.</p>
            <div className="intake-roster">
              <div className="intake-roster-head">
                <span>Agent Name</span>
                <span>Phone</span>
                <span>Email</span>
              </div>
              {hpoa.map((row, i) => (
                <div key={i} className="intake-roster-row">
                  <label>
                    HCPOA {i + 1} Name
                    <input type="text" value={row.name} onChange={e => setHpoa(updateList(hpoa, i, { name: e.target.value }))} />
                  </label>
                  <label>
                    HCPOA {i + 1} Phone
                    <input type="tel" value={row.phone} onChange={e => setHpoa(updateList(hpoa, i, { phone: formatPhone(e.target.value) }))} placeholder="(555) 123-4567" />
                  </label>
                  <label>
                    HCPOA {i + 1} Email
                    <input type="email" value={row.email} onChange={e => setHpoa(updateList(hpoa, i, { email: e.target.value }))} />
                    {!isValidEmail(row.email) && <span className="field-error">Enter a valid email address.</span>}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ── Financial Accounts (trust only) ── */}
          {showTrustSections && (
            <div className="intake-section">
              <h2 className="intake-section__heading">Financial Accounts</h2>
              <p className="intake-note">Bank, brokerage, retirement, and other accounts to be included in the trust.</p>
              {financialAccounts.map((row, i) => (
                <div key={i} className="intake-repeater-row">
                  <div className="intake-grid-2">
                    <label>
                      Institution
                      <input
                        type="text"
                        value={row.institution}
                        onChange={e => setFinancialAccounts(updateList(financialAccounts, i, { institution: e.target.value }))}
                        placeholder="e.g. Chase Bank"
                      />
                    </label>
                    <label>
                      Account Type
                      <input
                        type="text"
                        value={row.type}
                        onChange={e => setFinancialAccounts(updateList(financialAccounts, i, { type: e.target.value }))}
                        placeholder="e.g. Checking, IRA, 401k"
                      />
                    </label>
                    <label>
                      Account # / Last 4 Digits
                      <input
                        type="text"
                        value={row.number}
                        onChange={e => setFinancialAccounts(updateList(financialAccounts, i, { number: e.target.value }))}
                      />
                    </label>
                    <label>
                      Notes
                      <input
                        type="text"
                        value={row.notes}
                        onChange={e => setFinancialAccounts(updateList(financialAccounts, i, { notes: e.target.value }))}
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="intake-remove-btn"
                    onClick={() => setFinancialAccounts(removeRow(financialAccounts, i))}
                    disabled={financialAccounts.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="intake-add-btn" onClick={() => setFinancialAccounts(addRow(financialAccounts, emptyAccount))}>
                + Add Account
              </button>
            </div>
          )}

          {/* ── Primary Property (trust only) ── */}
          {showTrustSections && (
            <div className="intake-section">
              <h2 className="intake-section__heading">Primary Property</h2>
              <div className="intake-grid-2">
                <label>
                  Street Address
                  <input type="text" value={primaryProperty.street} onChange={e => setPrimaryProperty({ ...primaryProperty, street: e.target.value })} />
                </label>
                <label>
                  City
                  <input type="text" value={primaryProperty.city} onChange={e => setPrimaryProperty({ ...primaryProperty, city: e.target.value })} />
                </label>
                <label>
                  State
                  <input type="text" value={primaryProperty.state} onChange={e => setPrimaryProperty({ ...primaryProperty, state: e.target.value })} maxLength={2} placeholder="OR" />
                </label>
                <label>
                  Zip
                  <input type="text" value={primaryProperty.zip} onChange={e => setPrimaryProperty({ ...primaryProperty, zip: e.target.value })} />
                </label>
                <label>
                  County
                  <input type="text" value={primaryProperty.county} onChange={e => setPrimaryProperty({ ...primaryProperty, county: e.target.value })} />
                </label>
                <label>
                  APN / Account #
                  <input type="text" value={primaryProperty.account} onChange={e => setPrimaryProperty({ ...primaryProperty, account: e.target.value })} placeholder="Tax account or parcel number" />
                </label>
                <label>
                  Acres
                  <input type="text" value={primaryProperty.acres} onChange={e => setPrimaryProperty({ ...primaryProperty, acres: e.target.value })} />
                </label>
                <label>
                  Map / Township
                  <input type="text" value={primaryProperty.map} onChange={e => setPrimaryProperty({ ...primaryProperty, map: e.target.value })} />
                </label>
              </div>
            </div>
          )}

          {/* ── Additional Properties (trust only) ── */}
          {showTrustSections && (
            <div className="intake-section">
              <h2 className="intake-section__heading">Additional Properties <span className="intake-optional">(if applicable)</span></h2>
              <p className="intake-note">Any other real property to be included in the trust.</p>
              {additionalProperties.map((row, i) => (
                <div key={i} className="intake-repeater-row">
                  <div className="intake-grid-2">
                    <label>
                      Street
                      <input type="text" value={row.street} onChange={e => setAdditionalProperties(updateList(additionalProperties, i, { street: e.target.value }))} />
                    </label>
                    <label>
                      City
                      <input type="text" value={row.city} onChange={e => setAdditionalProperties(updateList(additionalProperties, i, { city: e.target.value }))} />
                    </label>
                    <label>
                      State
                      <input type="text" value={row.state} onChange={e => setAdditionalProperties(updateList(additionalProperties, i, { state: e.target.value }))} maxLength={2} placeholder="OR" />
                    </label>
                    <label>
                      Zip
                      <input type="text" value={row.zip} onChange={e => setAdditionalProperties(updateList(additionalProperties, i, { zip: e.target.value }))} />
                    </label>
                    <label>
                      County
                      <input type="text" value={row.county} onChange={e => setAdditionalProperties(updateList(additionalProperties, i, { county: e.target.value }))} />
                    </label>
                    <label>
                      APN / Parcel
                      <input type="text" value={row.apn} onChange={e => setAdditionalProperties(updateList(additionalProperties, i, { apn: e.target.value }))} />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="intake-remove-btn"
                    onClick={() => setAdditionalProperties(removeRow(additionalProperties, i))}
                    disabled={additionalProperties.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="intake-add-btn" onClick={() => setAdditionalProperties(addRow(additionalProperties, emptyProperty))}>
                + Add Property
              </button>
            </div>
          )}

          {/* ── Vehicles (trust only) ── */}
          {showTrustSections && (
            <div className="intake-section">
              <h2 className="intake-section__heading">Vehicles <span className="intake-optional">(if applicable)</span></h2>
              <p className="intake-note">Vehicles to be included in the trust.</p>
              {vehicles.map((row, i) => (
                <div key={i} className="intake-repeater-row">
                  <div className="intake-grid-4">
                    <label>
                      Year
                      <input type="text" value={row.year} onChange={e => setVehicles(updateList(vehicles, i, { year: e.target.value }))} maxLength={4} placeholder="2022" />
                    </label>
                    <label>
                      Make
                      <input type="text" value={row.make} onChange={e => setVehicles(updateList(vehicles, i, { make: e.target.value }))} placeholder="Toyota" />
                    </label>
                    <label>
                      Model
                      <input type="text" value={row.model} onChange={e => setVehicles(updateList(vehicles, i, { model: e.target.value }))} placeholder="Camry" />
                    </label>
                    <label>
                      VIN
                      <input type="text" value={row.vin} onChange={e => setVehicles(updateList(vehicles, i, { vin: e.target.value }))} />
                    </label>
                  </div>
                  <button
                    type="button"
                    className="intake-remove-btn"
                    onClick={() => setVehicles(removeRow(vehicles, i))}
                    disabled={vehicles.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="intake-add-btn" onClick={() => setVehicles(addRow(vehicles, emptyVehicle))}>
                + Add Vehicle
              </button>
            </div>
          )}

          {/* ── Notes ── */}
          <div className="intake-section">
            <h2 className="intake-section__heading">Additional Notes <span className="intake-optional">(optional)</span></h2>
            <label>
              Anything else we should know?
              <textarea
                rows={5}
                value={generalNotes}
                onChange={e => setGeneralNotes(e.target.value)}
                placeholder="Special instructions, questions, or any other details."
              />
            </label>
          </div>

          {/* ── Submit ── */}
          <div className="intake-actions">
            <button className="btn btn--primary" type="submit" disabled={status === 'submitting' || !client1.name}>
              {status === 'submitting' ? 'Submitting…' : 'Submit Intake'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
