import assert from 'node:assert';
import { 
  hashPassword, 
  verifyPassword, 
  generateSessionSignature, 
  validateSessionIntegrity, 
  enforceFoodSafetyGateIntegrity 
} from '../src/utils/security.js';

console.log('🧪 Running REPLATE Frontend Security & Fixes Verification Suite...\n');

// 1. Password Hashing & Verification
console.log('--- 1. Salted SHA-256 Password Security ---');
const plainPass = 'SuperSecret2026!';
const hashed = hashPassword(plainPass);
assert(hashed.startsWith('sha256:'), 'Hashed password must start with sha256: scheme');
assert(hashed.length === 71, `Hashed password length must be 71 characters (got ${hashed.length})`);
assert(verifyPassword(plainPass, hashed), 'Valid password must verify true against hash');
assert(!verifyPassword('WrongPass123', hashed), 'Invalid password must return false');
// Legacy password compatibility check
assert(verifyPassword('supplier123', 'supplier123'), 'Legacy plain demo password must still verify');
assert(verifyPassword('admin123', 'plain:admin123'), 'Legacy plain: prefixed password must verify');
console.log('  ✅ [PASS] 1.1 Password hashing & SHA-256 verification works with backwards compatibility');

// 2. Session Integrity Signature & Anti Role Spoofing
console.log('\n--- 2. Session Integrity & Anti-Tampering ---');
const genuineSupplier = {
  id: 'usr-registered-101',
  username: 'chefkatering',
  role: 'supplier',
  email: 'chef@katering.id'
};
const signature = generateSessionSignature(genuineSupplier);
assert(typeof signature === 'string' && signature.length === 64, 'Signature must be 64-char hex SHA-256');

// Normal valid session
const validSession = { ...genuineSupplier, signature };
const verifiedSession = validateSessionIntegrity(validSession, [genuineSupplier]);
assert(verifiedSession.role === 'supplier', 'Genuine role must be preserved');

// Attacker attempts privilege escalation by mutating role to 'admin' in localStorage
const tamperedSession = { ...genuineSupplier, role: 'admin', signature };
const fixedSession = validateSessionIntegrity(tamperedSession, [genuineSupplier]);
assert(fixedSession.role === 'supplier', 'Tampered admin role must be forcibly demoted back to genuine registered role');
console.log('  ✅ [PASS] 2.1 Session validation automatically neutralizes client-side role privilege escalation');

// 3. Food Safety Gate Client Tamper Guard
console.log('\n--- 3. Food Safety Gate Integrity Guard ---');
const falsifiedReport = {
  id: 'rep-hack',
  foodTypeId: 'cooked_rice',
  safetyConditionId: 'clear_spoilage', // Clear spoilage
  packagingConditionId: 'damaged_open',
  storageDurationHours: 12,
  foodSafetyGate: {
    status: 'PASS', // Attacker falsely claimed PASS
    route: 'HUMAN_DONATION'
  }
};
const sanitizedReport = enforceFoodSafetyGateIntegrity(falsifiedReport);
assert(sanitizedReport.foodSafetyGate.status === 'REJECT', 'Falsified PASS on spoiled food must be forcibly overridden to REJECT');
assert(!sanitizedReport.foodSafetyGate.eligibleForConsumptionRecommendation, 'Consumption recommendation must be false');
assert(sanitizedReport.foodSafetyGate.alternativeRouteRecommendation?.route, 'Must recommend an alternative non-human route');
console.log('  ✅ [PASS] 3.1 Food Safety Gate tamper guard overrides forged PASS to REJECT & disables human consumption');

console.log('\n🎉 All Frontend Fixes Verification tests passed successfully!\n');
