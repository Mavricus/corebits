import { ExternalTestRunner } from '../../src/index.js';
import { testPlan } from './fixtures/test-plan.fixture.js';

describe('ExternalTestRunner Integration', () => {
  const externalTestRunner = new ExternalTestRunner(global);

  externalTestRunner.run(testPlan);
});
