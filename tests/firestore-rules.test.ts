import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { setDoc, doc, getDoc } from 'firebase/firestore';

/**
 * Firestore Security Rules Unit Tests
 * 
 * To run these tests:
 * 1. Install testing dependency: npm i -D @firebase/rules-unit-testing
 * 2. Start Firestore emulator: firebase emulators:start --only firestore
 * 3. Run test runner (Jest/Mocha/Vitest) pointing to this file.
 */

const PROJECT_ID = 'test-portfolio-rules';

describe('Firestore Security Rules Unit Tests', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: '127.0.0.1',
        port: 8080
      }
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  // 1. anonymous user write kare to fail ho
  test('1. anonymous user write kare to fail ho', async () => {
    const unauthedCtx = testEnv.unauthenticatedContext();
    const db = unauthedCtx.firestore();
    const testDoc = doc(db, 'projects', 'test-proj');

    await assertFails(
      setDoc(testDoc, { title: 'Hacked Project', description: 'Exploit' })
    );
  });

  // 2. verified admin write kare to pass ho
  test('2. verified admin write kare to pass ho', async () => {
    const adminCtx = testEnv.authenticatedContext('admin_uid_123', {
      email: 'admin@portfolio.dev',
      email_verified: true,
      admin: true
    });
    const db = adminCtx.firestore();
    const testDoc = doc(db, 'projects', 'test-proj');

    await assertSucceeds(
      setDoc(testDoc, { title: 'Verified Admin Project', description: 'Legitimate' })
    );
  });

  // 3. admin: true claim ke bina write fail ho
  test('3. admin: true claim ke bina write fail ho', async () => {
    // Authenticated and email verified, but missing `admin: true` claim
    const nonAdminCtx = testEnv.authenticatedContext('regular_user_uid', {
      email: 'regular@portfolio.dev',
      email_verified: true,
      admin: false
    });
    const db = nonAdminCtx.firestore();
    const testDoc = doc(db, 'projects', 'test-proj');

    await assertFails(
      setDoc(testDoc, { title: 'Unauthorized write attempt' })
    );
  });

  // 4. kisi anjaan collection ka read fail ho
  test('4. kisi anjaan collection ka read fail ho', async () => {
    const unauthedCtx = testEnv.unauthenticatedContext();
    const db = unauthedCtx.firestore();
    const unknownDoc = doc(db, 'unknown_secrets', 'secret-doc');

    await assertFails(
      getDoc(unknownDoc)
    );
  });
});
