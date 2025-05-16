// types/jest-fetch-mock.d.ts
import "jest-fetch-mock";

declare global {
  var fetchMock: typeof fetch;
}
