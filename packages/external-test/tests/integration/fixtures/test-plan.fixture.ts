import { IExternalTestDescribe } from '../../../src/types.js';

export const testPlan: IExternalTestDescribe = {
  description: 'Root Suite',
  items: [
    {
      description: 'Root Test',
      test: () => {
        expect(true).not.toBe(false);
      },
    },
    {
      description: 'Nested Suite A',
      items: [
        {
          description: 'Nested Test A1',
          test: () => {
            expect(true).not.toBe(false);
          },
        },
        {
          description: 'Nested Test A2',
          test: () => {
            expect(true).toBe(true);
          },
        },
      ],
    },
    {
      description: 'Nested Suite B',
      items: [
        {
          description: 'Nested Test B1',
          test: () => {
            expect(true).toBe(true);
            return Promise.resolve();
          },
        },
        {
          description: 'Nested Test B2',
          test: () => {
            expect(true).not.toBe(false);
            return Promise.resolve();
          },
        },
      ],
    },
  ],
};
