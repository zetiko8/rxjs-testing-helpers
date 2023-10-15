# RxjsTestingHelpers

## Getting started

`npm i rombok`

```typescript
import { Process } from 'rombok';

it('passess', () => {
  new TestScheduler(assertDeepEqual)
    .run(({ cold, expectObservable }) => {
        expectObservable('-a')
            .toBe('-a';)
        // passes
    });
})

it('fails with good reporting', () => {
  new TestScheduler(assertDeepEqual)
    .run(({ cold, expectObservable }) => {
        expectObservable('-a')
            .toBe('-b';)
        // fails
        // E: '.b'
        // A: '.a'
    });
})
```