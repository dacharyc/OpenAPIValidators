import chai from 'chai';
import path from 'path';
import chaiHttp from 'chai-http';
import axios, { AxiosResponse } from 'axios';
import supertest, { Response as SuperAgentResponse } from 'supertest';

import { str } from '../../../../../commonTestResources/utils';
import app from '../../../../../commonTestResources/exampleApp';
import chaiResponseValidator from '../../..';

// const appOrigin = `http://localhost:${port}`;
const pathToApiSpec = path.resolve(
  '../../commonTestResources/exampleOpenApiFiles/valid/openapi3.yml',
);
const { expect, AssertionError } = chai;

describe('Parsing responses from different request modules', () => {
  before(() => {
    chai.use(chaiResponseValidator(pathToApiSpec));
  });

  describe('chai-http', () => {
    chai.use(chaiHttp);

    describe('res header is application/json, and res.body is a string', () => {
      let res: ChaiHttp.Response;
      before(async () => {
        res = await chai
          .request(app)
          .get('/header/application/json/and/responseBody/string');
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is {}', () => {
      let res: ChaiHttp.Response;
      before(async () => {
        res = await chai
          .request(app)
          .get('/header/application/json/and/responseBody/emptyObject');
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: {},
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is a boolean (false)', () => {
      let res: ChaiHttp.Response;
      before(async () => {
        res = await chai
          .request(app)
          .get('/header/application/json/and/responseBody/boolean');
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: false,
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is a null', () => {
      let res: ChaiHttp.Response;
      before(async () => {
        res = await chai
          .request(app)
          .get('/header/application/json/and/responseBody/nullable');
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: null,
          }),
        );
      });
    });

    let res: ChaiHttp.Response;
    before(async () => {
      res = await chai.request(app).get('/header/text/html');
    });
    it('passes', () => {
      expect(res).to.satisfyApiSpec;
    });
    it('fails when using .not', () => {
      const assertion = () => expect(res).to.not.satisfyApiSpec;
      expect(assertion).to.throw(
        AssertionError,
        str({
          body: {},
          text: 'res.body is a string',
        }),
      );
    });
  });
  // SUPERTEST TESTS
  describe('supertest', () => {
    let server: ReturnType<typeof app.listen>;
    before((done) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (typeof address === 'object' && address && 'port' in address) {
          // port assigned for supertest, but not used directly
        } else {
          throw new Error('Could not determine server port');
        }
        done();
      });
    });
    after(() => {
      server.close();
    });

    describe('res header is application/json, and res.body is a string', () => {
      let res: SuperAgentResponse;
      before(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/string',
        );
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is {}', () => {
      let res: SuperAgentResponse;
      before(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/emptyObject',
        );
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: {},
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is a boolean (false)', () => {
      let res: SuperAgentResponse;
      before(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/boolean',
        );
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: false,
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is a null', () => {
      let res: SuperAgentResponse;
      before(async () => {
        res = await supertest(app).get(
          '/header/application/json/and/responseBody/nullable',
        );
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: null,
          }),
        );
      });
    });

    describe('res header is text/html, res.body is a string', () => {
      let res: SuperAgentResponse;
      before(async () => {
        res = await supertest(app).get('/header/text/html');
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: {},
            text: 'res.body is a string',
          }),
        );
      });
    });
  });
  // AXIOS TESTS (moved out of chai-http block)
  describe('axios', () => {
    let server: ReturnType<typeof app.listen>;
    let axiosPort: number;
    let appOrigin: string;
    before((done) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (typeof address === 'object' && address && 'port' in address) {
          axiosPort = address.port;
          appOrigin = `http://localhost:${axiosPort}`;
        } else {
          throw new Error('Could not determine server port');
        }
        done();
      });
    });
    after(() => {
      server.close();
    });

    describe('res header is application/json, and res.body is a string', () => {
      let res: AxiosResponse;
      before(async () => {
        res = await axios.get(
          `${appOrigin}/header/application/json/and/responseBody/string`,
        );
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is {}', () => {
      let res: AxiosResponse;
      before(async () => {
        res = await axios.get(
          `${appOrigin}/header/application/json/and/responseBody/emptyObject`,
        );
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: {},
          }),
        );
      });
    });

    describe('res header is text/html, res.body is a string', () => {
      let res: AxiosResponse;
      before(async () => {
        res = await axios.get(`${appOrigin}/header/text/html`);
      });
      it('passes', () => {
        expect(res).to.satisfyApiSpec;
      });
      it('fails when using .not', () => {
        const assertion = () => expect(res).to.not.satisfyApiSpec;
        expect(assertion).to.throw(
          AssertionError,
          str({
            body: 'res.body is a string',
          }),
        );
      });
    });

    describe('res header is application/json, and res.body is a null', () => {
      let res: AxiosResponse;
      before(async () => {
        res = await axios.get(
          `${appOrigin}/header/application/json/and/responseBody/nullable`,
          { validateStatus: () => true },
        );
      });
      it('returns 200 and null body', () => {
        expect(res.status).to.equal(200);
        expect(res.data).to.equal(null);
      });
    });

    describe('res has no content-type header, and res.body is empty string', () => {
      let res: AxiosResponse;
      before(async () => {
        res = await axios.get(
          `${appOrigin}/no/content-type/header/and/no/response/body`,
          { validateStatus: () => true },
        );
      });
      it('returns 204 No Content', () => {
        expect(res.status).to.equal(204);
        expect(res.data).to.equal('');
      });
    });

    describe('axios (as request-promise replacement)', () => {
      describe('res header is application/json, and res.body is a string', () => {
        let res: AxiosResponse;
        before(async () => {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/string`,
            { validateStatus: () => true },
          );
        });
        it('passes', () => {
          expect(res).to.satisfyApiSpec;
        });
        it('fails when using .not', () => {
          const assertion = () => expect(res).to.not.satisfyApiSpec;
          expect(assertion).to.throw(
            AssertionError,
            str({ body: 'res.body is a string' }),
          );
        });
      });

      describe('res header is application/json, and res.body is {}', () => {
        let res: AxiosResponse;
        before(async () => {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/emptyObject`,
            { validateStatus: () => true },
          );
        });
        it('passes', () => {
          expect(res).to.satisfyApiSpec;
        });
        it('fails when using .not', () => {
          const assertion = () => expect(res).to.not.satisfyApiSpec;
          expect(assertion).to.throw(AssertionError, str({ body: {} }));
        });
      });

      describe('res header is text/html, res.body is a string', () => {
        let res: AxiosResponse;
        before(async () => {
          res = await axios.get(`${appOrigin}/header/text/html`, {
            validateStatus: () => true,
          });
        });
        it('passes', () => {
          expect(res).to.satisfyApiSpec;
        });
        it('fails when using .not', () => {
          const assertion = () => expect(res).to.not.satisfyApiSpec;
          expect(assertion).to.throw(
            AssertionError,
            str({ body: 'res.body is a string' }),
          );
        });
      });

      describe('res header is application/json, and res.body is a null', () => {
        let res: AxiosResponse;
        before(async () => {
          res = await axios.get(
            `${appOrigin}/header/application/json/and/responseBody/nullable`,
            { validateStatus: () => true },
          );
        });
        it('passes', () => {
          expect(res).to.satisfyApiSpec;
        });
        it('fails when using .not', () => {
          const assertion = () => expect(res).to.not.satisfyApiSpec;
          expect(assertion).to.throw(AssertionError, str({ body: null }));
        });
      });

      describe('res has no content-type header, and res.body is empty string', () => {
        let res: AxiosResponse;
        before(async () => {
          res = await axios.get(
            `${appOrigin}/no/content-type/header/and/no/response/body`,
            { validateStatus: () => true },
          );
        });
        it('passes', () => {
          expect(res).to.satisfyApiSpec;
        });
        it('fails when using .not', () => {
          const assertion = () => expect(res).to.not.satisfyApiSpec;
          expect(assertion).to.throw(AssertionError, str({ body: '' }));
        });
      });
    });
  });
});
