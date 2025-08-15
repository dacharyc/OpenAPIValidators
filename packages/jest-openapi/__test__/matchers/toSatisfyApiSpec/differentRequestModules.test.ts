
import type { AxiosStatic, AxiosResponse } from 'axios';
import path from 'path';
import supertest, { Response as SuperAgentResponse } from 'supertest';
import type { Server } from 'http';
import { str } from '../../../../../commonTestResources/utils';
import app from '../../../../../commonTestResources/exampleApp';
import jestOpenAPI from '../../..';


const pathToApiSpec = path.resolve(
  '../../commonTestResources/exampleOpenApiFiles/valid/openapi3.yml',
);

jestOpenAPI(pathToApiSpec);

describe('Parsing responses from different request modules', () => {
  let server: Server;
  let appOrigin: string;
  beforeAll(() => {
    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        const port = typeof address === 'object' && address ? address.port : 5000;
        appOrigin = `http://localhost:${port}`;
        resolve();
      });
    });
  });
  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      if (server) server.close((err?: Error) => (err ? reject(err) : resolve()));
      else resolve();
    });
  });

  // These tests cover both supertest and chai-http, because they make requests the same way (using superagent)
  describe('supertest', () => {
    describe('res header is application/json, and res.body is a string', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/string',
        );
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
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/emptyObject',
        );
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
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get('/header/text/html');
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({ body: {}, text: 'res.body is a string' }),
        );
      });
    });

    describe('res header is application/json, and res.body is a null', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/nullable',
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(str({ body: null }));
      });
    });

    describe('res has no content-type header, res.body is {}, and res.text is empty string', () => {
      let res: SuperAgentResponse;
      beforeAll(async () => {
        res = await supertest(app).get(
          '/no/content-type/header/and/no/response/body',
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(str({ body: {}, text: '' }));
      });
    });
  });

  describe('axios (as request-promise replacement)', () => {
  let axios: AxiosStatic;
    beforeAll(async () => {
      axios = (await import('axios')).default;
    });
    describe('res header is application/json, and res.body is a null', () => {
  let res: AxiosResponse;
      beforeAll(async () => {
        res = await axios.get(
          `${appOrigin}/header/application/json/and/responseBody/nullable`
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({ body: null }),
        );
      });
    });

    describe('res has no content-type header, and res.body is empty string', () => {
  let res: AxiosResponse;
      beforeAll(async () => {
        res = await axios.get(
          `${appOrigin}/no/content-type/header/and/no/response/body`
        );
      });
      it('passes', () => {
        expect(res).toSatisfyApiSpec();
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).not.toSatisfyApiSpec();
        expect(assertion).toThrow(
          str({ body: '' }),
        );
      });
    });
  });
});



