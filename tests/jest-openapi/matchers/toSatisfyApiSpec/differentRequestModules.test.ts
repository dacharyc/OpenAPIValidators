import type { AxiosStatic, AxiosResponse } from 'axios';
import path from 'path';
import type { Server } from 'http';
import jestOpenAPI from 'jest-openapi';
import { str } from '../../../../commonTestResources/utils';
import app from '../../../../commonTestResources/exampleApp';

const pathToApiSpec = path.resolve(
  path.resolve(
    process.cwd(),
    'commonTestResources/exampleOpenApiFiles/valid/openapi3.yml',
  ),
);

describe('parsing responses from different request modules', () => {
  let server: Server;
  let appOrigin: string;
  beforeAll(() => {
    jestOpenAPI(pathToApiSpec);

    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        const port =
          typeof address === 'object' && address ? address.port : 5000;
        appOrigin = `http://localhost:${port}`;
        resolve();
      });
    });
  });
  afterAll(
    () =>
      new Promise<void>((resolve, reject) => {
        if (server)
          server.close((err?: Error) => (err ? reject(err) : resolve()));
        else resolve();
      }),
  );

  describe('axios', () => {
    let axios: AxiosStatic;
    beforeAll(async () => {
      axios = (await import('axios')).default;
    });

    describe('res header is application/json, and res.body is a string', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        if (!appOrigin) throw new Error('appOrigin is undefined');
        try {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/string`,
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Axios request failed:', err);
          throw err;
        }
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(str({ body: 'res.body is a string' }));
      });
    });

    describe('res header is application/json, and res.body is {}', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        if (!appOrigin) throw new Error('appOrigin is undefined');
        try {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/emptyObject`,
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Axios request failed:', err);
          throw err;
        }
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(str({ body: {} }));
      });
    });

    describe('res header is text/html, res.body is {}, and res.text is a string', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        if (!appOrigin) throw new Error('appOrigin is undefined');
        try {
          res = await axios.get(`${appOrigin}/header/text/html`);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Axios request failed:', err);
          throw err;
        }
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(str({ body: 'res.body is a string' }));
      });
    });
    describe('res header is application/json, and res.body is a null', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        if (!appOrigin) throw new Error('appOrigin is undefined');
        try {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/nullable`,
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Axios request failed:', err);
          throw err;
        }
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(str({ body: null }));
      });
    });

    describe('res has no content-type header, and res.body is empty string', () => {
      let res: AxiosResponse;
      beforeAll(async () => {
        if (!appOrigin) throw new Error('appOrigin is undefined');
        try {
          res = await axios.get(
            `${appOrigin}/no/content-type/header/and/no/response/body`,
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Axios request failed:', err);
          throw err;
        }
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(str({ body: '' }));
      });
    });
  });
});
